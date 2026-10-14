import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MemberServiceFeedSection } from '@/features/platform/components/MemberServiceFeedSection';

import { PLATFORM_SERVICES_FIXTURE } from '../../../../fixtures/platformServices';

/** 서비스 이름으로 서비스 현황 카드(article)를 찾는다 */
function getServiceCard(name: string) {
  const card = screen.getByText(name, { selector: 'p' }).closest('article');

  if (!card) {
    throw new Error(`${name} 카드를 찾지 못했어요`);
  }

  return card;
}

describe('MemberServiceFeedSection', () => {
  it('내 프로필 영역에 닉네임, 이메일, 내 정보 관리 링크를 보여준다', () => {
    render(<MemberServiceFeedSection services={PLATFORM_SERVICES_FIXTURE} />);

    const profile = screen.getByRole('article', { name: 'mory.dev' });

    expect(within(profile).getByText('mory@example.com')).toBeInTheDocument();
    expect(within(profile).getByRole('link', { name: '내 정보 관리' })).toHaveAttribute('href', '/me');
  });

  it('서비스 현황 영역에 서비스마다 카드를 보여준다', () => {
    render(<MemberServiceFeedSection services={PLATFORM_SERVICES_FIXTURE} />);

    expect(screen.getByRole('heading', { level: 2, name: '서비스 현황' })).toBeInTheDocument();
    expect(getServiceCard('블로그')).toBeInTheDocument();
    expect(getServiceCard('피드')).toBeInTheDocument();
    expect(getServiceCard('가계부')).toBeInTheDocument();
  });

  it('블로그 카드는 지표 4개와 알림 4개를 링크로 보여준다', () => {
    render(<MemberServiceFeedSection services={PLATFORM_SERVICES_FIXTURE} />);

    const card = getServiceCard('블로그');

    expect(within(card).getByRole('link', { name: '바로가기' })).toHaveAttribute('href', '/blog');
    expect(within(card).getByRole('link', { name: /내가 쓴 글/ })).toHaveAttribute('href', '/blog/me');
    expect(within(card).getByRole('link', { name: /팔로잉 수/ })).toHaveAttribute('href', '/blog/following');
    expect(within(card).getByRole('link', { name: /새 댓글이 달렸어요/ })).toHaveAttribute('href', '/blog/posts/post-1');
    expect(within(card).getAllByRole('heading', { level: 4 })).toHaveLength(4);
  });

  it('피드 카드는 지표 2개와 알림 4개를 보여준다', () => {
    render(<MemberServiceFeedSection services={PLATFORM_SERVICES_FIXTURE} />);

    const card = getServiceCard('피드');

    expect(within(card).getByRole('link', { name: /관찰 중인 아이템/ })).toHaveAttribute('href', '/feed/observations');
    expect(within(card).getByRole('link', { name: /관찰 중인 스트리머/ })).toBeInTheDocument();
    expect(within(card).getAllByRole('heading', { level: 4 })).toHaveLength(4);
  });

  it('준비 중인 서비스는 흐리게 표시하고 준비 중 칩과 예정 알림만 보여준다', () => {
    render(<MemberServiceFeedSection services={PLATFORM_SERVICES_FIXTURE} />);

    const card = getServiceCard('가계부');

    expect(card).toHaveClass('opacity-75');
    expect(within(card).getByText('준비 중')).toBeInTheDocument();
    expect(within(card).queryByRole('link', { name: '바로가기' })).not.toBeInTheDocument();
    expect(within(card).getByText('서비스 데이터 구조를 준비하고 있어요')).toBeInTheDocument();
    expect(within(card).getAllByRole('heading', { level: 4 })).toHaveLength(2);
  });

  it('제공 중인 서비스 카드는 흐리게 표시하지 않는다', () => {
    render(<MemberServiceFeedSection services={PLATFORM_SERVICES_FIXTURE} />);

    expect(getServiceCard('블로그')).not.toHaveClass('opacity-75');
  });
});
