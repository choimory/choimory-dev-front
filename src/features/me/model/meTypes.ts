import type { IconName } from '@/shared/ui/Icon';

/**
 * 마이페이지 설정 항목
 */
export type MeSettingItem = {
  id: string;        // 설정 항목 고유 ID
  title: string;     // 설정 항목 제목
  description: string; // 설정 항목 설명
  iconName: IconName; // 설정 항목 아이콘 이름
  actionLabel: string; // 버튼에 표시할 텍스트
  tone?: 'normal' | 'danger'; // 항목 강조 상태
};

/**
 * 마이페이지 화면 데이터
 */
export type MeViewModel = {
  nickname: string;       // 사용자 닉네임
  email: string;          // 사용자 이메일
  description: string;    // 사용자 설명
  settingItems: MeSettingItem[]; // 마이페이지 설정 항목 목록
};

/** 마이페이지 화면 임시 데이터 */
export const meViewModel: MeViewModel = {
  nickname: 'mory.dev',
  email: 'mory@example.com',
  description: 'choimory.dev의 서비스를 조용히 다듬는 계정입니다.',
  settingItems: [
    {
      id: 'profile',
      title: '개인정보 변경',
      description: '닉네임, 이메일, 프로필 설명을 관리합니다.',
      iconName: 'user',
      actionLabel: '수정',
    },
    {
      id: 'theme',
      title: '사이트 설정',
      description: '테마를 라이트, 다크, 시스템 설정 중에서 선택합니다.',
      iconName: 'monitor',
      actionLabel: '설정',
    },
    {
      id: 'otp',
      title: '2차 인증',
      description: '이메일 OTP 또는 모바일 OTP로 계정 보안을 강화합니다.',
      iconName: 'bell',
      actionLabel: '관리',
    },
    {
      id: 'delete',
      title: '회원 탈퇴',
      description: '계정과 서비스 데이터를 정리하는 탈퇴 절차입니다.',
      iconName: 'tag',
      actionLabel: '탈퇴',
      tone: 'danger',
    },
  ],
};
