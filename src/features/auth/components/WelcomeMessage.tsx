import { AppHeader } from '@/shared/ui/AppHeader';
import { Button } from '@/shared/ui/Button';
import { ScreenLayout } from '@/shared/ui/ScreenLayout';

/**
 * 회원가입 완료 안내 컴포넌트의 Props
 */
type WelcomeMessageProps = {
  nickname: string;         // 가입한 사용자의 닉네임
  onMoveToLogin: () => void; // 로그인 화면으로 이동할 때 실행할 동작
};

/**
 * 회원가입이 완료되었음을 안내하는 화면 컴포넌트입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 회원가입 완료 안내 화면
 */
export function WelcomeMessage({ nickname, onMoveToLogin }: WelcomeMessageProps) {
  return (
    <ScreenLayout>
      <AppHeader isCentered isLinked={false} />

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-lg text-center">
          <h2 className="text-3xl font-bold mb-4">환영합니다!</h2>

          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            <span className="font-semibold text-blue-500">{nickname}</span>님, 회원가입이 성공적으로
            완료되었습니다.
          </p>

          <div className="max-w-xs mx-auto">
            <Button isFullWidth onClick={onMoveToLogin}>
              로그인 페이지로 이동
            </Button>
          </div>
        </div>
      </main>
    </ScreenLayout>
  );
}
