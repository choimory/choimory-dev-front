import { redirect } from 'next/navigation';

/**
 * 내 blog 호환 라우팅 진입점입니다.
 *
 * @returns 유저 blog 화면으로 이동
 */
export default function BlogMePage() {
  redirect('/blog/users/mory.dev');
}
