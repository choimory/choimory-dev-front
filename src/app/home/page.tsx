'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleLogout = () => {
    // 실제 로그아웃 로직은 여기에 구현
    localStorage.removeItem('isLoggedIn');
    router.push('/login');
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
        <h1 className="text-xl font-bold">choimory-io</h1>
        <div className="flex items-center space-x-3">
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
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto px-6 py-8">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Welcome</h2>
            <p className="text-gray-600 dark:text-gray-300">
              This is a mobile app style layout for choimory-io-front
            </p>
          </div>

          {/* Content Cards */}
          <div className="space-y-6">
            {[1, 2, 3, 4].map((item) => (
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