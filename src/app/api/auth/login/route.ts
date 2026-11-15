import { handleLogin } from '@/features/auth/server/authBff';

/**
 * 로그인 BFF 엔드포인트입니다.
 *
 * @param request 로그인 요청
 * @returns 로그인 결과
 */
export function POST(request: Request) {
  return handleLogin(request);
}
