import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Modal } from '@/shared/ui/Modal';

/**
 * Modal 테스트
 * 모달이 document.body 포털에 dialog 역할로 렌더링되는지, title 헤더와 닫기 동작, 배경과 패널 클릭 처리, 위치와 배경 막, 크기 옵션을 확인합니다.
 */
describe('Modal', () => {
  it('dialog 역할로 document.body에 포털 렌더링한다', () => {
    // 제목 요소(id)를 labelledBy로 연결한 모달을 렌더링한다
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

    // 헤더의 닫기 버튼을 클릭한다
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

    // 패널 안쪽을 클릭하면 닫히지 않는다
    await userEvent.click(screen.getByText('안쪽 내용'));
    expect(onClose).not.toHaveBeenCalled();

    // 배경(패널의 부모)을 클릭하면 닫힌다
    await userEvent.click(screen.getByRole('dialog').parentElement as HTMLElement);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('기본값은 center 위치, soft 배경, sm 폭, p-4 여백이다', () => {
    // 옵션 없이 렌더링한다
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
    // 모든 옵션을 지정해 렌더링한다
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
