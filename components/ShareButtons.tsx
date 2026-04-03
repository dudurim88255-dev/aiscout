'use client';
// Task 8에서 AI Scout용으로 교체 예정인 stub 컴포넌트
interface Props {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: Props) {
  return (
    <div className="mt-8 flex gap-3">
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm px-4 py-2 rounded"
        style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
      >
        Twitter 공유
      </a>
    </div>
  );
}
