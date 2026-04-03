import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') ?? '인간 수명 150세 가능한가?';
  const category = searchParams.get('category') ?? '';
  const journal = searchParams.get('journal') ?? '';

  const CATEGORY_COLORS: Record<string, string> = {
    organoid: '#4fd1c5',
    'anti-aging': '#f6c90e',
    genomics: '#a78bfa',
    'stem-cell': '#34d399',
    'drug-discovery': '#f87171',
    neuroscience: '#60a5fa',
  };
  const accentColor = CATEGORY_COLORS[category] ?? '#4fd1c5';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #0a0f1a 0%, #0d1424 60%, #131a2e 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* 상단 바 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '4px', height: '28px', background: accentColor, borderRadius: '2px' }} />
          <span style={{ color: accentColor, fontSize: '18px', fontWeight: 700, letterSpacing: '0.05em' }}>
            인간 수명 150세 가능한가?
          </span>
          {journal && (
            <span style={{ marginLeft: 'auto', background: `${accentColor}20`, border: `1px solid ${accentColor}50`, color: accentColor, borderRadius: '20px', padding: '4px 14px', fontSize: '15px' }}>
              {journal}
            </span>
          )}
        </div>

        {/* 제목 */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '32px 0' }}>
          <h1
            style={{
              color: '#e8edf5',
              fontSize: title.length > 40 ? '42px' : '52px',
              fontWeight: 800,
              lineHeight: 1.3,
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </h1>
        </div>

        {/* 하단 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#8b96b0', fontSize: '16px' }}>150세 시대의 생존전략</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: accentColor }} />
            <span style={{ color: '#8b96b0', fontSize: '16px' }}>생명과학 논문 해설</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
