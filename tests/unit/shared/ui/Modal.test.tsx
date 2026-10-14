import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Modal } from '@/shared/ui/Modal';

describe('Modal', () => {
  it('dialog 역할로 document.body에 포털 렌더링한다', () => {
    const { container } = render(
      <Modal labelledBy="modal-title" onClose={() => {}}>
        <h2 id="modal-title">제목</h2>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog', { name: '제목' });

    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(container).not.toContainElement(dialog);
    expect(document.body).toContainElement(dialog);
  });

  it('title이 있으면 제목과 닫기 버튼 헤더를 렌더링한다', async () => {
    const onClose = vi.fn();
    render(
      <Modal title="글작성" labelledBy="blog-modal-title" onClose={onClose}>
        본문
      </Modal>,
    );

    expect(screen.getByRole('dialog', { name: '글작성' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: '글작성' })).toHaveAttribute('id', 'blog-modal-title');

    await userEvent.click(screen.getByRole('button', { name: '닫기' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('배경을 누르면 닫히고 패널 안쪽을 눌러도 닫히지 않는다', async () => {
    const onClose = vi.fn();
    render(
      <Modal labelledBy="modal-title" onClose={onClose}>
        <h2 id="modal-title">제목</h2>
        <p>안쪽 내용</p>
      </Modal>,
    );

    await userEvent.click(screen.getByText('안쪽 내용'));
    expect(onClose).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole('dialog').parentElement as HTMLElement);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('기본값은 center 위치, soft 배경, sm 폭, p-4 여백이다', () => {
    render(
      <Modal labelledBy="modal-title" onClose={() => {}}>
        <h2 id="modal-title">제목</h2>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');

    expect(dialog.parentElement).toHaveClass('place-items-center', 'bg-background/70');
    expect(dialog).toHaveClass('max-w-sm', 'p-4', 'shadow-2xl');
  });

  it('placement, overlay, size, padding, className을 반영한다', () => {
    render(
      <Modal labelledBy="modal-title" onClose={() => {}} placement="bottom" overlay="dark" size="lg" padding="lg" className="max-h-[86vh]">
        <h2 id="modal-title">제목</h2>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');

    expect(dialog.parentElement).toHaveClass('place-items-end', 'sm:place-items-center', 'bg-black/60');
    expect(dialog).toHaveClass('max-w-[640px]', 'p-5', 'max-h-[86vh]');
  });
});
