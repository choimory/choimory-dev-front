'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function VerifyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  useEffect(() => {
    if (!isTimerRunning) return;

    if (timeLeft === 0) {
      setIsTimerRunning(false);
      setError('인증 시간이 만료되었습니다. 코드를 다시 요청해주세요.');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isTimerRunning]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTimerRunning) {
        setError('인증 시간이 만료되었습니다. 코드를 다시 요청해주세요.');
        return;
    }
    if (!code) {
      setError('인증 코드를 입력해주세요.');
      return;
    }
    const nickname = searchParams.get('nickname');

    // TODO: 인증 코드 확인 API 호출
    console.log(`Verifying email: ${email} with code: ${code}`);
    setError('');
    router.push(`/signup/welcome?nickname=${encodeURIComponent(nickname || '')}`);
  };

  const handleResend = () => {
    // TODO: 인증 코드 재발송 API 호출
    console.log(`Resending verification code to: ${email}`);
    setTimeLeft(180);
    setIsTimerRunning(true);
    setError('');
    setCode('');
    alert('인증 코드를 다시 발송했습니다.');
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-black">
      <header className="flex items-center justify-center px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
        <h1 className="text-xl font-bold">choimory-io</h1>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">이메일 인증</h2>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-medium text-blue-500">{email}</span>으로 발송된
              인증 코드를 입력해주세요.
            </p>
          </div>

          <div className="my-8 text-center">
            <p className={`text-5xl font-bold ${!isTimerRunning ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                {formatTime(timeLeft)}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                인증 코드
              </label>
              <input
                id="code"
                name="code"
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="인증 코드 6자리"
                disabled={!isTimerRunning}
              />
            </div>

            {error && <p className="text-sm text-center text-red-500">{error}</p>}

            <button
              type="submit"
              className={`w-full font-medium py-3 px-4 rounded-lg transition-colors ${isTimerRunning ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              disabled={!isTimerRunning}
            >
              인증하기
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              코드를 받지 못하셨나요?{' '}
              <button
                onClick={handleResend}
                className="font-medium text-blue-600 hover:underline dark:text-blue-500 bg-transparent border-none p-0"
              >
                재전송
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyPageContent />
        </Suspense>
    )
}
