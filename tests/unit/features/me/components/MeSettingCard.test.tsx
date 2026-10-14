import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { MeSettingCard } from '@/features/me/components/MeSettingCard';
import type { MeSettingItem } from '@/features/me/model/meTypes';

const NORMAL_ITEM: MeSettingItem = {
  id: 'theme',
  title: '사이트 설정',
  description: '테마를 선택해요.',
  iconName: 'monitor',
  actionLabel: '설정',
};

const DANGER_ITEM: MeSettingItem = {
  id: 'delete',
  title: '회원 탈퇴',
  description: '탈퇴 절차예요.',
  iconName: 'tag',
  actionLabel: '탈퇴',
  tone: 'danger',
};

/**
 * MeSettingCard 테스트
 * 설정 항목 카드의 제목과 설명, 일반 항목과 위험 항목의 라벨과 색상, 클릭 시 항목과 함께 onSelect가 호출되는지 확인합니다.
 */
describe('MeSettingCard', () => {
  it('설정 항목의 제목과 설명을 보여준다', () => {
    render(<MeSettingCard item={NORMAL_ITEM} onSelect={() => {}} />);

    expect(screen.getByRole('heading', { level: 2, name: '사이트 설정' })).toBeInTheDocument();
    expect(screen.getByText('테마를 선택해요.')).toBeInTheDocument();
  });

  it('일반 항목은 "열기" 라벨과 기본 색상을 사용한다', () => {
    render(<MeSettingCard item={NORMAL_ITEM} onSelect={() => {}} />);

    expect(screen.getByText('열기')).toHaveClass('bg-surface-strong', 'text-foreground');
  });

  it('위험 항목은 "탈퇴" 라벨과 위험 색상을 사용한다', () => {
    render(<MeSettingCard item={DANGER_ITEM} onSelect={() => {}} />);

    expect(screen.getByText('탈퇴', { selector: 'span' })).toHaveClass('border-accent-red', 'text-accent-red');
  });

  it('카드를 누르면 해당 항목과 함께 onSelect를 호출한다', async () => {
    const onSelect = vi.fn();
    render(<MeSettingCard item={NORMAL_ITEM} onSelect={onSelect} />);

    // 카드를 클릭한다
    await userEvent.click(screen.getByRole('button'));

    // 선택한 항목과 함께 onSelect가 한 번 호출됐는지 확인한다
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(NORMAL_ITEM);
  });
});
