'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);

  const handleEmailCheck = () => {
    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }
    // TODO: 이메일 중복체크 API 호출
    console.log('Checking email:', email);
    alert('사용 가능한 이메일입니다.');
    setIsEmailChecked(true);
    setError('');
  };

  const handleNicknameCheck = () => {
    if (!nickname) {
      setError('닉네임을 입력해주세요.');
      return;
    }
    // TODO: 닉네임 중복체크 API 호출
    console.log('Checking nickname:', nickname);
    alert('사용 가능한 닉네임입니다.');
    setIsNicknameChecked(true);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailChecked) {
      setError('이메일 중복체크를 해주세요.');
      return;
    }
    if (!isNicknameChecked) {
      setError('닉네임 중복체크를 해주세요.');
      return;
    }
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    // TODO: 회원가입 API 호출. 실제로는 이 단계에서 인증 이메일을 발송합니다.
    console.log({ email, nickname, password });
    setError('');
    router.push(`/signup/verify?email=${encodeURIComponent(email)}&nickname=${encodeURIComponent(nickname)}`);
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-black">
      {/* Signup Header */}
      <header className="flex items-center justify-center px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
        <h1 className="text-xl font-bold">choimory-io</h1>
      </header>

      {/* Signup Form */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-lg">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">회원가입</h2>
                <p className="text-gray-600 dark:text-gray-300">
                새 계정을 만드세요
                </p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
                <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                이메일
                </label>
                <div className="flex">
                    <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setIsEmailChecked(false);
                    }}
                    className="flex-grow px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="이메일을 입력하세요"
                    />
                    <button
                    type="button"
                    onClick={handleEmailCheck}
                    className="px-4 py-3 border-t border-b border-r border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-r-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                    중복체크
                    </button>
                </div>
            </div>
            <div>
                <label
                htmlFor="nickname"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                닉네임
                </label>
                <div className="flex">
                    <input
                    id="nickname"
                    name="nickname"
                    type="text"
                    required
                    value={nickname}
                    onChange={(e) => {
                        setNickname(e.target.value);
                        setIsNicknameChecked(false);
                    }}
                    className="flex-grow px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="닉네임을 입력하세요"
                    />
                    <button
                    type="button"
                    onClick={handleNicknameCheck}
                    className="px-4 py-3 border-t border-b border-r border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-r-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                    중복체크
                    </button>
                </div>
            </div>
            <div>
                <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                비밀번호
                </label>
                <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="비밀번호를 입력하세요"
                />
            </div>
            <div>
                <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                비밀번호 확인
                </label>
                <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="비밀번호를 다시 입력하세요"
                />
            </div>
            {error && <p className="text-sm text-center text-red-500">{error}</p>}
            <div>
                <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                가입하기
                </button>
            </div>
            </form>
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                계정이 이미 있으신가요?{' '}
                <a
                    href="/login"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                    로그인
                </a>
                </p>
            </div>
        </div>
      </main>
    </div>
  );
}