import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { BlogRelationModal } from '@/features/blog/components/BlogRelationModal';

import { BLOG_RELATION_USERS_FIXTURE } from '../../../../fixtures/blog';

describe('BlogRelationModal', () => {
  it('제목을 가진 dialog로 열리고 첫 페이지에 사용자 3명을 보여준다', () => {
    render(<BlogRelationModal title="팔로워" users={BLOG_RELATION_USERS_FIXTURE} onClose={() => {}} />);

    const dialog = screen.getByRole('dialog', { name: '팔로워' });

    expect(within(dialog).getAllByRole('article')).toHaveLength(3);
    expect(within(dialog).getByText('user.1')).toBeInTheDocument();
    expect(within(dialog).getByText('1번째 사용자 소개')).toBeInTheDocument();
    expect(within(dialog).queryByText('user.4')).not.toBeInTheDocument();
  });

  it('페이지 표시와 이전, 다음 버튼 상태를 보여준다', () => {
    render(<BlogRelationModal title="팔로워" users={BLOG_RELATION_USERS_FIXTURE} onClose={() => {}} />);

    expect(screen.getByText('1 / 3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '이전 목록' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '다음 목록' })).toBeEnabled();
  });

  it('다음, 이전 버튼으로 페이지를 이동한다', async () => {
    render(<BlogRelationModal title="팔로워" users={BLOG_RELATION_USERS_FIXTURE} onClose={() => {}} />);

    await userEvent.click(screen.getByRole('button', { name: '다음 목록' }));

    expect(screen.getByText('2 / 3')).toBeInTheDocument();
    expect(screen.getByText('user.4')).toBeInTheDocument();
    expect(screen.queryByText('user.1')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '이전 목록' }));

    expect(screen.getByText('1 / 3')).toBeInTheDocument();
    expect(screen.getByText('user.1')).toBeInTheDocument();
  });

  it('마지막 페이지에는 남은 사용자만 보여주고 다음 버튼이 비활성화된다', async () => {
    render(<BlogRelationModal title="팔로워" users={BLOG_RELATION_USERS_FIXTURE} onClose={() => {}} />);

    await userEvent.click(screen.getByRole('button', { name: '다음 목록' }));
    await userEvent.click(screen.getByRole('button', { name: '다음 목록' }));

    expect(screen.getByText('3 / 3')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByText('user.7')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다음 목록' })).toBeDisabled();
  });

  it('사용자가 없어도 1 / 1 페이지와 비활성 버튼을 보여준다', () => {
    render(<BlogRelationModal title="팔로잉" users={[]} onClose={() => {}} />);

    expect(screen.getByText('1 / 1')).toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '이전 목록' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '다음 목록' })).toBeDisabled();
  });

  it('닫기 버튼과 배경 클릭으로 onClose를 호출한다', async () => {
    const onClose = vi.fn();
    render(<BlogRelationModal title="팔로워" users={BLOG_RELATION_USERS_FIXTURE} onClose={onClose} />);

    await userEvent.click(screen.getByRole('button', { name: '닫기' }));
    expect(onClose).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole('dialog').parentElement as HTMLElement);
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
