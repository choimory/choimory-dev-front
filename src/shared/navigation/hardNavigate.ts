/**
 * 페이지를 새로 불러오며 이동합니다.
 * 클라이언트 라우팅과 달리 진행 중인 다른 이동을 덮어쓰고, 메모리의 인증 상태도 함께 초기화됩니다.
 *
 * @param path 이동할 경로
 */
export function hardNavigate(path: string): void {
  if (typeof window !== 'undefined') {
    window.location.assign(path);
  }
}
