'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function WelcomePageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const nickname = searchParams.get('nickname');

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-black">
            <header className="flex items-center justify-center px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
                <h1 className="text-xl font-bold">choimory-io</h1>
            </header>

            <main className="flex-1 flex items-center justify-center px-6">
                <div className="w-full max-w-lg text-center">
                    <h2 className="text-3xl font-bold mb-4">환영합니다!</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                        <span className="font-semibold text-blue-500">{nickname}</span>님, 회원가입이 성공적으로 완료되었습니다.
                    </p>
                    <button
                        onClick={() => router.push('/login')}
                        className="w-full max-w-xs mx-auto bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                    >
                        로그인 페이지로 이동
                    </button>
                </div>
            </main>
        </div>
    );
}

export default function WelcomePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <WelcomePageContent />
        </Suspense>
    )
}
