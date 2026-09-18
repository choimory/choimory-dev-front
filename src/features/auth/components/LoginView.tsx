import Link from 'next/link';

import { AppFrame } from '@/shared/ui/AppFrame';
import { BrandLogo } from '@/shared/ui/BrandLogo';

import type { LoginViewModel } from '../model/authTypes';

/**
 * 로그인 화면 컴포넌트의 Props
 */
type LoginViewProps = {
  viewModel: LoginViewModel; // 로그인 화면 데이터
};

/** 소셜 로그인 버튼 색상 클래스 */
const SOCIAL_LOGIN_BUTTON_CLASS_NAME: Record<LoginViewModel['socialProviders'][number]['id'], string> = {
  naver: 'border-[#03c75a] bg-[#03c75a] text-white',
  kakao: 'border-[#fee500] bg-[#fee500] text-[#191919]',
  google: 'border-border bg-surface-strong text-foreground',
};

/**
 * 로그인 폼을 표시하는 화면입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 로그인 화면
 */
export function LoginView({ viewModel }: LoginViewProps) {
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

            <button className="mt-2 h-12 rounded-[12px] bg-primary text-sm font-bold text-primary-foreground" type="button">
              로그인
            </button>
          </form>

          <div className="mt-4 grid gap-3">
            <Link className="grid h-12 place-items-center rounded-[12px] border border-border bg-surface text-sm font-bold text-foreground transition hover:bg-surface-strong" href={viewModel.signupLink.href}>
              {viewModel.signupLink.label}
            </Link>
          </div>

          <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-xs text-muted">
            <span className="h-px bg-border" />
            <span>또는</span>
            <span className="h-px bg-border" />
          </div>

          <div className="grid gap-2">
            {viewModel.socialProviders.map((provider) => (
              <button
                key={provider.id}
                className={`h-11 rounded-[12px] border px-4 text-sm font-bold ${SOCIAL_LOGIN_BUTTON_CLASS_NAME[provider.id]}`}
                type="button"
              >
                {provider.label}
              </button>
            ))}
          </div>

          <p className="mt-5 text-center text-xs leading-5 text-muted">
            아직 실제 소셜 로그인 연동 전이며, 버튼은 화면 구성 확인용입니다.
          </p>
        </section>
      </main>
    </AppFrame>
  );
}
