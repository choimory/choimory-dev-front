import { BlogUserBlogContainer } from '@/features/blog/container/BlogUserBlogContainer';

/**
 * 공개 유저 blog 화면 Props입니다.
 */
type BlogNicknamePageProps = {
  params: Promise<{ nickname: string }>; // URL path params
};

/**
 * 공개 유저 blog 화면의 라우팅 진입점입니다.
 *
 * @param props 화면 Props
 * @returns 공개 유저 blog 화면
 */
export default async function BlogNicknamePage({ params }: BlogNicknamePageProps) {
  const { nickname } = await params;

  return <BlogUserBlogContainer nickname={decodeURIComponent(nickname)} />;
}
