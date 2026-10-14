import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { BlogMeSettingsView } from '@/features/blog/components/BlogMeSettingsView';

/**
 * BlogMeSettingsView 테스트
 * 내 blog 설정 화면의 프로필과 추가 카운팅, 설정 카드 3개, 글작성 모달과 설정 변경 모달과 관계 모달의 열기와 닫기, 로그인 여부를 확인합니다.
 */
describe('BlogMeSettingsView', () => {
  it('내 blog 소개와 프로필 카드(공개 블로그 링크, 추가 카운팅)를 보여준다', () => {
    render(<BlogMeSettingsView isLoggedIn />);

    expect(screen.getByText('/ blog / me')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'mory.dev 공개 블로그로 이동' })).toHaveAttribute('href', '/blog/mory.dev');
    expect(screen.getByText('내 댓글')).toBeInTheDocument();
    expect(screen.getByText('좋아요')).toBeInTheDocument();
    expect(screen.getByText('북마크')).toBeInTheDocument();
  });

  it('설정 섹션에 설정 카드 3개를 현재 값과 함께 보여준다', () => {
    render(<BlogMeSettingsView isLoggedIn />);

    const settings = screen.getByRole('region', { name: '설정' });

    expect(within(settings).getAllByRole('button')).toHaveLength(3);
    expect(within(settings).getByRole('button', { name: /블로그 공개 여부/ })).toHaveTextContent('전체 공개');
    expect(within(settings).getByRole('button', { name: /기본 댓글 허용 범위/ })).toHaveTextContent('전체');
    expect(within(settings).getByRole('button', { name: /태그 추천/ })).toHaveTextContent('켜짐');
  });

  it('처음에는 모달이 열려 있지 않다', () => {
    render(<BlogMeSettingsView isLoggedIn />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('글 작성 행을 누르면 글작성 모달이 열리고 닫기로 닫힌다', async () => {
    render(<BlogMeSettingsView isLoggedIn />);

    // 글 작성 행을 눌러 글작성 모달을 연다
    await userEvent.click(screen.getByRole('button', { name: '무슨 생각을 공유할까요?' }));

    const dialog = screen.getByRole('dialog', { name: '글작성' });

    // 닫기 버튼으로 모달을 닫는다
    await userEvent.click(within(dialog).getByRole('button', { name: '닫기' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('설정 카드를 누르면 해당 설정 변경 모달이 열린다', async () => {
    render(<BlogMeSettingsView isLoggedIn />);

    // 태그 추천 설정 카드를 눌러 설정 변경 모달을 연다
    await userEvent.click(screen.getByRole('button', { name: /태그 추천/ }));

    const dialog = screen.getByRole('dialog', { name: '태그 추천' });

    expect(within(dialog).getByRole('button', { name: '켜짐' })).toHaveClass('border-primary');
    expect(within(dialog).getByRole('button', { name: '꺼짐' })).toBeInTheDocument();
  });

  it('설정 변경 모달을 닫으면 다른 설정 모달로 바로 바꿔 열 수 있다', async () => {
    render(<BlogMeSettingsView isLoggedIn />);

    // 공개 여부 설정 모달을 열었다가 취소로 닫고
    await userEvent.click(screen.getByRole('button', { name: /블로그 공개 여부/ }));
    await userEvent.click(screen.getByRole('button', { name: '취소' }));
    // 댓글 허용 범위 설정 모달을 바로 연다
    await userEvent.click(screen.getByRole('button', { name: /기본 댓글 허용 범위/ }));

    expect(screen.getByRole('dialog', { name: '기본 댓글 허용 범위' })).toBeInTheDocument();
  });

  it('팔로워, 팔로잉 카드를 누르면 관계 모달이 열린다', async () => {
    render(<BlogMeSettingsView isLoggedIn />);

    // 팔로워 카드를 눌러 팔로워 모달을 연다
    await userEvent.click(screen.getByRole('button', { name: /팔로워/ }));
    expect(screen.getByRole('dialog', { name: '팔로워' })).toBeInTheDocument();

    // 모달을 닫고
    await userEvent.click(screen.getByRole('button', { name: '닫기' }));
    // 팔로잉 카드를 눌러 팔로잉 모달을 연다
    await userEvent.click(screen.getByRole('button', { name: /팔로잉/ }));

    expect(screen.getByRole('dialog', { name: '팔로잉' })).toBeInTheDocument();
  });

  it('로그인 여부에 따라 상단바 링크가 달라지고 내 블로그 탭이 활성 상태다', () => {
    const { rerender } = render(<BlogMeSettingsView isLoggedIn={false} />);

    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '내 블로그' })).toHaveAttribute('aria-current', 'page');

    // 로그인 상태로 다시 렌더링하면 링크가 로그아웃으로 바뀐다
    rerender(<BlogMeSettingsView isLoggedIn />);

    expect(screen.getByRole('link', { name: '로그아웃' })).toBeInTheDocument();
  });
});
