import Link from 'next/link';
import { getAllPosts, CATEGORY_MAP } from '@/lib/posts';
import { PostCard } from '@/components/PostCard';
import { AdBanner } from '@/components/AdBanner';
import { SITE_DESCRIPTION, SITE_TAGLINE } from '@/lib/seo';

const CATEGORY_EMOJI: Record<string, string> = {
  'writing-ai': '✍️',
  'image-ai': '🎨',
  'video-ai': '🎬',
  'code-ai': '💻',
  'productivity-ai': '⚡',
  'open-source-ai': '🔓',
};

export default function HomePage() {
  const posts = getAllPosts();
  const recent = posts.slice(0, 6);
  const featured = posts[0];

  const categories = Object.keys(CATEGORY_MAP);

  // 태그 빈도
  const tagCounts: Record<string, number> = {};
  posts.forEach((p) => p.tags.forEach((t) => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);
  const maxCount = topTags[0]?.[1] ?? 1;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* ── 히어로 ── */}
      <section className="relative text-center py-20 mb-4 overflow-hidden rounded-3xl"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>

        <div style={{ position: 'absolute', top: -80, left: -80, width: 400, height: 400, background: 'radial-gradient(ellipse, rgba(245,158,11,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, right: -60, width: 350, height: 350, background: 'radial-gradient(ellipse, rgba(245,158,11,0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />

        <div className="relative">
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full text-xs font-bold"
            style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.35)', color: 'var(--accent-amber)' }}>
            <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent-amber)' }} />
            AI 도구 비교 & 직접 검증 블로그
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight" style={{ color: 'var(--text-primary)' }}>
            <span style={{ color: 'var(--accent-amber)' }}>AI Scout</span>
          </h1>
          <p className="text-base md:text-lg font-semibold mb-3" style={{ color: 'var(--accent-amber-light)' }}>
            {SITE_TAGLINE}
          </p>
          <p className="text-sm md:text-base max-w-xl mx-auto mb-8" style={{ color: 'var(--text-secondary)', lineHeight: 1.9 }}>
            {SITE_DESCRIPTION}
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <Link href="/blog"
              style={{ background: 'var(--accent-amber)', borderRadius: 10, padding: '10px 28px', color: '#0a0a0f', fontWeight: 700, fontSize: 14 }}
              className="hover:opacity-90 transition-opacity">
              전체 리뷰 보기
            </Link>
            <Link href="/category/writing-ai"
              style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.35)', borderRadius: 10, padding: '10px 28px', color: 'var(--accent-amber)', fontWeight: 600, fontSize: 14 }}
              className="hover:opacity-80 transition-opacity">
              글쓰기 AI 비교 →
            </Link>
          </div>

          <div className="flex justify-center gap-4 flex-wrap">
            {[
              { value: posts.length, label: '리뷰', suffix: '개' },
              { value: categories.length, label: '카테고리', suffix: '개' },
            ].map(({ value, label, suffix }) => (
              <div key={label} className="text-center px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', minWidth: 56 }}>
                <div className="font-bold tabular-nums" style={{ color: 'var(--accent-amber)', fontSize: 15 }}>
                  {value}{suffix}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 10 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AdBanner slot="1234567890" format="horizontal" className="my-10" />

      {/* ── 카테고리 카드 ── */}
      <section className="mb-14">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--accent-amber)' }}>
          카테고리
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(CATEGORY_MAP).map(([slug, { name, description }]) => {
            const count = posts.filter((p) => p.category === slug).length;
            const emoji = CATEGORY_EMOJI[slug] ?? '🤖';
            return (
              <Link key={slug} href={`/category/${slug}`}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px', transition: 'all 0.25s', display: 'block' }}
                className="hover:-translate-y-1 group">
                <div className="text-2xl mb-3">{emoji}</div>
                <div className="font-bold text-sm mb-1 transition-colors" style={{ color: 'var(--text-primary)' }}>{name}</div>
                <div className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{description}</div>
                <div className="text-xs font-semibold" style={{ color: 'var(--accent-amber)' }}>{count}개 →</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── 주요 포스트 ── */}
      {featured && (
        <section className="mb-14">
          <h2 className="text-lg font-bold mb-5 flex items-center gap-2" style={{ color: 'var(--accent-amber)' }}>
            추천 리뷰
          </h2>
          <Link href={`/blog/${featured.slug}`} className="block group">
            <article style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', transition: 'border-color 0.2s' }}
              className="md:flex hover:opacity-90">
              {featured.coverImage && (
                <div className="md:w-2/5 h-56 md:h-auto overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={featured.coverImage} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              )}
              <div className="p-8 flex flex-col justify-center">
                <div className="flex gap-2 mb-3 flex-wrap">
                  <span style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--accent-amber)', borderRadius: 20, padding: '3px 12px', fontSize: 13 }}>
                    {CATEGORY_MAP[featured.category]?.name ?? featured.category}
                  </span>
                  {featured.rating && (
                    <span style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--accent-green)', borderRadius: 20, padding: '3px 12px', fontSize: 13 }}>
                      ★ {featured.rating}/5
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{featured.title}</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{featured.summary}</p>
                <span style={{ color: 'var(--accent-amber)', fontSize: 14, fontWeight: 600 }}>자세히 보기 →</span>
              </div>
            </article>
          </Link>
        </section>
      )}

      {/* ── 최신 리뷰 ── */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--accent-amber)' }}>
            최신 리뷰
          </h2>
          {posts.length > 6 && (
            <Link href="/blog" style={{ color: 'var(--text-secondary)', fontSize: 14 }} className="hover:opacity-80">
              전체 보기 →
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recent.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* ── 인기 태그 ── */}
      {topTags.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-5 flex items-center gap-2" style={{ color: 'var(--accent-amber)' }}>
            인기 태그
          </h2>
          <div className="flex flex-wrap gap-2">
            {topTags.map(([tag, count]) => {
              const ratio = count / maxCount;
              const fontSize = Math.round(11 + ratio * 5);
              const opacity = 0.5 + ratio * 0.5;
              return (
                <Link key={tag} href={`/tag/${encodeURIComponent(tag)}`}
                  style={{
                    background: `rgba(245,158,11,${0.05 + ratio * 0.1})`,
                    border: `1px solid rgba(245,158,11,${0.15 + ratio * 0.25})`,
                    borderRadius: 20,
                    padding: `4px ${Math.round(10 + ratio * 4)}px`,
                    color: `rgba(245,158,11,${opacity})`,
                    fontSize,
                  }}
                  className="hover:opacity-80 transition-opacity">
                  #{tag}
                  {count > 1 && <span className="ml-1 text-[10px] opacity-60">{count}</span>}
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
