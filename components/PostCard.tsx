import Link from 'next/link';
import { PostMeta } from '@/lib/posts';

const POST_TYPE_LABELS: Record<string, string> = {
  NEW_TOOL_REVIEW: '신규 리뷰',
  VS_COMPARISON: 'VS 비교',
  PRICING_GUIDE: '가격 가이드',
  UPDATE_SUMMARY: '업데이트',
  HOW_TO_GUIDE: '활용법',
};

export function PostCard({ post }: { post: PostMeta }) {
  const typeLabel = POST_TYPE_LABELS[post.postType] ?? post.postType;

  return (
    <Link href={`/blog/${post.slug}`}
      className="block py-4 border-b hover:opacity-70 transition-opacity"
      style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{post.lastUpdated}</span>
        <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--bg-secondary)', color: 'var(--accent-amber)' }}>
          {typeLabel}
        </span>
      </div>
      <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{post.title}</h3>
      <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{post.summary}</p>
    </Link>
  );
}

export default PostCard;
