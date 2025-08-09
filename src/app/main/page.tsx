'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

export default function MainPage() {
  const router = useRouter();

  const handleLogout = () => {
    // 실제 로그아웃 로직은 여기에 구현
    localStorage.removeItem('isLoggedIn');
    router.push('/login');
  };

  // 예시 사용자 데이터 (실제로는 API에서 가져올 데이터)
  const userInfo = {
    nickname: 'choimory',
    posts: 15,
    comments: 42,
    following: 128,
    followers: 256,
    joinDate: '2024-01-15',
    lastLogin: '2024-12-19'
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-black">
      <Header>
        <button 
          onClick={handleLogout}
          className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          로그아웃
        </button>
        <button className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </Header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-6 py-8">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Welcome</h2>
            <p className="text-gray-600 dark:text-gray-300">
              This is a mobile app style layout for choimory-dev
            </p>
          </div>

          {/* Content Cards */}
          <div className="space-y-6">
            {/* User Info Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {userInfo.nickname.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    환영합니다 {userInfo.nickname}님
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">활성 사용자</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{userInfo.posts}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">내 글</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{userInfo.comments}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">내 댓글</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{userInfo.following}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">팔로잉</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{userInfo.followers}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">팔로워</div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">가입일</span>
                  <span className="text-gray-900 dark:text-white font-medium">{userInfo.joinDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">최근 접속일</span>
                  <span className="text-gray-900 dark:text-white font-medium">{userInfo.lastLogin}</span>
                </div>
              </div>

              <div className="mt-4">
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors">
                  프로필 수정
                </button>
              </div>
            </div>

            {/* Other Content Cards */}
            {[2, 3, 4].map((item) => (
              <div key={item} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-2">Section {item}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  This is a sample content section. You can add any content here that fits your needs.
                </p>
                <div className="mt-4">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors">
                    Action {item}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Content */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg p-8 text-white">
              <h3 className="text-xl font-bold mb-2">Feature Highlight</h3>
              <p className="text-blue-100">
                This section can showcase important features or information.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="flex items-center justify-around px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
        <button className="p-2">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </button>
        <button className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        <button className="p-2">
          <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        </button>
      </nav>
    </div>
  );
} 