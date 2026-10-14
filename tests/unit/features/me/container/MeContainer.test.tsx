import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MeContainer } from '@/features/me/container/MeContainer';
import { meViewModel } from '@/features/me/model/meTypes';

/**
 * MeContainer 테스트
 * 컨테이너가 마이페이지 임시 데이터를 화면에 전달하는지 확인합니다.
 */
describe('MeContainer', () => {
  it('마이페이지 임시 데이터를 화면에 전달한다', () => {
    render(<MeContainer />);

    expect(screen.getByRole('heading', { level: 1, name: meViewModel.nickname })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '마이페이지 설정' }).children).toHaveLength(meViewModel.settingItems.length);
  });
});
