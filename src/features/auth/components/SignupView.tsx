import type { FormEvent } from 'react';
import Link from 'next/link';

import { AppFrame } from '@/shared/ui/AppFrame';
import { BrandLogo } from '@/shared/ui/BrandLogo';
import { Button } from '@/shared/ui/Button';

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
  'h-12 rounded-[12px] border border-border bg-surface-strong px-4 text-base text-foreground outline-none transition focus:border-primary';

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
      <main className="mx-auto grid min-h-dvh w-full max-w-[440px] content-center px-5 py-12">
        <section className="rounded-3xl border border-border bg-surface p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
          <Link className="inline-flex" href="/" aria-label="choimory.dev 홈">
            <BrandLogo size="md" />
          </Link>

          <div className="mt-8">
            <h1 className="text-2xl font-bold tracking-normal text-foreground">{viewModel.title}</h1>
            <p className="mt-2 text-sm leading-6 text-muted">{viewModel.description}</p>
          </div>

          <form className="mt-7 grid gap-4" onSubmit={onSubmit}>
            <label className="grid gap-2 text-sm font-medium text-foreground">
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

            <label className="grid gap-2 text-sm font-medium text-foreground">
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

            <label className="grid gap-2 text-sm font-medium text-foreground">
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

            <label className="grid gap-2 text-sm font-medium text-foreground">
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

          <div className="mt-5 flex items-center justify-between gap-3 text-sm">
            <span className="text-muted">이미 계정이 있나요?</span>
            <Link className="font-bold text-primary" href={viewModel.loginLink.href}>
              {viewModel.loginLink.label}
            </Link>
          </div>
        </section>
      </main>
    </AppFrame>
  );
}
