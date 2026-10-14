import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { BlogProfileCard, type BlogUserProfile } from '@/features/blog/components/BlogProfileCard';

const PROFILE: BlogUserProfile = {
  nickname: 'mory.dev',
  initial: 'M',
  description: '차근차근 다듬고 있어요.',
  postCount: 12,
  followerCount: 128,
  followingCount: 36,
};

/**
 * BlogProfileCard 테스트
 * blog 프로필 카드의 닉네임, 이니셜, 소개, 카운팅 카드, 팔로워와 팔로잉 클릭, 공개 블로그 링크, 추가 카운팅을 확인합니다.
 */
describe('BlogProfileCard', () => {
  it('닉네임을 제목으로, 이니셜과 소개를 보여주고 영역 이름을 연결한다', () => {
    render(<BlogProfileCard headingId="profile-title" profile={PROFILE} onSelectRelation={() => {}} />);

    const heading = screen.getByRole('heading', { level: 1, name: 'mory.dev' });

    expect(heading).toHaveAttribute('id', 'profile-title');
    expect(screen.getByText('M')).toBeInTheDocument();
    expect(screen.getByText('차근차근 다듬고 있어요.')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'mory.dev' })).toBeInTheDocument();
  });

  it('작성 글, 팔로워, 팔로잉 카운팅을 보여준다', () => {
    render(<BlogProfileCard headingId="profile-title" profile={PROFILE} onSelectRelation={() => {}} />);

    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('128')).toBeInTheDocument();
    expect(screen.getByText('36')).toBeInTheDocument();
  });

  it('작성 글 카드는 클릭할 수 없고 팔로워, 팔로잉 카드만 버튼이다', () => {
    render(<BlogProfileCard headingId="profile-title" profile={PROFILE} onSelectRelation={() => {}} />);

    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(screen.getByRole('button', { name: /팔로워/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /팔로잉/ })).toBeInTheDocument();
  });

  it('팔로워, 팔로잉 카드를 누르면 종류와 함께 onSelectRelation을 호출한다', async () => {
    const onSelectRelation = vi.fn();
    render(<BlogProfileCard headingId="profile-title" profile={PROFILE} onSelectRelation={onSelectRelation} />);

    // 팔로워 카드를 누르면 followers로 호출된다
    await userEvent.click(screen.getByRole('button', { name: /팔로워/ }));
    expect(onSelectRelation).toHaveBeenLastCalledWith('followers');

    // 팔로잉 카드를 누르면 following으로 호출된다
    await userEvent.click(screen.getByRole('button', { name: /팔로잉/ }));
    expect(onSelectRelation).toHaveBeenLastCalledWith('following');
  });

  it('profileHref가 없으면 공개 블로그 링크를 만들지 않는다', () => {
    render(<BlogProfileCard headingId="profile-title" profile={PROFILE} onSelectRelation={() => {}} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('profileHref가 있으면 아바타와 닉네임을 공개 블로그 링크로 감싼다', () => {
    render(<BlogProfileCard headingId="profile-title" profile={PROFILE} profileHref="/blog/mory.dev" onSelectRelation={() => {}} />);

    const link = screen.getByRole('link', { name: 'mory.dev 공개 블로그로 이동' });

    expect(link).toHaveAttribute('href', '/blog/mory.dev');
    expect(within(link).getByRole('heading', { name: 'mory.dev' })).toBeInTheDocument();
  });

  it('extraStats가 있으면 기본 카운팅 뒤에 클릭할 수 없는 카드로 이어 붙인다', () => {
    render(
      <BlogProfileCard
        headingId="profile-title"
        profile={PROFILE}
        onSelectRelation={() => {}}
        extraStats={[{ label: '내 댓글', value: '47' }, { label: '좋아요', value: '96' }]}
      />,
    );

    expect(screen.getByText('내 댓글')).toBeInTheDocument();
    expect(screen.getByText('47')).toBeInTheDocument();
    expect(screen.getByText('좋아요')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });
});
