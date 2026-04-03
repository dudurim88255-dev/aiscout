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
    title: `${info.name} 논문 해설`,
    description: `${info.description} 관련 최신 논문을 쉽게 풀어 설명합니다.`,
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
