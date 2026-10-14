import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SectionHeader } from '@/shared/ui/SectionHeader';

describe('SectionHeader', () => {
  it('도메인 경로와 제목을 보여주고 headingId를 연결한다', () => {
    render(<SectionHeader domainPath="blog / setting" title="설정" headingId="setting-title" />);

    const heading = screen.getByRole('heading', { level: 2, name: '설정' });

    expect(screen.getByText('blog / setting')).toBeInTheDocument();
    expect(heading).toHaveAttribute('id', 'setting-title');
  });

  it('action이 없으면 링크를 표시하지 않는다', () => {
    render(<SectionHeader domainPath="blog / setting" title="설정" />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('action이 있으면 우측 링크를 표시한다', () => {
    render(<SectionHeader domainPath="feed / event" title="최근 이벤트" action={{ label: '더보기', href: '/feed/popular' }} />);

    expect(screen.getByRole('link', { name: '더보기' })).toHaveAttribute('href', '/feed/popular');
  });
});
