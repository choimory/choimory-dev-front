'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";

export default function RootPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 로그인 상태 확인 로직
    // 실제로는 localStorage, cookies, 또는 API 호출을 통해 확인
    const checkLoginStatus = () => {
      // 예시: localStorage에서 로그인 상태 확인
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      
      if (isLoggedIn) {
        // /home 또는 /main 중 하나로 리다이렉트
        // 여기서는 /main을 우선으로 설정
        router.push('/main');
      } else {
        router.push('/login');
      }
      
      setIsLoading(false);
    };

    checkLoginStatus();
  }, [router]);

  // 로딩 중일 때 표시할 내용
  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-white dark:bg-black">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 이 부분은 실제로는 렌더링되지 않지만, TypeScript를 위해 필요
  return null;
}
