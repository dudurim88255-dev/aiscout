import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Noto Sans KR (한글 지원) 폰트 로드
async function loadKoreanFont() {
  const res = await fetch(
    'https://fonts.gstatic.com/s/notosanskr/v36/PbyxFmXiEBPT4ITbgNA5Cgms3VYcOA-vvnIzzuoyeLTq8H4hfeE.0.woff2',
    { cache: 'force-cache' }
  );
  return res.arrayBuffer();
}

// 카테고리별 색상 팔레트
const CATEGORY_PALETTE: Record<string, { bg: string; accent: string; icon: string }> = {
  'writing-ai':      { bg: '#0f1a2e', accent: '#f59e0b', icon: '✍️' },
  'image-ai':        { bg: '#0f1a1f', accent: '#06b6d4', icon: '🎨' },
  'video-ai':        { bg: '#1a0f1f', accent: '#a855f7', icon: '🎬' },
  'code-ai':         { bg: '#0f1f15', accent: '#10b981', icon: '💻' },
  'productivity-ai': { bg: '#1a1a0f', accent: '#eab308', icon: '⚡' },
  'open-source-ai':  { bg: '#1a0f0f', accent: '#ef4444', icon: '🔓' },
};

const DEFAULT_PALETTE = { bg: '#0a0a0f', accent: '#f59e0b', icon: '🤖' };

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title    = searchParams.get('title')    ?? 'AI Scout';
  const category = searchParams.get('category') ?? '';
  const postType = searchParams.get('postType') ?? '';

  const palette = CATEGORY_PALETTE[category] ?? DEFAULT_PALETTE;

  const typeLabel: Record<string, string> = {
    NEW_TOOL_REVIEW: '신규 리뷰',
    VS_COMPARISON:   'VS 비교',
    PRICING_GUIDE:   '가격 가이드',
    UPDATE_SUMMARY:  '업데이트',
    HOW_TO_GUIDE:    '활용법',
  };
  const badge = typeLabel[postType] ?? '리뷰';

  const fontData = await loadKoreanFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '60px',
          background: palette.bg,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 배경 그라디언트 원 */}
        <div style={{
          position: 'absolute', top: '-120px', right: '-120px',
          width: '600px', height: '600px', borderRadius: '50%',
          background: `radial-gradient(circle, ${palette.accent}22 0%, transparent 70%)`,
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-80px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: `radial-gradient(circle, ${palette.accent}15 0%, transparent 70%)`,
          display: 'flex',
        }} />

        {/* 격자 힌트 */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(${palette.accent}08 1px, transparent 1px), linear-gradient(90deg, ${palette.accent}08 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          display: 'flex',
        }} />

        {/* 아이콘 */}
        <div style={{
          position: 'absolute', top: '48px', left: '60px',
          fontSize: '56px', display: 'flex',
        }}>
          {palette.icon}
        </div>

        {/* 사이트명 */}
        <div style={{
          position: 'absolute', top: '56px', right: '60px',
          fontSize: '22px', fontWeight: 700, color: palette.accent,
          letterSpacing: '0.05em', display: 'flex',
        }}>
          AI Scout
        </div>

        {/* 뱃지 */}
        <div style={{
          display: 'flex', marginBottom: '20px',
        }}>
          <span style={{
            fontSize: '18px', fontWeight: 600, color: palette.accent,
            background: `${palette.accent}1a`,
            border: `1px solid ${palette.accent}44`,
            borderRadius: '20px', padding: '6px 18px',
          }}>
            {badge}
          </span>
        </div>

        {/* 제목 */}
        <div style={{
          fontSize: title.length > 30 ? '40px' : '48px',
          fontWeight: 800,
          color: '#e2e8f0',
          lineHeight: 1.3,
          maxWidth: '900px',
          display: 'flex',
          flexWrap: 'wrap',
        }}>
          {title}
        </div>

        {/* 하단 구분선 */}
        <div style={{
          marginTop: '32px', height: '3px', width: '80px',
          background: palette.accent, borderRadius: '2px', display: 'flex',
        }} />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'NotoSansKR', data: fontData, weight: 700, style: 'normal' }],
    }
  );
}
