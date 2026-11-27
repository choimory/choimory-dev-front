import type { FormEvent } from 'react';
import Link from 'next/link';

import { AppFrame } from '@/shared/ui/AppFrame';
import { BrandLogo } from '@/shared/ui/BrandLogo';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';

import type { FieldErrors, SignupFormValues, SignupViewModel } from '../model/authTypes';

/**
 * 회원가입 화면 컴포넌트의 Props
 */
type SignupViewProps = {
  viewModel: SignupViewModel;                                  // 회원가입 화면 데이터
  values: SignupFormValues;                                    // 폼 입력 값
  fieldErrors: FieldErrors;                                    // 필드별 오류 메시지
  formError: string | null;                                    // 폼 전체 오류 메시지
  isSubmitting: boolean;                                       // 가입 요청 진행 여부
  onChange: (field: keyof SignupFormValues, value: string) => void; // 입력 값 변경 이벤트
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;       // 회원가입 제출 이벤트
};

/** 입력창 공통 클래스 */
const INPUT_CLASS_NAME =
  'h-10 min-w-0 rounded-input border border-muted bg-background px-3 text-base text-foreground hover:border-ink-2 focus:border-primary focus-visible:outline-focus disabled:opacity-50';

/** 필드 오류 메시지 클래스 */
const FIELD_ERROR_CLASS_NAME = 'text-xs text-accent-red';

/**
 * 회원가입 폼을 표시하는 화면입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 회원가입 화면
 */
export function SignupView({ viewModel, values, fieldErrors, formError, isSubmitting, onChange, onSubmit }: SignupViewProps) {
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
              닉네임
              <input
                className={INPUT_CLASS_NAME}
                name="nickname"
                placeholder="mory"
                type="text"
                value={values.nickname}
                onChange={(event) => onChange('nickname', event.target.value)}
              />
              {fieldErrors.nickname && <span className={FIELD_ERROR_CLASS_NAME}>{fieldErrors.nickname}</span>}
            </label>

            <label className="grid gap-1 text-sm font-medium text-foreground">
              이메일
              <input
                className={INPUT_CLASS_NAME}
                name="email"
                placeholder="you@example.com"
                type="email"
                value={values.email}
                onChange={(event) => onChange('email', event.target.value)}
              />
              {fieldErrors.email && <span className={FIELD_ERROR_CLASS_NAME}>{fieldErrors.email}</span>}
            </label>

            <label className="grid gap-1 text-sm font-medium text-foreground">
              비밀번호
              <input
                className={INPUT_CLASS_NAME}
                name="password"
                placeholder="비밀번호"
                type="password"
                value={values.password}
                onChange={(event) => onChange('password', event.target.value)}
              />
              {fieldErrors.password && <span className={FIELD_ERROR_CLASS_NAME}>{fieldErrors.password}</span>}
            </label>

            <label className="grid gap-1 text-sm font-medium text-foreground">
              비밀번호 확인
              <input
                className={INPUT_CLASS_NAME}
                name="passwordConfirm"
                placeholder="비밀번호 확인"
                type="password"
                value={values.passwordConfirm}
                onChange={(event) => onChange('passwordConfirm', event.target.value)}
              />
              {fieldErrors.passwordConfirm && <span className={FIELD_ERROR_CLASS_NAME}>{fieldErrors.passwordConfirm}</span>}
            </label>

            {formError && (
              <p className="text-sm text-accent-red" role="alert">
                {formError}
              </p>
            )}

            <Button size="lg" className="mt-2" type="submit" disabled={isSubmitting}>
              {isSubmitting ? '가입 중...' : '회원가입'}
            </Button>
          </form>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-border text-sm">
            <span className="text-muted">이미 계정이 있나요?</span>
            <Link className="inline-flex min-h-11 items-center rounded-input font-semibold text-ink-2 underline decoration-rule-2 underline-offset-4 hover:text-foreground hover:decoration-current focus-visible:outline-focus active:opacity-65" href={viewModel.loginLink.href}>
              {viewModel.loginLink.label}
            </Link>
          </div>
        </Card>
      </main>
    </AppFrame>
  );
}
