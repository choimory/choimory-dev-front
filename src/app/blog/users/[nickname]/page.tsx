import { redirect } from 'next/navigation';

/**
 * 유저 blog 호환 라우트 Props입니다.
 */
type BlogUserPageProps = {
  params: Promise<{ nickname: string }>; // URL path params
};

/**
 * 기존 유저 blog 주소를 새 공개 주소로 이동합니다.
 *
 * @param props 화면 Props
 * @returns 새 유저 blog 주소로 이동
 */
export default async function BlogUserPage({ params }: BlogUserPageProps) {
  const { nickname } = await params;

  redirect(`/blog/${nickname}`);
}
