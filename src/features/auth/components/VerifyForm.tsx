import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';
import { formatTime } from '@/shared/utils/formatTime';

/**
 * 이메일 인증 폼 컴포넌트의 Props
 */
type VerifyFormProps = {
  email: string;                    // 인증 코드를 발송한 이메일
  code: string;                     // 입력된 인증 코드
  error: string;                    // 화면에 표시할 오류 메시지
  timeLeft: number;                 // 인증 코드 잔여 유효 시간(초)
  isTimerRunning: boolean;          // 인증 유효 시간 진행 여부
  onChangeCode: (code: string) => void; // 인증 코드 변경 시 실행할 동작
  onSubmit: () => void;             // 인증 코드 제출 시 실행할 동작
  onResend: () => void;             // 인증 코드 재발송 시 실행할 동작
};

/**
 * 이메일로 발송된 인증 코드를 입력받아 확인하는 폼 컴포넌트입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 이메일 인증 폼
 */
export function VerifyForm({
  email,
  code,
  error,
  timeLeft,
  isTimerRunning,
  onChangeCode,
  onSubmit,
  onResend,
}: VerifyFormProps) {
  return (
    <div className="w-full max-w-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">이메일 인증</h2>
        <p className="text-gray-600 dark:text-gray-300">
          <span className="font-medium text-blue-500">{email}</span>으로 발송된 인증 코드를
          입력해주세요.
        </p>
      </div>

      {/* 잔여 유효 시간. 만료된 경우 강조하여 표시한다. */}
      <div className="my-8 text-center">
        <p
          className={`text-5xl font-bold ${
            isTimerRunning ? 'text-gray-900 dark:text-white' : 'text-red-500'
          }`}
        >
          {formatTime(timeLeft)}
        </p>
      </div>

      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <TextField
          id="code"
          label="인증 코드"
          value={code}
          placeholder="인증 코드 6자리"
          isRequired
          isDisabled={!isTimerRunning}
          onChange={onChangeCode}
        />

        {error && <p className="text-sm text-center text-red-500">{error}</p>}

        <Button type="submit" isFullWidth isDisabled={!isTimerRunning}>
          인증하기
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          코드를 받지 못하셨나요?{' '}
          <button
            type="button"
            onClick={onResend}
            className="font-medium text-blue-600 hover:underline dark:text-blue-500 bg-transparent border-none p-0"
          >
            재전송
          </button>
        </p>
      </div>
    </div>
  );
}
