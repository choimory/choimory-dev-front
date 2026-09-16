'use client';

import { useEffect, useState } from 'react';

import { userApi } from '../api/userApi';
import { toUserSummaryViewModel, type UserSummaryViewModel } from '../model/userTypes';

/**
 * 사용자 요약 정보를 조회하는 Custom Hook입니다.
 *
 * @returns 사용자 요약 정보와 조회 상태
 */
export function useUserSummary() {
  const [userSummary, setUserSummary] = useState<UserSummaryViewModel | null>(null); // 조회된 사용자 요약 정보
  const [isLoading, setIsLoading] = useState(true);                                  // 조회 진행 여부

  useEffect(() => {
    // 컴포넌트가 이미 해제된 뒤 상태를 변경하지 않도록 표시한다.
    let isMounted = true;

    /**
     * 사용자 요약 정보를 조회하여 화면 표시용 모델로 변환합니다.
     *
     * @returns 조회 완료 Promise
     */
    const fetchUserSummary = async (): Promise<void> => {
      const response = await userApi.getUserSummary();

      if (!isMounted) {
        return;
      }

      setUserSummary(toUserSummaryViewModel(response));
      setIsLoading(false);
    };

    fetchUserSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  return { userSummary, isLoading };
}
