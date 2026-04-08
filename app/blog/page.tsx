import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/posts';
import { CATEGORY_MAP } from '@/lib/categories';
import { PostCard } from '@/components/PostCard';
import { SITE_NAME, SITE_URL } from '@/lib/seo';
import Link from 'next/link';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: '전체 AI 도구 리뷰',
  description: 'ChatGPT, Claude, Gemini 등 AI 도구 리뷰·비교·가이드 모음',
  openGraph: {
    title: `전체 AI 도구 리뷰 | ${SITE_NAME}`,
    url: `${SITE_URL}/blog`,
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* 헤더 */}
      <div className="mb-8">
        <nav className="text-sm mb-4 flex items-center gap-2" style={{ color: '#8b96b0' }}>
          <Link href="/" className="hover:text-[#4fd1c5]">홈</Link>
          <span>/</span>
          <span style={{ color: '#c5d8f0' }}>전체 논문</span>
        </nav>
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#e8edf5' }}>
          🔬 전체 논문 해설
        </h1>
        <p style={{ color: '#8b96b0', fontSize: 14 }}>
          총 {posts.length}편의 최신 생명과학 논문 해설
        </p>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/blog"
          style={{ background: 'rgba(79,209,197,0.15)', color: '#4fd1c5', border: '1px solid rgba(79,209,197,0.4)', borderRadius: 20, padding: '5px 14px', fontSize: 13 }}
        >
          전체 ({posts.length})
        </Link>
        {Object.entries(CATEGORY_MAP).map(([slug, { name }]) => {
          const count = posts.filter((p) => p.category === slug).length;
          if (count === 0) return null;
          return (
            <Link
              key={slug}
              href={`/category/${slug}`}
              style={{ background: '#131a2e', border: '1px solid #1e2a42', borderRadius: 20, padding: '5px 14px', color: '#8b96b0', fontSize: 13 }}
              className="hover:border-[#4fd1c5] hover:text-[#4fd1c5] transition-colors"
            >
              {name} ({count})
            </Link>
          );
        })}
      </div>

      {/* 포스트 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
