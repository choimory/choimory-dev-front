import type { FormEvent } from 'react';
import Link from 'next/link';

import { AppFrame } from '@/shared/ui/AppFrame';
import { BrandLogo } from '@/shared/ui/BrandLogo';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';

import type { LoginViewModel } from '../model/authTypes';

/**
 * 로그인 화면 컴포넌트의 Props
 */
type LoginViewProps = {
  viewModel: LoginViewModel;                        // 로그인 화면 데이터
  email: string;                                    // 이메일 입력 값
  password: string;                                 // 비밀번호 입력 값
  isSubmitting: boolean;                            // 로그인 요청 진행 여부
  errorMessage: string | null;                      // 로그인 오류 메시지
  onChangeEmail: (email: string) => void;           // 이메일 변경 이벤트
  onChangePassword: (password: string) => void;     // 비밀번호 변경 이벤트
  onSubmit: (event: FormEvent<HTMLFormElement>) => void; // 로그인 제출 이벤트
};

/** 소셜 로그인 버튼 색상 클래스 */
const SOCIAL_LOGIN_BUTTON_CLASS_NAME: Record<LoginViewModel['socialProviders'][number]['id'], string> = {
  naver: 'border-[#03c75a] bg-[#03c75a] text-white',
  kakao: 'border-[#fee500] bg-[#fee500] text-[#191919]',
  google: 'border-rule-2 bg-surface-strong text-foreground',
};

/** 로그인 입력창 공통 클래스 */
const INPUT_CLASS_NAME =
  'h-10 min-w-0 rounded-input border border-muted bg-background px-3 text-base text-foreground hover:border-ink-2 focus:border-primary focus-visible:outline-focus disabled:opacity-50';

/**
 * 로그인 폼을 표시하는 화면입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 로그인 화면
 */
export function LoginView({
  viewModel,
  email,
  password,
  isSubmitting,
  errorMessage,
  onChangeEmail,
  onChangePassword,
  onSubmit,
}: LoginViewProps) {
  return (
    <AppFrame>
      <main className="mx-auto grid min-h-dvh w-full max-w-[440px] content-center px-4 py-8 sm:py-12">
        <header className="mb-5">
          <Link className="inline-flex min-h-11 items-center rounded-input hover:opacity-80 focus-visible:outline-focus active:opacity-65" href="/" aria-label="choimory.dev 홈">
            <BrandLogo size="md" />
          </Link>
          <h1 className="mt-5 min-w-0 font-display text-display font-semibold text-foreground">{viewModel.title}</h1>
          <p className="mt-1 text-sm leading-6 text-muted">{viewModel.description}</p>
        </header>

        <Card as="section" className="sm:p-5">
          <form className="grid gap-3" onSubmit={onSubmit}>
            <label className="grid gap-1 text-sm font-medium text-foreground">
              이메일
              <input
                className={INPUT_CLASS_NAME}
                name="email"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(event) => onChangeEmail(event.target.value)}
              />
            </label>

            <label className="grid gap-1 text-sm font-medium text-foreground">
              비밀번호
              <input
                className={INPUT_CLASS_NAME}
                name="password"
                placeholder="비밀번호"
                type="password"
                value={password}
                onChange={(event) => onChangePassword(event.target.value)}
              />
            </label>

            {errorMessage && (
              <p className="text-sm text-accent-red" role="alert">
                {errorMessage}
              </p>
            )}

            <Button size="lg" className="mt-2" type="submit" disabled={isSubmitting}>
              {isSubmitting ? '로그인 중...' : '로그인'}
            </Button>
          </form>

          <Link className="key hit-area mt-3 grid h-10 w-full place-items-center text-sm font-semibold" href={viewModel.signupLink.href}>
            {viewModel.signupLink.label}
          </Link>
        </Card>

        <div className="mt-5">
          <div className="mb-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-xs text-muted">
            <span className="h-px bg-border" />
            <span>또는</span>
            <span className="h-px bg-border" />
          </div>

          <div className="grid gap-2">
            {viewModel.socialProviders.map((provider) => (
              <button
                key={provider.id}
                className={`relative h-10 rounded-input border px-4 text-sm font-semibold after:absolute after:-inset-y-0.5 after:inset-x-0 enabled:hover:brightness-95 focus-visible:outline-focus enabled:active:shadow-(--shadow-key-press) disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-transform motion-safe:duration-(--dur-micro) motion-safe:enabled:active:translate-y-0.5 ${SOCIAL_LOGIN_BUTTON_CLASS_NAME[provider.id]}`}
                type="button"
              >
                {provider.label}
              </button>
            ))}
          </div>

          <p className="mt-3 text-xs leading-5 text-muted">
            아직 실제 소셜 로그인 연동 전이라 버튼은 화면 구성 확인용이에요.
          </p>
        </div>
      </main>
    </AppFrame>
  );
}
