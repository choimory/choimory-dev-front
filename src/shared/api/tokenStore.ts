/** 만료 임박으로 보는 기준(밀리초). 이 시간 안에 만료되면 미리 갱신합니다. */
const EXPIRING_MARGIN_MS = 30_000;

/** 메모리에 보관하는 Access Token (새로고침하면 사라짐) */
let accessToken: string | null = null;

/** Access Token 만료 시각(epoch 밀리초) */
let expiresAt = 0;

/**
 * Access Token을 메모리에 저장합니다.
 *
 * @param token Access Token
 * @param expiresInSeconds 만료까지 남은 시간(초)
 * @param now 현재 시각(epoch 밀리초)
 */
export function saveAccessToken(token: string, expiresInSeconds: number, now: number = Date.now()): void {
  accessToken = token;
  expiresAt = now + expiresInSeconds * 1000;
}

/**
 * 메모리의 Access Token을 반환합니다.
 *
 * @returns Access Token (없으면 null)
 */
export function getAccessToken(): string | null {
  return accessToken;
}

/**
 * 토큰이 있고 곧 만료되는지 확인합니다.
 *
 * @param now 현재 시각(epoch 밀리초)
 * @returns 만료 임박 여부 (토큰이 없으면 false)
 */
export function isAccessTokenExpiring(now: number = Date.now()): boolean {
  return accessToken !== null && expiresAt - now <= EXPIRING_MARGIN_MS;
}

/**
 * 메모리의 Access Token을 지웁니다.
 */
export function clearAccessToken(): void {
  accessToken = null;
  expiresAt = 0;
}
