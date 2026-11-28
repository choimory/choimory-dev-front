// @vitest-environment node

import { unstable_doesMiddlewareMatch } from 'next/experimental/testing/server';
import { NextRequest, type NextResponse } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { config, proxy } from '@/proxy';
import { ACCESS_COOKIE_NAME, SESSION_HINT_COOKIE_NAME } from '@/shared/auth/cookieNames';

const APP_ORIGIN = 'https://front.example.test';
const MEMBER_ORIGIN = 'https://member.example.test';
const ACCESS_TOKEN = 'test-access-token';
const ACCESS_COOKIE = `${ACCESS_COOKIE_NAME}=${ACCESS_TOKEN}`;
const HINT_COOKIE = `${SESSION_HINT_COOKIE_NAME}=1`;
const SESSION_COOKIES = `${ACCESS_COOKIE}; ${HINT_COOKIE}`;

/** 보호 페이지 요청을 만듭니다. */
function createRequest(path = '/me', cookie?: string): NextRequest {
  return new NextRequest(new URL(path, APP_ORIGIN), {
    headers: cookie ? { cookie } : undefined,
  });
}

/** 회원 API의 공통 형식으로 검증 응답을 만듭니다. */
function verifyResponse(status: number, name: string): Response {
  return Response.json({ code: status, name, message: name, data: null }, { status });
}

/** 프록시가 요청을 다음 처리 단계로 넘겼는지 확인합니다. */
function expectPassThrough(response: NextResponse): void {
  expect(response.headers.get('x-middleware-next')).toBe('1');
  expect(response.headers.get('location')).toBeNull();
}

/** 로그인 리다이렉트의 상태와 돌아갈 경로를 확인합니다. */
function expectLoginRedirect(response: NextResponse, next = '/me'): void {
  expect(response.status).toBe(307);
  expect(response.headers.get('location')).toBe(`${APP_ORIGIN}/login?next=${encodeURIComponent(next)}`);
}

