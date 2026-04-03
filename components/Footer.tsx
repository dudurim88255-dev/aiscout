import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}
      className="mt-16 py-8">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <p className="font-bold mb-1" style={{ color: 'var(--accent-amber)' }}>AI Scout</p>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          AI 도구, 먼저 찾고 직접 검증했습니다
        </p>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          © 2026 AI Scout. 본 블로그의 가격 정보는 변경될 수 있습니다. 최신 정보는 공식 사이트를 확인하세요.
        </p>
      </div>
    </footer>
  );
}
