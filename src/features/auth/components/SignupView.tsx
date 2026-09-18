import Link from 'next/link';

import { AppFrame } from '@/shared/ui/AppFrame';
import { BrandLogo } from '@/shared/ui/BrandLogo';

import type { SignupViewModel } from '../model/authTypes';

/**
 * 회원가입 화면 컴포넌트의 Props
 */
type SignupViewProps = {
  viewModel: SignupViewModel; // 회원가입 화면 데이터
};

/**
 * 회원가입 폼을 표시하는 화면입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 회원가입 화면
 */
export function SignupView({ viewModel }: SignupViewProps) {
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

          <form className="mt-7 grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-foreground">
              닉네임
              <input
                className="h-12 rounded-[12px] border border-border bg-surface-strong px-4 text-base text-foreground outline-none transition focus:border-primary"
                name="nickname"
                placeholder="mory"
                type="text"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-foreground">
              이메일
              <input
                className="h-12 rounded-[12px] border border-border bg-surface-strong px-4 text-base text-foreground outline-none transition focus:border-primary"
                name="email"
                placeholder="you@example.com"
                type="email"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-foreground">
              비밀번호
              <input
                className="h-12 rounded-[12px] border border-border bg-surface-strong px-4 text-base text-foreground outline-none transition focus:border-primary"
                name="password"
                placeholder="비밀번호"
                type="password"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-foreground">
              비밀번호 확인
              <input
                className="h-12 rounded-[12px] border border-border bg-surface-strong px-4 text-base text-foreground outline-none transition focus:border-primary"
                name="passwordConfirm"
                placeholder="비밀번호 확인"
                type="password"
              />
            </label>

            <button className="mt-2 h-12 rounded-[12px] bg-primary text-sm font-bold text-primary-foreground" type="button">
              회원가입
            </button>
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