describe('proxy', () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
    vi.stubEnv('MEMBER_API_BASE_URL', `${MEMBER_ORIGIN}/`);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('회원 API가 200을 응답하면 통과하고 검증 요청에 토큰과 2초 타임아웃을 전달한다', async () => {
    const timeout = vi.spyOn(AbortSignal, 'timeout');
    fetchMock.mockResolvedValue(verifyResponse(200, 'OK'));

    expectPassThrough(await proxy(createRequest('/me', ACCESS_COOKIE)));

    expect(timeout).toHaveBeenCalledExactlyOnceWith(2000);
    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
      `${MEMBER_ORIGIN}/v1/member/token/verify`,
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ Authorization: `Bearer ${ACCESS_TOKEN}` }),
        cache: 'no-store',
        redirect: 'error',
        signal: expect.any(AbortSignal),
      }),
    );
    expect(fetchMock.mock.calls[0][1]?.signal).toBe(timeout.mock.results[0].value);
  });

  it('세션 표시 쿠키만 있으면 회원 API를 호출하지 않고 통과한다', async () => {
    expectPassThrough(await proxy(createRequest('/me', HINT_COOKIE)));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each(['/me', '/feed/me/targets/target-keyboard'])(
    '쿠키가 없으면 %s 경로만 next에 넣어 로그인으로 이동한다',
    async (path) => {
      expectLoginRedirect(await proxy(createRequest(`${path}?tab=settings`)), path);
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );

  it('토큰이 만료됐고 세션 표시 쿠키가 있으면 자동 갱신을 위해 통과한다', async () => {
    fetchMock.mockResolvedValue(verifyResponse(401, 'TOKEN_EXPIRED'));

    const response = await proxy(createRequest('/me', SESSION_COOKIES));

    expectPassThrough(response);
    expect(response.headers.get('set-cookie')).toBeNull();
  });

  it('토큰이 만료됐고 세션 표시 쿠키가 없으면 로그인으로 이동한다', async () => {
    fetchMock.mockResolvedValue(verifyResponse(401, 'TOKEN_EXPIRED'));

    const response = await proxy(createRequest('/me', ACCESS_COOKIE));

    expectLoginRedirect(response);
    expect(response.headers.get('set-cookie')).toBeNull();
  });

  it.each(['INVALID_TOKEN', 'UNAUTHORIZED', 'OTHER_UNAUTHORIZED'])(
    '회원 API가 401 %s를 응답하면 액세스 토큰 쿠키만 삭제하고 로그인으로 이동한다',
    async (name) => {
      fetchMock.mockResolvedValue(verifyResponse(401, name));

      const response = await proxy(createRequest('/me', SESSION_COOKIES));

      expectLoginRedirect(response);
      expect(response.headers.getSetCookie()).toEqual([
        expect.stringMatching(/access_token=; Path=\/; Expires=Thu, 01 Jan 1970 00:00:00 GMT/i),
      ]);
    },
  );

  it.each([
    ['타임아웃', new DOMException('검증 시간 초과', 'TimeoutError')],
    ['네트워크 오류', new TypeError('검증 서버에 연결할 수 없음')],
  ])('%s가 발생하면 쿠키 변경 없이 로그인으로 이동한다', async (_name, error) => {
    fetchMock.mockRejectedValue(error);

    const response = await proxy(createRequest('/me', SESSION_COOKIES));

    expectLoginRedirect(response);
    expect(response.headers.get('set-cookie')).toBeNull();
  });

  it('회원 API가 500을 응답하면 쿠키 변경 없이 로그인으로 이동한다', async () => {
    fetchMock.mockResolvedValue(verifyResponse(500, 'INTERNAL_SERVER_ERROR'));

    const response = await proxy(createRequest('/me', SESSION_COOKIES));

    expectLoginRedirect(response);
    expect(response.headers.get('set-cookie')).toBeNull();
  });

  it.each([200, 401])('검증 응답이 %i이고 JSON 본문을 읽을 수 없으면 쿠키 변경 없이 로그인으로 이동한다', async (status) => {
    fetchMock.mockResolvedValue(new Response('<html>오류</html>', { status }));

    const response = await proxy(createRequest('/me', SESSION_COOKIES));

    expectLoginRedirect(response);
    expect(response.headers.get('set-cookie')).toBeNull();
  });

  it('회원 API 주소가 없으면 쿠키 변경 없이 로그인으로 이동한다', async () => {
    vi.stubEnv('MEMBER_API_BASE_URL', undefined);

    const response = await proxy(createRequest('/me', SESSION_COOKIES));

    expectLoginRedirect(response);
    expect(response.headers.get('set-cookie')).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('config.matcher', () => {
  const protectedRoutes = [
    ['/me', '/me'],
    ['/blog/me', '/blog/me'],
    ['/blog/following', '/blog/following'],
    ['/feed/me', '/feed/me'],
    ['/feed/me/targets/:targetId', '/feed/me/targets/target-keyboard'],
    ['/feed/observations', '/feed/observations'],
    ['/feed/observations/:observationId', '/feed/observations/observation-keyboard'],
    ['/feed/activities/:activityId', '/feed/activities/activity-keyboard'],
  ];

  it('보호 경로 8개에 각각 프리페치 제외 조건을 선언한다', () => {
    expect(config.matcher).toEqual(
      protectedRoutes.map(([source]) => ({
        source,
        missing: [
          { type: 'header', key: 'next-router-prefetch' },
          { type: 'header', key: 'purpose', value: 'prefetch' },
        ],
      })),
    );
  });

  it.each(protectedRoutes)('%s는 일반 요청에 적용하고 프리페치 요청은 제외한다', (_source, url) => {
    expect(unstable_doesMiddlewareMatch({ config, url })).toBe(true);
    expect(unstable_doesMiddlewareMatch({ config, url, headers: { 'next-router-prefetch': '1' } })).toBe(false);
    expect(unstable_doesMiddlewareMatch({ config, url, headers: { purpose: 'prefetch' } })).toBe(false);
  });

  it.each(['/login', '/signup', '/', '/blog', '/feed', '/feed/popular', '/blog/popular'])(
    '공개 경로 %s에는 적용하지 않는다',
    (url) => {
      expect(unstable_doesMiddlewareMatch({ config, url })).toBe(false);
    },
  );
});
