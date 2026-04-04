// scores/summary 형식과 overall/breakdown/verdict 형식 양쪽 허용
interface ToolRatingProps {
  // 새 형식 (MDX에서 사용)
  scores?: Record<string, number>;
  summary?: string;
  // 구형식 (하위 호환)
  overall?: number;
  breakdown?: Record<string, number>;
  verdict?: string;
}

function ratingToColor(rating: number): string {
  if (rating >= 4.5) return '#10b981';
  if (rating >= 3.5) return '#f59e0b';
  return '#ef4444';
}

function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm w-24 shrink-0" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <div className="flex-1 h-2 rounded-full" style={{ background: 'var(--border)' }}>
        <div
          className="h-2 rounded-full"
          style={{ width: `${(value / 5) * 100}%`, background: ratingToColor(value) }}
        />
      </div>
      <span className="text-sm w-8 text-right font-medium" style={{ color: 'var(--text-primary)' }}>
        {value.toFixed(1)}
      </span>
    </div>
  );
}

export default function ToolRating({ scores, summary, overall, breakdown, verdict }: ToolRatingProps) {
  // 두 형식 통일
  const items = scores ?? breakdown ?? {};
  const description = summary ?? verdict ?? '';

  // 종합 점수: overall 값이 있으면 사용, 없으면 scores 평균
  const values = Object.values(items);
  const avg = values.length > 0
    ? values.reduce((a, b) => a + b, 0) / values.length
    : (overall ?? 0);
  const finalScore = overall ?? avg;

  return (
    <div className="my-8 p-6 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-6 mb-5">
        <div className="text-center shrink-0">
          <div className="text-5xl font-bold" style={{ color: ratingToColor(finalScore) }}>
            {finalScore.toFixed(1)}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>/ 5.0</div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>AI Scout 평점</div>
          {description && (
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{description}</p>
          )}
        </div>
      </div>
      <div className="space-y-3">
        {Object.entries(items).map(([label, value]) => (
          <RatingBar key={label} label={label} value={value} />
        ))}
      </div>
    </div>
  );
}
