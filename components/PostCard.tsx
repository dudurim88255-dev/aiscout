import Link from 'next/link';
import { PostMeta } from '@/lib/posts';
import { buildOgImageUrl } from '@/lib/seo';

const POST_TYPE_LABELS: Record<string, string> = {
  NEW_TOOL_REVIEW: '신규 리뷰',
  VS_COMPARISON: 'VS 비교',
  PRICING_GUIDE: '가격 가이드',
  UPDATE_SUMMARY: '업데이트',
  HOW_TO_GUIDE: '활용법',
};

const POST_TYPE_COLORS: Record<string, string> = {
  NEW_TOOL_REVIEW: '#10b981',
  VS_COMPARISON: '#f59e0b',
  PRICING_GUIDE: '#3b82f6',
  UPDATE_SUMMARY: '#8b5cf6',
  HOW_TO_GUIDE: '#64748b',
};

export function PostCard({ post }: { post: PostMeta }) {
  const typeColor = POST_TYPE_COLORS[post.postType] ?? '#64748b';
  const typeLabel = POST_TYPE_LABELS[post.postType] ?? post.postType;
  const thumbnail = post.coverImage || buildOgImageUrl(post);

  return (
    <Link href={`/blog/${post.slug}`}
      className="block glass-card rounded-xl overflow-hidden hover:opacity-90 transition-opacity">
      {/* 썸네일 */}
      <div className="relative w-full overflow-hidden" style={{ height: '160px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnail}
          alt={post.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 40%, rgba(10,10,15,0.85) 100%)',
        }} />
        <span style={{
          position: 'absolute', bottom: 10, left: 12,
          fontSize: 12, fontWeight: 600, color: typeColor,
          background: `${typeColor}22`, borderRadius: 20,
          padding: '3px 10px', backdropFilter: 'blur(4px)',
        }}>
          {typeLabel}
        </span>
      </div>

      {/* 텍스트 */}
      <div className="p-4">
        <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{post.lastUpdated}</div>
        <h3 className="font-bold mb-2 line-clamp-2 text-sm leading-snug" style={{ color: 'var(--text-primary)' }}>
          {post.title}
        </h3>
        <p className="text-xs line-clamp-2 mb-3" style={{ color: 'var(--text-secondary)' }}>
          {post.summary}
        </p>
        {post.tools.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tools.slice(0, 4).map(tool => (
              <span key={tool} className="text-xs px-2 py-0.5 rounded"
                style={{ background: 'var(--bg-secondary)', color: 'var(--accent-amber)' }}>
                {tool}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export default PostCard;
