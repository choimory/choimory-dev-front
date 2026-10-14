import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { MeView } from '@/features/me/components/MeView';

import { ME_VIEW_MODEL_FIXTURE } from '../../../../fixtures/meViewModel';

/** 설정 카드를 눌러 해당 설정 모달을 연다 */
async function openSetting(title: string) {
  await userEvent.click(screen.getByRole('button', { name: new RegExp(title) }));

  return screen.getByRole('dialog', { name: title });
}

describe('MeView', () => {
  it('프로필 카드에 닉네임, 이메일, 소개와 홈 링크를 보여준다', () => {
    render(<MeView viewModel={ME_VIEW_MODEL_FIXTURE} />);

    expect(screen.getByRole('heading', { level: 1, name: 'mory.dev' })).toBeInTheDocument();
    expect(screen.getByText('mory@example.com')).toBeInTheDocument();
    expect(screen.getByText('테스트용 소개예요.')).toBeInTheDocument();
    // 프로필 카드의 홈 링크와 하단 네비게이션의 홈 링크가 모두 홈으로 이동한다
    const homeLinks = screen.getAllByRole('link', { name: '홈' });

    expect(homeLinks).toHaveLength(2);
    homeLinks.forEach((link) => expect(link).toHaveAttribute('href', '/'));
  });

  it('로그인 상태의 상단바와 활성화된 하단 네비게이션을 보여준다', () => {
    render(<MeView viewModel={ME_VIEW_MODEL_FIXTURE} />);

    expect(screen.getByRole('link', { name: '로그아웃' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '내 정보' })).toHaveAttribute('aria-current', 'page');
  });

  it('설정 항목마다 카드를 보여준다', () => {
    render(<MeView viewModel={ME_VIEW_MODEL_FIXTURE} />);

    const settings = screen.getByRole('region', { name: '마이페이지 설정' });

    expect(within(settings).getAllByRole('button')).toHaveLength(4);
  });

  it('처음에는 설정 모달이 열려 있지 않다', () => {
    render(<MeView viewModel={ME_VIEW_MODEL_FIXTURE} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('개인정보 변경 모달은 이메일(읽기 전용), 닉네임, 자기소개를 기존 값으로 채워 보여준다', async () => {
    render(<MeView viewModel={ME_VIEW_MODEL_FIXTURE} />);

    const dialog = await openSetting('개인정보 변경');

    const email = within(dialog).getByLabelText('이메일');
    expect(email).toHaveValue('mory@example.com');
    expect(email).toBeDisabled();
    expect(within(dialog).getByLabelText(/닉네임/)).toHaveValue('mory.dev');
    expect(within(dialog).getByLabelText('자기소개')).toHaveValue('테스트용 소개예요.');
    expect(within(dialog).getByRole('button', { name: '중복체크' })).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: '수정하기' })).toBeInTheDocument();
  });

  it('개인정보 변경 모달에서 닉네임을 수정할 수 있다', async () => {
    render(<MeView viewModel={ME_VIEW_MODEL_FIXTURE} />);

    const dialog = await openSetting('개인정보 변경');
    const nickname = within(dialog).getByLabelText(/닉네임/);

    await userEvent.clear(nickname);
    await userEvent.type(nickname, 'newmory');

    expect(nickname).toHaveValue('newmory');
  });

  it('사이트 설정 모달은 테마 3종을 보여주고 system이 기본 선택이다', async () => {
    render(<MeView viewModel={ME_VIEW_MODEL_FIXTURE} />);

    const dialog = await openSetting('사이트 설정');

    expect(within(dialog).getAllByRole('radio')).toHaveLength(3);
    expect(within(dialog).getByRole('radio', { name: 'system' })).toBeChecked();
    expect(within(dialog).getByRole('radio', { name: 'light' })).not.toBeChecked();
  });

  it('사이트 설정 모달에서 테마를 바꿀 수 있다', async () => {
    render(<MeView viewModel={ME_VIEW_MODEL_FIXTURE} />);

    const dialog = await openSetting('사이트 설정');
    await userEvent.click(within(dialog).getByRole('radio', { name: 'dark' }));

    expect(within(dialog).getByRole('radio', { name: 'dark' })).toBeChecked();
    expect(within(dialog).getByRole('radio', { name: 'system' })).not.toBeChecked();
  });

  it('2차 인증 모달은 사용 여부와 인증 방식을 보여주고 모바일 앱 인증은 비활성이다', async () => {
    render(<MeView viewModel={ME_VIEW_MODEL_FIXTURE} />);

    const dialog = await openSetting('2차 인증');

    expect(within(dialog).getByRole('radio', { name: '사용' })).toBeChecked();
    expect(within(dialog).getByRole('radio', { name: '미사용' })).not.toBeChecked();
    expect(within(dialog).getByRole('radio', { name: '이메일 인증' })).toBeChecked();
    expect(within(dialog).getByRole('radio', { name: /모바일 앱 인증/ })).toBeDisabled();
    expect(within(dialog).getByText('미구현')).toBeInTheDocument();
  });

  it('회원 탈퇴 모달은 위험 안내와 탈퇴 절차 확인 버튼을 보여준다', async () => {
    render(<MeView viewModel={ME_VIEW_MODEL_FIXTURE} />);

    const dialog = await openSetting('회원 탈퇴');

    expect(within(dialog).getByRole('heading', { level: 3, name: '회원 탈퇴' })).toBeInTheDocument();
    expect(within(dialog).getByText(/화면 구조만 보여드려요/)).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: '탈퇴 절차 확인' })).toHaveClass('border-accent-red');
  });

  it('모달에서 설정 항목에 맞는 내용만 보여준다', async () => {
    render(<MeView viewModel={ME_VIEW_MODEL_FIXTURE} />);

    const dialog = await openSetting('사이트 설정');

    expect(within(dialog).queryByLabelText('자기소개')).not.toBeInTheDocument();
    expect(within(dialog).queryByRole('button', { name: '탈퇴 절차 확인' })).not.toBeInTheDocument();
  });

  it('닫기 버튼을 누르면 모달이 닫힌다', async () => {
    render(<MeView viewModel={ME_VIEW_MODEL_FIXTURE} />);

    const dialog = await openSetting('개인정보 변경');
    await userEvent.click(within(dialog).getByRole('button', { name: '닫기' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('모달 배경을 누르면 모달이 닫힌다', async () => {
    render(<MeView viewModel={ME_VIEW_MODEL_FIXTURE} />);

    const dialog = await openSetting('회원 탈퇴');
    await userEvent.click(dialog.parentElement as HTMLElement);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('다른 설정을 열면 이전 모달 내용은 사라지고 새 내용으로 바뀐다', async () => {
    render(<MeView viewModel={ME_VIEW_MODEL_FIXTURE} />);

    const profileDialog = await openSetting('개인정보 변경');
    await userEvent.click(within(profileDialog).getByRole('button', { name: '닫기' }));
    const themeDialog = await openSetting('사이트 설정');

    expect(within(themeDialog).getByRole('heading', { level: 3, name: '테마 설정' })).toBeInTheDocument();
    expect(within(themeDialog).queryByLabelText('자기소개')).not.toBeInTheDocument();
  });

  it('설정 항목이 없으면 설정 영역이 비어 있다', () => {
    render(<MeView viewModel={{ ...ME_VIEW_MODEL_FIXTURE, settingItems: [] }} />);

    expect(screen.getByRole('region', { name: '마이페이지 설정' })).toBeEmptyDOMElement();
  });
});
