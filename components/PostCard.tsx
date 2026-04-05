import Link from 'next/link';
import Image from 'next/image';
import { PostMeta } from '@/lib/posts';

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

const DEFAULT_THUMBNAIL = '/bg.png';

// named export와 default export 모두 지원 (기존 import 호환)
export function PostCard({ post }: { post: PostMeta }) {
  const typeColor = POST_TYPE_COLORS[post.postType] ?? '#64748b';
  const typeLabel = POST_TYPE_LABELS[post.postType] ?? post.postType;
  const thumbnail = post.coverImage || DEFAULT_THUMBNAIL;

  return (
    <Link href={`/blog/${post.slug}`}
      className="block glass-card rounded-xl overflow-hidden hover:opacity-90 transition-opacity">
      {/* 썸네일 */}
      <div className="relative w-full h-40 overflow-hidden">
        <Image
          src={thumbnail}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(10,10,15,0.85) 100%)' }} />
        <span className="absolute bottom-3 left-3 text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: `${typeColor}22`, color: typeColor, backdropFilter: 'blur(4px)' }}>
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
