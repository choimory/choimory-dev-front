/**
 * 초 단위 시간을 `mm:ss` 형식의 문자열로 변환합니다.
 *
 * @param seconds 변환할 시간(초). 음수가 전달되면 0으로 보정합니다.
 * @returns `mm:ss` 형식의 시간 문자열
 */
export function formatTime(seconds: number): string {
  // 음수 또는 소수가 전달된 경우 0 이상의 정수로 보정한다.
  const safeSeconds = Math.max(0, Math.floor(seconds));

  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}
