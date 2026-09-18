import Link from 'next/link';

/**
 * 비로그인 사용자에게 플랫폼의 주요 서비스를 소개하는 섹션입니다.
 *
 * @returns 비회원 랜딩 섹션
 */
export function GuestLandingSection() {
  return (
    <section className="grid gap-3 rounded-3xl border border-border bg-surface p-5" aria-labelledby="guest-landing-title">
      <p className="text-sm font-bold text-primary">choimory.dev 시작하기</p>
      <h2 id="guest-landing-title" className="text-xl font-bold leading-tight">
        blog, memo, feed를 한 곳에서 사용하세요
      </h2>
      <p className="text-sm leading-6 text-muted">
        비회원은 서비스를 둘러볼 수 있고, 로그인하면 메모 저장, 개인 피드, 알림 설정을 이어서 사용할 수 있습니다.
      </p>
      <div className="flex flex-wrap gap-2">
        <Link className="grid h-10 place-items-center rounded-[10px] bg-primary px-4 text-sm font-bold text-primary-foreground" href="/login">
          로그인
        </Link>
        <Link className="grid h-10 place-items-center rounded-[10px] bg-surface-strong px-4 text-sm font-bold text-foreground" href="/signup">
          회원가입
        </Link>
      </div>
    </section>
  );
}
