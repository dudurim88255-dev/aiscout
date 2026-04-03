import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/posts';
import { PostCard } from '@/components/PostCard';
import { buildPostMetadata, buildArticleJsonLd, buildBreadcrumbJsonLd, SITE_URL, SITE_NAME } from '@/lib/seo';
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
  const result = getPostBySlug(slug);
  if (!result) return {};
  return buildPostMetadata(result.meta);
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const result = getPostBySlug(slug);
  if (!result) notFound();

  const { meta: post, content } = result;
  const relatedPosts = getRelatedPosts(post.slug, post.category);
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
        <nav className="text-sm mb-6 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
          <Link href="/" className="hover:opacity-80">홈</Link>
          <span>/</span>
          <Link href={`/category/${post.category}`} className="hover:opacity-80">{post.category}</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)' }} className="truncate max-w-xs">{post.title}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-[1fr_240px] gap-12">
          {/* 본문 */}
          <article>
            {/* 헤더 */}
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--accent-amber)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 20, padding: '3px 12px', fontSize: 13 }}>
                  {post.category}
                </span>
                <span style={{ background: 'rgba(245,158,11,0.05)', color: 'var(--accent-amber-light)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 20, padding: '3px 12px', fontSize: 13 }}>
                  {post.postType.replace(/_/g, ' ')}
                </span>
                {post.rating && (
                  <span style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--accent-green)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 20, padding: '3px 12px', fontSize: 13 }}>
                    ★ {post.rating}/5
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-4 leading-snug" style={{ color: 'var(--text-primary)' }}>
                {post.title}
              </h1>
              <p className="text-base mb-5" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{post.summary}</p>
              <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span>{post.date}</span>
                {post.lastUpdated !== post.date && (
                  <>
                    <span>·</span>
                    <span>최종 수정: {post.lastUpdated}</span>
                  </>
                )}
              </div>

              {/* 커버 이미지 */}
              {post.coverImage && (
                <div className="rounded-xl overflow-hidden mt-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.coverImage} alt={post.title} className="w-full" />
                </div>
              )}
            </header>

            <AdBanner slot="2345678901" className="mb-8" />

            {/* MDX 본문 */}
            <ContentToggle
              expertContent={
                <div className="prose">
                  <MDXRemote source={content} />
                </div>
              }
              easyContent={null}
            />

            <AdBanner slot="3456789012" className="mt-10" />

            {/* 태그 */}
            {post.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <Link key={tag} href={`/tag/${encodeURIComponent(tag)}`}
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 10px', fontSize: 12, color: 'var(--text-secondary)' }}
                    className="hover:opacity-80 transition-opacity">
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
          <section className="mt-16 pt-10" style={{ borderTop: '1px solid var(--border)' }}>
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--accent-amber)' }}>
              관련 도구 리뷰
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
