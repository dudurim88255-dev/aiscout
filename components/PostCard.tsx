import Link from 'next/link';
import { PostMeta } from '@/lib/posts';

const CATEGORY_EMOJI: Record<string, string> = {
  'writing-ai': '✍️',
  'image-ai': '🎨',
  'video-ai': '🎬',
  'code-ai': '💻',
  'productivity-ai': '⚡',
  'open-source-ai': '🔓',
};

interface Props {
  post: PostMeta;
}

export function PostCard({ post }: Props) {
  const catEmoji = CATEGORY_EMOJI[post.category] ?? '🤖';

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article
        style={{ borderRadius: 16, transition: 'border-color 0.2s, transform 0.2s' }}
        className="glass-card h-full overflow-hidden group-hover:-translate-y-1"
      >
        {post.coverImage && (
          <div className="w-full h-44 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
        )}
        <div className="p-5">
          {/* 카테고리 + 평점 */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span style={{ background: 'rgba(245,158,11,0.08)', color: 'var(--accent-amber)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 20, padding: '2px 10px', fontSize: 12 }}>
              {catEmoji} {post.category}
            </span>
            {post.rating && (
              <span style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--accent-green)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 20, padding: '2px 10px', fontSize: 12 }}>
                ★ {post.rating}/5
              </span>
            )}
          </div>

          {/* 제목 */}
          <h2 className="font-bold text-base mb-2 leading-snug" style={{ color: 'var(--text-primary)' }}>
            {post.title}
          </h2>

          {/* 요약 */}
          <p className="text-sm line-clamp-3 mb-4" style={{ color: 'var(--text-secondary)' }}>
            {post.summary}
          </p>

          {/* 도구 태그 */}
          {post.tools.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {post.tools.slice(0, 3).map(tool => (
                <span key={tool} style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', borderRadius: 4, padding: '1px 6px', fontSize: 11 }}>
                  {tool}
                </span>
              ))}
            </div>
          )}

          {/* 날짜 */}
          <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span>{post.date}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
