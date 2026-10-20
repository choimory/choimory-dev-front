import { handleReissue } from '@/features/auth/server/authBff';

/**
 * 토큰 재발급 BFF 엔드포인트입니다.
 *
 * @returns 재발급 결과
 */
export function POST() {
  return handleReissue();
}
