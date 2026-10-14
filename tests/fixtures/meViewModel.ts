import type { MeViewModel } from '@/features/me/model/meTypes';

/** 테스트용 마이페이지 화면 데이터 (설정 항목 4종: 개인정보, 테마, 2차 인증, 탈퇴) */
export const ME_VIEW_MODEL_FIXTURE: MeViewModel = {
  nickname: 'mory.dev',
  email: 'mory@example.com',
  description: '테스트용 소개예요.',
  settingItems: [
    { id: 'profile', title: '개인정보 변경', description: '개인정보를 관리해요.', iconName: 'user', actionLabel: '수정' },
    { id: 'theme', title: '사이트 설정', description: '테마를 선택해요.', iconName: 'monitor', actionLabel: '설정' },
    { id: 'otp', title: '2차 인증', description: '계정 보안을 강화해요.', iconName: 'bell', actionLabel: '관리' },
    { id: 'delete', title: '회원 탈퇴', description: '탈퇴 절차예요.', iconName: 'tag', actionLabel: '탈퇴', tone: 'danger' },
  ],
};
