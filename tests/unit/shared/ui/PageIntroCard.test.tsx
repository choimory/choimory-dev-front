import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PageIntroCard } from '@/shared/ui/PageIntroCard';

/**
 * PageIntroCard 테스트
 * 화면 최상단 소개 영역이 제목·설명이 없으면 렌더링하지 않고, 있으면 제목과 설명을 보여주는지 확인합니다.
 * 로고+경로 라벨은 상단 바가 보여주므로 소개 영역에는 표시하지 않습니다.
 */
describe('PageIntroCard', () => {
  it('제목과 설명이 없으면 아무것도 렌더링하지 않는다', () => {
    const { container } = render(<PageIntroCard domainPath="blog / me" />);

    expect(container).toBeEmptyDOMElement();
  });

  it('로고와 도메인 경로 라벨은 표시하지 않는다', () => {
    render(<PageIntroCard domainPath="notice" title="공지사항" />);

    expect(screen.queryByLabelText('choimory.dev')).not.toBeInTheDocument();
    expect(screen.queryByText('/ notice')).not.toBeInTheDocument();
  });

  it('title과 description이 있으면 제목과 설명을 표시한다', () => {
    render(<PageIntroCard domainPath="notice" title="공지사항" description="새 소식을 확인해보세요." />);

    expect(screen.getByRole('heading', { level: 1, name: '공지사항' })).toBeInTheDocument();
    expect(screen.getByText('새 소식을 확인해보세요.')).toBeInTheDocument();
  });
});
