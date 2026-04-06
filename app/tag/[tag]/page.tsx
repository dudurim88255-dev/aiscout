import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPostsByTag, getAllTags } from '@/lib/posts';
import { PostCard } from '@/components/PostCard';
import { SITE_NAME, SITE_URL } from '@/lib/seo';
import Link from 'next/link';

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  return getAllTags().map((tag: string) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `#${decoded} 태그 논문 해설 | ${SITE_NAME}`,
    description: `'${decoded}' 태그가 붙은 최신 생명과학 논문 해설 모음`,
    openGraph: { url: `${SITE_URL}/tag/${tag}` },
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = getPostsByTag(decoded);

  if (posts.length === 0) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-10">
        <nav className="text-sm mb-4 flex items-center gap-2" style={{ color: '#8b96b0' }}>
          <Link href="/" className="hover:text-[#4fd1c5]">홈</Link>
          <span>/</span>
          <span style={{ color: '#c5d8f0' }}>태그</span>
          <span>/</span>
          <span style={{ color: '#c5d8f0' }}>#{decoded}</span>
        </nav>
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#e8edf5' }}>
          <span style={{ color: '#4fd1c5' }}>#</span>{decoded}
        </h1>
        <p style={{ color: '#8b96b0', fontSize: 14 }}>태그 관련 논문 해설 {posts.length}편</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
