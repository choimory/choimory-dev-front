import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { BlogSettingEditModal, type BlogSettingItem } from '@/features/blog/components/BlogSettingEditModal';

const ITEM: BlogSettingItem = {
  id: 'visibility',
  title: '블로그 공개 여부',
  description: '현재 전체 공개 상태예요.',
  value: '전체 공개',
  options: ['전체 공개', '팔로워 공개', '비공개'],
};

/**
 * BlogSettingEditModal 테스트
 * 설정 변경 모달의 제목과 설명, 옵션 목록과 현재값 강조, 옵션 선택 시 강조 이동, 취소와 저장과 닫기 동작을 확인합니다.
 */
describe('BlogSettingEditModal', () => {
  it('설정 제목을 가진 dialog와 설명을 보여준다', () => {
    render(<BlogSettingEditModal item={ITEM} onClose={() => {}} />);

    expect(screen.getByRole('dialog', { name: '블로그 공개 여부' })).toBeInTheDocument();
    expect(screen.getByText('현재 전체 공개 상태예요.')).toBeInTheDocument();
  });

  it('선택 가능한 옵션을 모두 보여주고 현재 설정값을 강조한다', () => {
    render(<BlogSettingEditModal item={ITEM} onClose={() => {}} />);

    expect(screen.getByRole('button', { name: '전체 공개' })).toHaveClass('border-primary', 'bg-primary-soft');
    expect(screen.getByRole('button', { name: '팔로워 공개' })).not.toHaveClass('border-primary');
    expect(screen.getByRole('button', { name: '비공개' })).toBeInTheDocument();
  });

  it('다른 옵션을 누르면 강조가 이동한다', async () => {
    render(<BlogSettingEditModal item={ITEM} onClose={() => {}} />);

    // 다른 옵션(비공개)을 선택한다
    await userEvent.click(screen.getByRole('button', { name: '비공개' }));

    expect(screen.getByRole('button', { name: '비공개' })).toHaveClass('border-primary', 'bg-primary-soft');
    expect(screen.getByRole('button', { name: '전체 공개' })).not.toHaveClass('border-primary');
  });

  it('취소, 저장, 닫기 버튼은 onClose를 호출한다', async () => {
    const onClose = vi.fn();
    render(<BlogSettingEditModal item={ITEM} onClose={onClose} />);

    // 취소, 저장, 닫기 버튼을 차례로 누른다
    await userEvent.click(screen.getByRole('button', { name: '취소' }));
    await userEvent.click(screen.getByRole('button', { name: '저장' }));
    await userEvent.click(screen.getByRole('button', { name: '닫기' }));

    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it('옵션이 2개뿐인 설정도 그대로 보여준다', () => {
    render(<BlogSettingEditModal item={{ ...ITEM, id: 'tag', title: '태그 추천', value: '켜짐', options: ['켜짐', '꺼짐'] }} onClose={() => {}} />);

    expect(screen.getByRole('button', { name: '켜짐' })).toHaveClass('border-primary');
    expect(screen.getByRole('button', { name: '꺼짐' })).toBeInTheDocument();
  });
});
