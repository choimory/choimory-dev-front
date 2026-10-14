import { describe, expect, it } from 'vitest';

import { getTargetIconName, getTargetToneClassName, getTargetTypeLabel } from '@/features/feed/model/feedTargetView';

/**
 * feedTargetView 테스트
 * 관찰 대상 종류(item, streamer, artist)별 라벨, 아이콘 이름, 아이콘 배지 색상 클래스를 반환하는 함수를 확인합니다.
 */
describe('feedTargetView', () => {
  describe('getTargetTypeLabel', () => {
    it.each([
      ['item', '아이템'],
      ['streamer', '스트리머'],
      ['artist', '아티스트'],
    ] as const)('%s는 %s 라벨을 반환한다', (type, label) => {
      expect(getTargetTypeLabel(type)).toBe(label);
    });
  });

  describe('getTargetIconName', () => {
    it.each([
      ['item', 'tag'],
      ['streamer', 'monitor'],
      ['artist', 'star'],
    ] as const)('%s는 %s 아이콘을 반환한다', (type, iconName) => {
      expect(getTargetIconName(type)).toBe(iconName);
    });
  });

  describe('getTargetToneClassName', () => {
    it.each([
      ['item', 'bg-accent-orange-soft text-accent-orange'],
      ['streamer', 'bg-primary-soft text-primary'],
      ['artist', 'bg-surface-strong text-foreground'],
    ] as const)('%s는 %s 클래스를 반환한다', (type, className) => {
      expect(getTargetToneClassName(type)).toBe(className);
    });
  });
});
