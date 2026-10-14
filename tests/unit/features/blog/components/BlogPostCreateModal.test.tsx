import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BlogPostCreateModal } from '@/features/blog/components/BlogPostCreateModal';

/** 테스트용 이미지 파일을 만든다 */
function createImage(name: string) {
  return new File(['image'], name, { type: 'image/png' });
}

describe('BlogPostCreateModal', () => {
  beforeEach(() => {
    // jsdom에는 URL.createObjectURL이 없어서 대체한다
    URL.createObjectURL = vi.fn((file: Blob | MediaSource) => `blob:preview-${(file as File).name}`);
  });

  it('글작성 dialog와 입력 항목을 보여준다', () => {
    render(<BlogPostCreateModal onClose={() => {}} />);

    expect(screen.getByRole('dialog', { name: '글작성' })).toBeInTheDocument();
    expect(screen.getByLabelText('글제목')).toBeInTheDocument();
    expect(screen.getByLabelText('글내용')).toBeInTheDocument();
    expect(screen.getByLabelText('태그')).toBeInTheDocument();
  });

  it('제목, 내용, 태그를 입력할 수 있다', async () => {
    render(<BlogPostCreateModal onClose={() => {}} />);

    await userEvent.type(screen.getByLabelText('글제목'), '새 글');
    await userEvent.type(screen.getByLabelText('글내용'), '본문이에요');
    await userEvent.type(screen.getByLabelText('태그'), 'react');

    expect(screen.getByLabelText('글제목')).toHaveValue('새 글');
    expect(screen.getByLabelText('글내용')).toHaveValue('본문이에요');
    expect(screen.getByLabelText('태그')).toHaveValue('react');
  });

  it('공개여부와 댓글허용여부의 기본값은 첫 번째 옵션이다', () => {
    render(<BlogPostCreateModal onClose={() => {}} />);

    const [visibilityAll, commentAll] = screen.getAllByRole('button', { name: '전체' });

    expect(visibilityAll).toHaveClass('bg-primary');
    expect(commentAll).toHaveClass('bg-primary');
  });

  it('공개여부를 바꿔도 댓글허용여부에는 영향이 없다', async () => {
    render(<BlogPostCreateModal onClose={() => {}} />);

    await userEvent.click(screen.getByRole('button', { name: '비공개' }));

    expect(screen.getByRole('button', { name: '비공개' })).toHaveClass('bg-primary');
    expect(screen.getAllByRole('button', { name: '전체' })[0]).not.toHaveClass('bg-primary');
    expect(screen.getAllByRole('button', { name: '전체' })[1]).toHaveClass('bg-primary');
  });

  it('댓글허용여부를 바꿀 수 있다', async () => {
    render(<BlogPostCreateModal onClose={() => {}} />);

    await userEvent.click(screen.getByRole('button', { name: '비허용' }));

    expect(screen.getByRole('button', { name: '비허용' })).toHaveClass('bg-primary');
    expect(screen.getAllByRole('button', { name: '전체' })[1]).not.toHaveClass('bg-primary');
  });

  it('사진을 선택하면 미리보기 목록과 순번을 보여준다', async () => {
    render(<BlogPostCreateModal onClose={() => {}} />);

    expect(screen.queryByLabelText('선택한 사진')).not.toBeInTheDocument();

    await userEvent.upload(screen.getByLabelText('사진 선택'), [createImage('a.png'), createImage('b.png')]);

    const list = screen.getByLabelText('선택한 사진');

    expect(within(list).getAllByRole('article')).toHaveLength(2);
    expect(within(list).getByText('a.png')).toBeInTheDocument();
    expect(within(list).getByText('1번째 사진')).toBeInTheDocument();
    expect(within(list).getByText('b.png')).toBeInTheDocument();
    expect(within(list).getByText('2번째 사진')).toBeInTheDocument();
  });

  it('사진을 추가로 선택하면 기존 목록 뒤에 이어 붙는다', async () => {
    render(<BlogPostCreateModal onClose={() => {}} />);

    await userEvent.upload(screen.getByLabelText('사진 선택'), createImage('a.png'));
    await userEvent.upload(screen.getByLabelText('사진 선택'), createImage('b.png'));

    const names = within(screen.getByLabelText('선택한 사진')).getAllByText(/\.png$/).map((element) => element.textContent);

    expect(names).toEqual(['a.png', 'b.png']);
  });

  it('첫 사진은 앞으로, 마지막 사진은 뒤로 이동할 수 없다', async () => {
    render(<BlogPostCreateModal onClose={() => {}} />);

    await userEvent.upload(screen.getByLabelText('사진 선택'), [createImage('a.png'), createImage('b.png')]);

    expect(screen.getByRole('button', { name: 'a.png 앞으로 이동' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'a.png 뒤로 이동' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'b.png 뒤로 이동' })).toBeDisabled();
  });

  it('사진 순서를 바꿀 수 있다', async () => {
    render(<BlogPostCreateModal onClose={() => {}} />);

    await userEvent.upload(screen.getByLabelText('사진 선택'), [createImage('a.png'), createImage('b.png')]);
    await userEvent.click(screen.getByRole('button', { name: 'b.png 앞으로 이동' }));

    const names = within(screen.getByLabelText('선택한 사진')).getAllByText(/\.png$/).map((element) => element.textContent);

    expect(names).toEqual(['b.png', 'a.png']);
  });

  it('사진을 제거할 수 있고 모두 제거하면 목록이 사라진다', async () => {
    render(<BlogPostCreateModal onClose={() => {}} />);

    await userEvent.upload(screen.getByLabelText('사진 선택'), [createImage('a.png'), createImage('b.png')]);
    await userEvent.click(screen.getByRole('button', { name: 'a.png 제거' }));

    expect(screen.queryByText('a.png')).not.toBeInTheDocument();
    expect(screen.getByText('b.png')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'b.png 제거' }));

    expect(screen.queryByLabelText('선택한 사진')).not.toBeInTheDocument();
  });

  it('취소, 저장, 닫기 버튼은 onClose를 호출한다', async () => {
    const onClose = vi.fn();
    render(<BlogPostCreateModal onClose={onClose} />);

    await userEvent.click(screen.getByRole('button', { name: '취소' }));
    await userEvent.click(screen.getByRole('button', { name: '저장' }));
    await userEvent.click(screen.getByRole('button', { name: '닫기' }));

    expect(onClose).toHaveBeenCalledTimes(3);
  });
});
