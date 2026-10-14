import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ListPanel } from '@/features/feed/components/ListPanel';

/**
 * ListPanel 테스트
 * 제목과 문자열 목록을 담는 패널의 영역 이름, 항목 순서, 빈 목록을 확인합니다.
 */
describe('ListPanel', () => {
  it('제목을 영역 이름으로 연결해 보여준다', () => {
    render(<ListPanel title="최근 이벤트" items={['신규 구독']} />);

    expect(screen.getByRole('region', { name: '최근 이벤트' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: '최근 이벤트' })).toBeInTheDocument();
  });

  it('항목을 순서대로 나열한다', () => {
    render(<ListPanel title="최근 이벤트" items={['신규 구독', '채팅 이벤트', '도네이션']} />);

    const panel = screen.getByRole('region', { name: '최근 이벤트' });

    expect(within(panel).getAllByText(/./, { selector: 'p' }).map((item) => item.textContent)).toEqual(['신규 구독', '채팅 이벤트', '도네이션']);
  });

  it('항목이 없어도 제목은 보여준다', () => {
    render(<ListPanel title="최근 이벤트" items={[]} />);

    expect(screen.getByRole('heading', { name: '최근 이벤트' })).toBeInTheDocument();
    expect(screen.queryByText(/./, { selector: 'p' })).not.toBeInTheDocument();
  });
});
