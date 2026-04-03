interface ToolRatingProps {
  overall: number;
  breakdown: Record<string, number>;
  verdict: string;
}

function ratingToColor(rating: number): string {
  if (rating >= 4.5) return '#10b981';
  if (rating >= 3.5) return '#f59e0b';
  return '#ef4444';
}

function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm w-20 shrink-0" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <div className="flex-1 h-2 rounded-full" style={{ background: 'var(--border)' }}>
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${(value / 5) * 100}%`, background: ratingToColor(value) }}
        />
      </div>
      <span className="text-sm w-8 text-right" style={{ color: 'var(--text-primary)' }}>
        {value.toFixed(1)}
      </span>
    </div>
  );
}

export default function ToolRating({ overall, breakdown, verdict }: ToolRatingProps) {
  return (
    <div className="my-8 p-6 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-6 mb-6">
        <div className="text-center">
          <div className="text-5xl font-bold" style={{ color: ratingToColor(overall) }}>
            {overall.toFixed(1)}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>/ 5.0</div>
        </div>
        <div className="flex-1">
          <div className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>종합 평점</div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{verdict}</p>
        </div>
      </div>
      <div className="space-y-3">
        {Object.entries(breakdown).map(([label, value]) => (
          <RatingBar key={label} label={label} value={value} />
        ))}
      </div>
    </div>
  );
}
