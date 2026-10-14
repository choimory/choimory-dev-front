import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ListRow } from '@/shared/ui/ListRow';

/**
 * ListRow 테스트
 * 목록 행이 href/onClick 유무에 따라 링크, 버튼, 정적 행으로 렌더링되는지와 슬롯(leading, trailing)별 열 구성, 톤, 여백, 흐림 표시를 확인합니다.
 */
describe('ListRow', () => {
  it('href가 있으면 링크로 렌더링하고 hover 클래스를 붙인다', () => {
    render(<ListRow href="/services">서비스</ListRow>);

    const link = screen.getByRole('link', { name: '서비스' });

    expect(link).toHaveAttribute('href', '/services');
    expect(link).toHaveClass('hover:bg-surface-strong');
  });

  it('onClick이 있으면 버튼으로 렌더링하고 클릭을 전달한다', async () => {
    const onClick = vi.fn();
    render(<ListRow onClick={onClick}>설정</ListRow>);

    const button = screen.getByRole('button', { name: '설정' });
    // 행을 클릭한다
    await userEvent.click(button);

    expect(button).toHaveClass('text-left', 'hover:bg-surface-strong');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('href와 onClick이 없으면 as 태그의 정적 행으로 렌더링한다', () => {
    render(<ListRow as="article" ariaLabel="정적 행">본문</ListRow>);

    const row = screen.getByRole('article', { name: '정적 행' });

    expect(row.tagName).toBe('ARTICLE');
    expect(row).not.toHaveClass('hover:bg-surface-strong');
  });

  it('leading, trailing 유무에 따라 열 구성이 달라진다', () => {
    const { rerender } = render(<ListRow as="article" ariaLabel="행">본문</ListRow>);

    expect(screen.getByRole('article')).not.toHaveClass('grid-cols-[auto_minmax(0,1fr)_auto]');

    // leading만 있으면 2열(좌측, 본문)이다
    rerender(<ListRow as="article" ariaLabel="행" leading={<i>L</i>}>본문</ListRow>);
    expect(screen.getByRole('article')).toHaveClass('grid-cols-[auto_minmax(0,1fr)]');

    // trailing만 있으면 2열(본문, 우측)이다
    rerender(<ListRow as="article" ariaLabel="행" trailing={<i>T</i>}>본문</ListRow>);
    expect(screen.getByRole('article')).toHaveClass('grid-cols-[minmax(0,1fr)_auto]');

    // 둘 다 있으면 3열(좌측, 본문, 우측)이다
    rerender(<ListRow as="article" ariaLabel="행" leading={<i>L</i>} trailing={<i>T</i>}>본문</ListRow>);
    expect(screen.getByRole('article')).toHaveClass('grid-cols-[auto_minmax(0,1fr)_auto]');
  });

  it('leading, 본문, trailing 순서로 렌더링한다', () => {
    render(<ListRow as="article" ariaLabel="행" leading={<i>L</i>} trailing={<i>T</i>}>본문</ListRow>);

    expect(screen.getByRole('article')).toHaveTextContent('L본문T');
  });

  it('strong 톤은 테두리가 없고 hover 클래스도 붙지 않는다', () => {
    render(<ListRow href="/feed" tone="strong">랭킹</ListRow>);

    const link = screen.getByRole('link', { name: '랭킹' });

    expect(link).toHaveClass('bg-surface-strong');
    expect(link).not.toHaveClass('border', 'hover:bg-surface-strong');
  });

  it('padding, isDimmed, className, style을 반영한다', () => {
    render(
      <ListRow as="article" ariaLabel="행" padding="md" isDimmed className="blog-ranking-enter" style={{ animationDelay: '70ms' }}>
        본문
      </ListRow>,
    );

    const row = screen.getByRole('article');

    expect(row).toHaveClass('p-4', 'opacity-75', 'blog-ranking-enter');
    expect(row).toHaveStyle({ animationDelay: '70ms' });
  });
});
