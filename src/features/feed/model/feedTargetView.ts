import type { FeedTargetType } from './feedTypes';

/**
 * 관찰 대상 종류의 화면 표시용 라벨을 반환합니다.
 *
 * @param type 관찰 대상 종류
 * @returns 종류별 한글 라벨
 */
export function getTargetTypeLabel(type: FeedTargetType) {
  switch (type) {
    case 'item':
      return '아이템';
    case 'streamer':
      return '스트리머';
    case 'artist':
      return '아티스트';
  }
}

/**
 * 관찰 대상 종류에 맞는 아이콘 이름을 반환합니다.
 *
 * @param type 관찰 대상 종류
 * @returns 종류별 아이콘 이름
 */
export function getTargetIconName(type: FeedTargetType) {
  switch (type) {
    case 'item':
      return 'tag';
    case 'streamer':
      return 'monitor';
    case 'artist':
      return 'star';
  }
}

/**
 * 관찰 대상 종류에 맞는 아이콘 배지 색상 클래스를 반환합니다.
 *
 * @param type 관찰 대상 종류
 * @returns 종류별 배경, 글자 색상 클래스
 */
export function getTargetToneClassName(type: FeedTargetType) {
  switch (type) {
    case 'item':
      return 'bg-accent-orange-soft text-accent-orange';
    case 'streamer':
      return 'bg-primary-soft text-primary';
    case 'artist':
      return 'bg-surface-strong text-foreground';
  }
}
