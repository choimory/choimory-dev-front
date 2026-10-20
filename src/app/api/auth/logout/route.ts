import { handleLogout } from '@/features/auth/server/authBff';

/**
 * 로그아웃 BFF 엔드포인트입니다.
 *
 * @param request 로그아웃 요청
 * @returns 로그아웃 결과
 */
export function POST(request: Request) {
  return handleLogout(request);
}
