import { Button } from '@/shared/ui/Button';

import type { UserSummaryViewModel } from '../model/userTypes';

/**
 * 사용자 요약 정보 카드 컴포넌트의 Props
 */
type UserSummaryCardProps = {
  userSummary: UserSummaryViewModel; // 표시할 사용자 요약 정보
  onEditProfile: () => void;         // 프로필 수정 버튼 클릭 시 실행할 동작
};

/**
 * 사용자의 닉네임과 활동 통계를 표시하는 카드 컴포넌트입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 사용자 요약 정보 카드
 */
export function UserSummaryCard({ userSummary, onEditProfile }: UserSummaryCardProps) {
  // 화면에 표시할 활동 통계 항목을 구성한다.
  const statistics = [
    { label: '내 글', value: userSummary.postCount },
    { label: '내 댓글', value: userSummary.commentCount },
    { label: '팔로잉', value: userSummary.followingCount },
    { label: '팔로워', value: userSummary.followerCount },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
          {userSummary.initial}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            환영합니다 {userSummary.nickname}님
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">활성 사용자</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {statistics.map((statistic) => (
          <div key={statistic.label} className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{statistic.value}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{statistic.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">가입일</span>
          <span className="text-gray-900 dark:text-white font-medium">{userSummary.joinDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">최근 접속일</span>
          <span className="text-gray-900 dark:text-white font-medium">
            {userSummary.lastLoginDate}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <Button size="sm" isFullWidth onClick={onEditProfile}>
          프로필 수정
        </Button>
      </div>
    </div>
  );
}
