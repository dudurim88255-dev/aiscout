// price/krw: 숫자(0, 20) 또는 문자열("$0", "$20/월", "₩28,000") 모두 허용
// highlight / highlighted 양쪽 허용
interface Plan {
  name: string;
  price: string | number;
  krw?: string | number;
  features: string[];
  highlight?: boolean;
  highlighted?: boolean;
}

interface PricingCardProps {
  tool?: string;
  plans: Plan[];
  lastUpdated: string;
}

function isFree(price: string | number): boolean {
  if (typeof price === 'number') return price === 0;
  return price === '$0' || price === '0' || price.includes('무료') || price.includes('Free');
}

function formatPrice(price: string | number): string {
  if (typeof price === 'number') return price === 0 ? '무료' : `$${price}/월`;
  return price;
}

export default function PricingCard({ tool, plans = [], lastUpdated }: PricingCardProps) {
  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-4">
        {tool && (
          <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
            {tool} 요금제
          </h3>
        )}
        <span className="text-xs px-2 py-1 rounded ml-auto" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
          {lastUpdated} 기준
        </span>
      </div>
      <div className={`grid gap-4 ${plans.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : plans.length >= 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {plans.map(plan => {
          const isHighlight = plan.highlight || plan.highlighted || false;
          const free = isFree(plan.price);
          return (
            <div key={plan.name}
              className="rounded-xl p-5"
              style={{
                border: isHighlight ? '2px solid var(--accent-amber)' : '1px solid var(--border)',
                background: isHighlight ? 'rgba(245,158,11,0.05)' : 'var(--bg-card)',
              }}>
              {isHighlight && (
                <div className="text-xs font-semibold mb-2 inline-block px-2 py-0.5 rounded" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--accent-amber)' }}>
                  추천
                </div>
              )}
              <div className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{plan.name}</div>
              <div className="mb-4">
                <span className="text-2xl font-bold" style={{ color: free ? 'var(--accent-green)' : 'var(--text-primary)' }}>
                  {formatPrice(plan.price)}
                </span>
                {plan.krw && !free && (
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    ≈ {typeof plan.krw === 'number' ? `₩${plan.krw.toLocaleString()}` : plan.krw}
                  </div>
                )}
              </div>
              <ul className="space-y-2">
                {plan.features.map(f => (
                  <li key={f} className="text-sm flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <span className="mt-0.5 shrink-0" style={{ color: 'var(--accent-amber)' }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
