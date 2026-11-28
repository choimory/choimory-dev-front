/** 로그인 후 이동할 기본 경로 */
const DEFAULT_PATH = '/';

/** 허용하는 이동 경로의 최대 길이 */
const MAX_PATH_LENGTH = 512;

/** 로그인 후 돌아가면 안 되는 경로 (로그인 화면으로 다시 돌아오는 루프 방지) */
const AUTH_PATHS = ['/login', '/signup'];

/** 제어 문자 */
const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001f\u007f]/;

/**
 * 로그인 후 이동할 경로(`next`)를 검증합니다. 같은 사이트 안의 경로만 허용하고,
 * 외부 주소로 보내는 오픈 리다이렉트가 될 수 있는 값은 기본 경로로 바꿉니다.
 *
 * @param raw 쿼리에서 읽은 원본 값
 * @returns 검증된 내부 경로(쿼리 포함), 허용되지 않으면 `/`
 */
export function sanitizeNextPath(raw: string | string[] | null | undefined): string {
  const value = Array.isArray(raw) ? raw[0] : raw;

  if (typeof value !== 'string' || value.length === 0 || value.length > MAX_PATH_LENGTH) {
    return DEFAULT_PATH;
  }

  // 반드시 `/`로 시작하고 `//`(프로토콜 상대 주소)나 `/\`(브라우저가 `//`로 해석)로 시작하면 안 된다.
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) {
    return DEFAULT_PATH;
  }

  if (CONTROL_CHARACTER_PATTERN.test(value)) {
    return DEFAULT_PATH;
  }

  // 퍼센트 인코딩으로 우회하는 값(`/%2F...`, `/%5C...`)도 디코딩해서 같은 규칙으로 검사한다.
  let decoded: string;

  try {
    decoded = decodeURIComponent(value);
  } catch {
    return DEFAULT_PATH;
  }

  if (decoded.startsWith('//') || decoded.startsWith('/\\') || CONTROL_CHARACTER_PATTERN.test(decoded)) {
    return DEFAULT_PATH;
  }

  // 실제로 파싱해서 같은 사이트로 해석되는 경우만 허용한다.
  const base = 'http://localhost';
  let parsed: URL;

  try {
    parsed = new URL(value, base);
  } catch {
    return DEFAULT_PATH;
  }

  if (parsed.origin !== base) {
    return DEFAULT_PATH;
  }

  const isAuthPath = AUTH_PATHS.some((path) => parsed.pathname === path || parsed.pathname.startsWith(`${path}/`));

  if (isAuthPath) {
    return DEFAULT_PATH;
  }

  return `${parsed.pathname}${parsed.search}`;
}

/**
 * 현재 경로로 돌아오도록 `next`를 붙인 로그인 화면 주소를 만듭니다.
 * 홈이나 로그인, 회원가입 화면이면 `next` 없이 `/login`을 돌려줍니다.
 *
 * @param currentPath 로그인 후 돌아올 현재 경로
 * @returns 로그인 화면 주소
 */
export function buildLoginHref(currentPath: string): string {
  const safePath = sanitizeNextPath(currentPath);

  if (safePath === DEFAULT_PATH) {
    return '/login';
  }

  return `/login?next=${encodeURIComponent(safePath)}`;
}
