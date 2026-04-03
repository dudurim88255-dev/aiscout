interface Plan {
  name: string;
  price: number;
  krw?: number;
  features: string[];
  highlighted?: boolean;
}

interface PricingCardProps {
  tool: string;
  plans: Plan[];
  lastUpdated: string;
}

export default function PricingCard({ tool, plans, lastUpdated }: PricingCardProps) {
  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
          {tool} 요금제
        </h3>
        <span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
          {lastUpdated} 기준
        </span>
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(plans.length, 3)}, 1fr)` }}>
        {plans.map(plan => (
          <div key={plan.name}
            className="rounded-xl p-4"
            style={{
              border: plan.highlighted ? '2px solid var(--accent-amber)' : '1px solid var(--border)',
              background: plan.highlighted ? 'rgba(245, 158, 11, 0.06)' : 'var(--bg-card)',
            }}>
            {plan.highlighted && (
              <div className="text-xs font-semibold mb-2" style={{ color: 'var(--accent-amber)' }}>
                가장 인기
              </div>
            )}
            <div className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{plan.name}</div>
            <div className="mb-3">
              <span className="text-2xl font-bold" style={{ color: plan.price === 0 ? 'var(--accent-green)' : 'var(--text-primary)' }}>
                {plan.price === 0 ? '무료' : `$${plan.price}`}
              </span>
              {plan.price > 0 && (
                <span className="text-sm ml-1" style={{ color: 'var(--text-secondary)' }}>/월</span>
              )}
              {plan.krw && plan.price > 0 && (
                <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  ≈ ₩{plan.krw.toLocaleString()}
                </div>
              )}
            </div>
            <ul className="space-y-1">
              {plan.features.map(f => (
                <li key={f} className="text-sm flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--accent-amber)' }}>·</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
