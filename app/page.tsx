import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import AdBanner from '@/components/AdBanner';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'AI Scout — AI 도구 비교·리뷰·사용법 총정리',
  description: 'ChatGPT, Claude, Gemini, Midjourney 등 인기 AI 도구를 직접 써보고 비교했습니다. 가격·한국어 지원·기능까지 솔직하게 정리합니다.',
  path: '/',
  keywords: ['AI 도구 비교', 'AI 추천', 'ChatGPT 리뷰', 'Claude 사용법', 'Gemini 비교', 'AI 도구 순위'],
});

const CATEGORIES = [
  { slug: 'writing-ai', label: '글쓰기 AI', icon: '✍️', desc: 'ChatGPT, Claude, Gemini' },
  { slug: 'image-ai', label: '이미지 AI', icon: '🎨', desc: 'Midjourney, DALL-E, Stable Diffusion' },
  { slug: 'video-ai', label: '영상 AI', icon: '🎬', desc: 'Sora, Runway, Kling' },
  { slug: 'code-ai', label: '코딩 AI', icon: '💻', desc: 'Cursor, Copilot, Replit' },
  { slug: 'productivity-ai', label: '생산성 AI', icon: '⚡', desc: 'Notion AI, Perplexity, Otter' },
  { slug: 'open-source-ai', label: '오픈소스 AI', icon: '🔓', desc: 'Llama, Mistral, Stable Diffusion' },
];

export default function HomePage() {
  const allPosts = getAllPosts();
  const latestPosts = allPosts.slice(0, 6);
  const vsPosts = allPosts.filter(p => p.postType === 'VS_COMPARISON').slice(0, 3);
  const countByCategory = allPosts.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* 히어로 */}
      <section className="text-center py-12 mb-10">
        <div className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
          style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
          AI 도구 탐색대
        </div>
        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          AI 도구,{' '}
          <span style={{ color: 'var(--accent-amber)' }}>먼저 찾고</span>{' '}
          직접 검증했습니다
        </h1>
        <p className="text-lg max-w-xl mx-auto mb-6" style={{ color: 'var(--text-secondary)' }}>
          ChatGPT, Claude, Midjourney 등 인기 AI 도구를 솔직하게 비교합니다.
          가격, 기능, 한국어 지원까지 — 직접 써보고 정리했습니다.
        </p>
        <div className="flex items-center justify-center gap-3 text-sm">
          <span className="px-3 py-1 rounded-full font-semibold"
            style={{ background: 'rgba(245,158,11,0.12)', color: 'var(--accent-amber)', border: '1px solid rgba(245,158,11,0.25)' }}>
            리뷰 {allPosts.length}개
          </span>
          <span style={{ color: 'var(--text-muted)' }}>매일 자동 업데이트</span>
        </div>
      </section>

      {/* 카테고리 */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>카테고리</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {CATEGORIES.map(cat => (
            <Link key={cat.slug} href={`/category/${cat.slug}`}
              className="glass-card rounded-xl p-4 hover:opacity-90 transition-opacity">
              <div className="text-2xl mb-2">{cat.icon}</div>
              <div className="flex items-center justify-between mb-1">
                <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  {cat.label}
                </div>
                {(countByCategory[cat.slug] ?? 0) > 0 && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(245,158,11,0.12)', color: 'var(--accent-amber)' }}>
                    {countByCategory[cat.slug]}개
                  </span>
                )}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{cat.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      <AdBanner slot="1234567890" />

      {/* 인기 비교 글 */}
      {vsPosts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            🔥 인기 비교 분석
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vsPosts.map(post => <PostCard key={post.slug} post={post} />)}
          </div>
        </section>
      )}

      {/* 최신 글 */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>최신 글</h2>
        {latestPosts.length === 0 ? (
          <p className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>
            자동화가 실행되면 글이 생성됩니다.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestPosts.map(post => <PostCard key={post.slug} post={post} />)}
          </div>
        )}
      </section>

      <AdBanner slot="0987654321" />
    </div>
  );
}
