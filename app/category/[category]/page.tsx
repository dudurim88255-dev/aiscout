import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPostsByCategory, CATEGORY_MAP, getAllPosts } from '@/lib/posts';
import { PostCard } from '@/components/PostCard';
import { SITE_NAME } from '@/lib/seo';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const info = CATEGORY_MAP[category];
  if (!info) return {};
  return {
    title: `${info.name} 도구 비교·리뷰 모음 | AI Scout`,
    description: `${info.name} 카테고리의 AI 도구 리뷰와 비교 분석입니다. ${info.description ?? ''} 직접 써보고 가격·기능·한국어 지원을 정리했습니다.`,
    alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/category/${category}` },
    openGraph: {
      title: `${info.name} AI 도구 비교·리뷰 | AI Scout`,
      description: `${info.name} 분야 AI 도구를 직접 써보고 비교 분석합니다.`,
      locale: 'ko_KR',
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const info = CATEGORY_MAP[category];
  if (!info) notFound();

  const posts = getPostsByCategory(category);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-10">
        <p className="text-sm mb-2" style={{ color: '#8b96b0' }}>
          {SITE_NAME} / 카테고리
        </p>
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#e8edf5' }}>
          {info.name}
        </h1>
        <p style={{ color: '#8b96b0' }}>{info.description}</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20" style={{ color: '#8b96b0' }}>
          <div className="text-4xl mb-4">📭</div>
          <p>아직 이 카테고리에 포스트가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
