import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SettingToggle } from '@/features/feed/components/SettingToggle';

/**
 * SettingToggle 테스트
 * 설정 토글 행의 라벨과 설명, 클릭 시 onToggle 호출, 켜짐과 꺼짐 스위치 모양을 확인합니다.
 */
describe('SettingToggle', () => {
  it('라벨과 설명을 가진 버튼으로 보여준다', () => {
    render(<SettingToggle label="방송 시작 알림" description="방송이 시작되면 알려드려요." isOn onToggle={() => {}} />);

    const button = screen.getByRole('button', { name: /방송 시작 알림/ });

    expect(button).toHaveTextContent('방송이 시작되면 알려드려요.');
  });

  it('누르면 onToggle을 호출한다', async () => {
    const onToggle = vi.fn();
    render(<SettingToggle label="방송 시작 알림" description="설명" isOn={false} onToggle={onToggle} />);

    // 토글을 클릭한다
    await userEvent.click(screen.getByRole('button'));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('켜짐 상태에서는 스위치가 오른쪽에 강조색으로 보인다', () => {
    const { container } = render(<SettingToggle label="라벨" description="설명" isOn onToggle={() => {}} />);

    expect(container.querySelector('[aria-hidden="true"]')).toHaveClass('justify-end', 'bg-primary');
  });

  it('꺼짐 상태에서는 스위치가 왼쪽에 흐린 색으로 보인다', () => {
    const { container } = render(<SettingToggle label="라벨" description="설명" isOn={false} onToggle={() => {}} />);

    expect(container.querySelector('[aria-hidden="true"]')).toHaveClass('justify-start', 'bg-surface-strong');
  });
});
