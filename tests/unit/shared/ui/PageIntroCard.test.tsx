import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PageIntroCard } from '@/shared/ui/PageIntroCard';

describe('PageIntroCard', () => {
  it('로고와 도메인 경로만 있으면 제목과 설명은 표시하지 않는다', () => {
    render(<PageIntroCard domainPath="blog / me" />);

    expect(screen.getByLabelText('choimory.dev')).toBeInTheDocument();
    expect(screen.getByText('/ blog / me')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('title과 description이 있으면 제목과 설명을 표시한다', () => {
    render(<PageIntroCard domainPath="notice" title="공지사항" description="새 소식을 확인해보세요." />);

    expect(screen.getByRole('heading', { level: 1, name: '공지사항' })).toBeInTheDocument();
    expect(screen.getByText('새 소식을 확인해보세요.')).toBeInTheDocument();
  });
});
