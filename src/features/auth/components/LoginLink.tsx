'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps } from 'react';

import { buildLoginHref } from '@/shared/auth/redirect';

/**
 * 로그인 링크 컴포넌트의 Props. `href`는 현재 경로로 자동 결정됩니다.
 */
type LoginLinkProps = Omit<ComponentProps<typeof Link>, 'href'>;

/**
 * 로그인 화면으로 이동하는 링크입니다. 로그인한 뒤 지금 보고 있는 페이지로 돌아오도록 `next`를 붙입니다.
 *
 * @param props Link와 같은 Props (href 제외)
 * @returns 로그인 링크
 */
export function LoginLink(props: LoginLinkProps) {
  const pathname = usePathname();

  return <Link {...props} href={buildLoginHref(pathname ?? '/')} />;
}
