'use client';

import { useAuth } from '@/features/auth/context/AuthContext';

import { FeedView } from '../components/FeedView';
import { feedViewModel } from '../model/feedTypes';

/**
 * feed 서비스 화면의 데이터 흐름을 담당하는 Container입니다.
 *
 * @returns feed 서비스 화면
 */
export function FeedContainer() {
  const { authStatus } = useAuth();

  return (
    <FeedView
      viewModel={{
        ...feedViewModel,
        authStatus,
      }}
    />
  );
}
