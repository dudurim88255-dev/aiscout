import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/posts';
import { PostCard } from '@/components/PostCard';
import { buildPostMetadata, buildArticleJsonLd, buildBreadcrumbJsonLd, SITE_URL, SITE_NAME } from '@/lib/seo';
import { PaperMetadata } from '@/components/PaperMetadata';
import { TableOfContents } from '@/components/TableOfContents';
import { AdBanner } from '@/components/AdBanner';
import { ShareButtons } from '@/components/ShareButtons';
import { ReadingProgress } from '@/components/ReadingProgress';
import { ContentToggle } from '@/components/ContentToggle';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return buildPostMetadata(post);
}

const DIFFICULTY_CONFIG = {
  '입문': { color: '#4fd1c5', emoji: '🟢' },
  '중급': { color: '#f6c90e', emoji: '🟡' },
  '심화': { color: '#f87171', emoji: '🔴' },
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const diff = DIFFICULTY_CONFIG[post.difficulty] ?? DIFFICULTY_CONFIG['입문'];
  const relatedPosts = getRelatedPosts(post.slug);
  const articleJsonLd = buildArticleJsonLd(post);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: SITE_NAME, url: SITE_URL },
    { name: post.category, url: `${SITE_URL}/category/${post.category}` },
    { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
  ]);

  const postUrl = `${SITE_URL}/blog/${post.slug}`;

  return (
    <>
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* 브레드크럼 */}
        <nav className="text-sm mb-6 flex items-center gap-2" style={{ color: '#8b96b0' }}>
          <Link href="/" className="hover:text-[#4fd1c5]">홈</Link>
          <span>/</span>
          <Link href={`/category/${post.category}`} className="hover:text-[#4fd1c5]">{post.category}</Link>
          <span>/</span>
          <span style={{ color: '#c5d8f0' }} className="truncate max-w-xs">{post.title}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-[1fr_240px] gap-12">
          {/* 본문 */}
          <article>
            {/* 헤더 */}
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span style={{ background: 'rgba(79,209,197,0.1)', color: '#4fd1c5', border: '1px solid rgba(79,209,197,0.2)', borderRadius: 20, padding: '3px 12px', fontSize: 13 }}>
                  {post.category}
                </span>
                <span style={{ color: diff.color, background: `${diff.color}15`, border: `1px solid ${diff.color}40`, borderRadius: 20, padding: '3px 12px', fontSize: 13 }}>
                  {diff.emoji} {post.difficulty}
                </span>
                {post.journal && (
                  <span style={{ background: 'rgba(124,58,237,0.1)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 20, padding: '3px 12px', fontSize: 13 }}>
                    {post.journal}
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-4 leading-snug" style={{ color: '#e8edf5' }}>
                {post.title}
              </h1>
              <p className="text-base mb-5" style={{ color: '#8b96b0', lineHeight: 1.8 }}>{post.summary}</p>
              <div className="flex items-center gap-4 text-sm" style={{ color: '#4a5568' }}>
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readingTime}</span>
              </div>

              {/* 논문 메타 */}
              <PaperMetadata doi={post.paperDOI} journal={post.journal} date={post.date} />

              {/* 커버 이미지 */}
              {post.coverImage && (
                <div className="rounded-xl overflow-hidden mt-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.coverImage} alt={post.title} className="w-full" />
                </div>
              )}
            </header>

            <AdBanner slot="2345678901" className="mb-8" />

            {/* MDX 본문 (전문가/쉬운 버전 토글) */}
            <ContentToggle
              expertContent={
                <div className="prose">
                  <MDXRemote source={post.content} />
                </div>
              }
              easyContent={
                post.easyBody ? (
                  <div className="prose">
                    <MDXRemote source={post.easyBody} />
                  </div>
                ) : null
              }
            />

            <AdBanner slot="3456789012" className="mt-10" />

            {/* 태그 */}
            {post.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link key={tag} href={`/tag/${encodeURIComponent(tag)}`}
                    style={{ background: '#131a2e', border: '1px solid #1e2a42', borderRadius: 6, padding: '4px 10px', fontSize: 12, color: '#8b96b0' }}
                    className="hover:border-[#4fd1c5] hover:text-[#4fd1c5] transition-colors">
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* 공유 버튼 */}
            <ShareButtons title={post.title} url={postUrl} />
          </article>

          {/* 사이드바 목차 */}
          <aside className="hidden lg:block">
            <TableOfContents />
          </aside>
        </div>

        {/* 관련 포스트 */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-10" style={{ borderTop: '1px solid #1e2a42' }}>
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: '#4fd1c5' }}>
              <span>📚</span> 관련 논문
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
