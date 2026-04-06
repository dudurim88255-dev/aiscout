import Link from 'next/link';
import { PostMeta } from '@/lib/posts';

const POST_TYPE_LABELS: Record<string, string> = {
  NEW_TOOL_REVIEW: '신규 리뷰',
  VS_COMPARISON: 'VS 비교',
  PRICING_GUIDE: '가격 가이드',
  UPDATE_SUMMARY: '업데이트',
  HOW_TO_GUIDE: '활용법',
};

const POST_TYPE_COLORS: Record<string, { color: string; bg: string }> = {
  NEW_TOOL_REVIEW: { color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  VS_COMPARISON:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  PRICING_GUIDE:   { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  UPDATE_SUMMARY:  { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  HOW_TO_GUIDE:    { color: '#64748b', bg: 'rgba(100,116,139,0.1)' },
};

export function PostCard({ post }: { post: PostMeta }) {
  const type = POST_TYPE_COLORS[post.postType] ?? POST_TYPE_COLORS.HOW_TO_GUIDE;
  const typeLabel = POST_TYPE_LABELS[post.postType] ?? post.postType;

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article
        className="glass-card h-full overflow-hidden group-hover:-translate-y-1"
        style={{ borderRadius: 16, transition: 'border-color 0.2s, transform 0.2s' }}
      >
        <div className="p-5">
          {/* 타입 + 카테고리 배지 */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span style={{
              background: type.bg, color: type.color,
              border: `1px solid ${type.color}40`,
              borderRadius: 20, padding: '2px 10px', fontSize: 12,
            }}>
              {typeLabel}
            </span>
            {post.category && (
              <span style={{
                background: 'rgba(245,158,11,0.08)', color: 'var(--accent-amber)',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: 20, padding: '2px 10px', fontSize: 12,
              }}>
                {post.category}
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

          {/* 날짜 */}
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {post.lastUpdated}
          </div>
        </div>
      </article>
    </Link>
  );
}

export default PostCard;
