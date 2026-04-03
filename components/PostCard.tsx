import Link from 'next/link';
import { PostMeta } from '@/lib/posts';

const DIFFICULTY_CONFIG = {
  '입문': { color: '#4fd1c5', bg: 'rgba(79,209,197,0.1)', emoji: '🟢' },
  '중급': { color: '#f6c90e', bg: 'rgba(246,201,14,0.1)', emoji: '🟡' },
  '심화': { color: '#f87171', bg: 'rgba(248,113,113,0.1)', emoji: '🔴' },
};

const CATEGORY_EMOJI: Record<string, string> = {
  organoid: '🫁',
  'anti-aging': '⏳',
  genomics: '🧬',
  'stem-cell': '🔬',
  'drug-discovery': '💊',
  neuroscience: '🧠',
};

interface Props {
  post: PostMeta;
}

export function PostCard({ post }: Props) {
  const diff = DIFFICULTY_CONFIG[post.difficulty] ?? DIFFICULTY_CONFIG['입문'];
  const catEmoji = CATEGORY_EMOJI[post.category] ?? '📄';

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article
        style={{ borderRadius: 16, transition: 'border-color 0.2s, transform 0.2s' }}
        className="glass-card h-full overflow-hidden hover:border-[#4fd1c5] group-hover:-translate-y-1"
      >
        {post.coverImage && (
          <div className="w-full h-44 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
        )}
        <div className="p-5">
          {/* 카테고리 + 난이도 */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span style={{ background: 'rgba(79,209,197,0.08)', color: '#4fd1c5', border: '1px solid rgba(79,209,197,0.2)', borderRadius: 20, padding: '2px 10px', fontSize: 12 }}>
              {catEmoji} {post.category}
            </span>
            <span style={{ background: diff.bg, color: diff.color, border: `1px solid ${diff.color}40`, borderRadius: 20, padding: '2px 10px', fontSize: 12 }}>
              {diff.emoji} {post.difficulty}
            </span>
            {post.journal && (
              <span style={{ background: 'rgba(124,58,237,0.1)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 20, padding: '2px 10px', fontSize: 12 }}>
                {post.journal}
              </span>
            )}
          </div>

          {/* 제목 */}
          <h2 className="font-bold text-base mb-2 leading-snug" style={{ color: '#e8edf5' }}>
            {post.title}
          </h2>

          {/* 요약 */}
          <p className="text-sm line-clamp-3 mb-4" style={{ color: '#8b96b0' }}>
            {post.summary}
          </p>

          {/* 날짜 + 읽기 시간 */}
          <div className="flex items-center gap-3 text-xs" style={{ color: '#4a5568' }}>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
