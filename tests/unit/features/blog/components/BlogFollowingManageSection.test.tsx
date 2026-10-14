import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { BlogFollowingManageSection } from '@/features/blog/components/BlogFollowingManageSection';

/** 현재 페이지에 보이는 사용자 닉네임 목록을 반환한다 (각 행의 텍스트 순서: 이니셜, 닉네임, 설명, 버튼) */
function getVisibleNicknames() {
  return screen.queryAllByRole('article').map((article) => within(article).getAllByText(/./)[1].textContent);
}

/**
 * BlogFollowingManageSection 테스트
 * 팔로잉 화면의 관계 목록 카드가 탭(팔로잉, 팔로워), 3명 단위 페이지 이동, 닉네임과 설명 검색, 검색 결과 없음 안내, 탭 변경 시 초기화를 처리하는지 확인합니다.
 */
describe('BlogFollowingManageSection', () => {
  it('관계 목록 제목과 설명, 탭 2종을 보여주고 팔로잉 탭이 기본 선택이다', () => {
    render(<BlogFollowingManageSection />);

    expect(screen.getByRole('region', { name: '관계 목록' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: '팔로잉' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: '팔로워' })).toHaveAttribute('aria-selected', 'false');
  });

  it('팔로잉 탭 첫 페이지에 3명과 "언팔로우" 버튼을 보여준다', () => {
    render(<BlogFollowingManageSection />);

    expect(getVisibleNicknames()).toEqual(['mory.dev', 'jin.note', 'ui.archive']);
    expect(screen.getAllByRole('button', { name: '언팔로우' })).toHaveLength(3);
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  it('팔로워 탭으로 바꾸면 팔로워 목록과 "팔로우" 버튼을 보여준다', async () => {
    render(<BlogFollowingManageSection />);

    // 팔로워 탭을 클릭한다
    await userEvent.click(screen.getByRole('tab', { name: '팔로워' }));

    expect(getVisibleNicknames()).toEqual(['jin.note', 'ui.archive', 'nav.lab']);
    expect(screen.getAllByRole('button', { name: '팔로우' })).toHaveLength(3);
    expect(screen.queryByRole('button', { name: '언팔로우' })).not.toBeInTheDocument();
  });

  it('새 글이 있는 사용자에게만 새 글 표시를 보여준다', () => {
    render(<BlogFollowingManageSection />);

    const [first, , third] = screen.getAllByRole('article');

    expect(within(first).getByLabelText('새 글 있음')).toBeInTheDocument();
    expect(within(third).queryByLabelText('새 글 있음')).not.toBeInTheDocument();
  });

  it('다음, 이전 버튼으로 페이지를 이동하고 끝에서는 버튼이 비활성화된다', async () => {
    render(<BlogFollowingManageSection />);

    expect(screen.getByRole('button', { name: '이전 목록' })).toBeDisabled();

    // 다음 목록 버튼으로 2페이지로 이동한다
    await userEvent.click(screen.getByRole('button', { name: '다음 목록' }));

    expect(screen.getByText('2 / 2')).toBeInTheDocument();
    expect(getVisibleNicknames()).toEqual(['feed.watch', 'nav.lab', 'build.note']);
    expect(screen.getByRole('button', { name: '다음 목록' })).toBeDisabled();

    // 이전 목록 버튼으로 1페이지로 돌아온다
    await userEvent.click(screen.getByRole('button', { name: '이전 목록' }));

    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  it('검색 버튼을 누르기 전에는 검색창이 없고, 누르면 열리고 다시 누르면 닫힌다', async () => {
    render(<BlogFollowingManageSection />);

    expect(screen.queryByPlaceholderText('닉네임이나 설명으로 검색')).not.toBeInTheDocument();

    // 검색 버튼을 눌러 검색창을 연다
    await userEvent.click(screen.getByRole('button', { name: '사용자 검색' }));
    expect(screen.getByPlaceholderText('닉네임이나 설명으로 검색')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '사용자 검색' }));
    expect(screen.queryByPlaceholderText('닉네임이나 설명으로 검색')).not.toBeInTheDocument();
  });

  it('검색어로 닉네임을 거르고 첫 페이지로 돌아간다', async () => {
    render(<BlogFollowingManageSection />);

    // 2페이지로 이동한 상태에서
    await userEvent.click(screen.getByRole('button', { name: '다음 목록' }));
    // 검색창을 열고 닉네임 일부를 입력한다
    await userEvent.click(screen.getByRole('button', { name: '사용자 검색' }));
    await userEvent.type(screen.getByPlaceholderText('닉네임이나 설명으로 검색'), 'nav');

    expect(getVisibleNicknames()).toEqual(['nav.lab']);
    expect(screen.getByText('1 / 1')).toBeInTheDocument();
  });

  it('설명으로도 검색하고 대소문자와 앞뒤 공백을 무시한다', async () => {
    render(<BlogFollowingManageSection />);

    // 검색창을 열고 앞뒤 공백이 있는 설명 일부를 입력한다
    await userEvent.click(screen.getByRole('button', { name: '사용자 검색' }));
    await userEvent.type(screen.getByPlaceholderText('닉네임이나 설명으로 검색'), '  빌드  ');

    expect(getVisibleNicknames()).toEqual(['build.note']);

    // 입력을 지우고 대문자 닉네임으로 다시 검색한다
    await userEvent.clear(screen.getByPlaceholderText('닉네임이나 설명으로 검색'));
    await userEvent.type(screen.getByPlaceholderText('닉네임이나 설명으로 검색'), 'JIN.NOTE');

    expect(getVisibleNicknames()).toEqual(['jin.note']);
  });

  it('검색 결과가 없으면 안내 문구를 보여준다', async () => {
    render(<BlogFollowingManageSection />);

    // 검색창을 열고 없는 사용자를 입력한다
    await userEvent.click(screen.getByRole('button', { name: '사용자 검색' }));
    await userEvent.type(screen.getByPlaceholderText('닉네임이나 설명으로 검색'), '없는사용자');

    expect(screen.getByText('검색 결과가 없어요.')).toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    expect(screen.getByText('1 / 1')).toBeInTheDocument();
  });

  it('탭을 바꾸면 검색어와 페이지가 초기화된다', async () => {
    render(<BlogFollowingManageSection />);

    // 검색어를 입력한 상태에서 팔로워 탭으로 바꾼다
    await userEvent.click(screen.getByRole('button', { name: '사용자 검색' }));
    await userEvent.type(screen.getByPlaceholderText('닉네임이나 설명으로 검색'), 'nav');
    await userEvent.click(screen.getByRole('tab', { name: '팔로워' }));

    expect(screen.getByPlaceholderText('닉네임이나 설명으로 검색')).toHaveValue('');
    expect(getVisibleNicknames()).toEqual(['jin.note', 'ui.archive', 'nav.lab']);
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });
});
