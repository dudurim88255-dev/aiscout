import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: '문의하기 | AI Scout',
  description: 'AI Scout에 광고, 협업, 오류 제보 등을 문의하세요.',
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        문의하기
      </h1>
      <p className="mb-10" style={{ color: 'var(--text-secondary)', lineHeight: 1.9 }}>
        광고 문의, 협업 제안, 오류 제보, 리뷰 요청 등 무엇이든 환영합니다.
      </p>

      <div className="space-y-4">
        {/* 이메일 */}
        <div className="rounded-xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="text-sm font-semibold mb-1" style={{ color: 'var(--accent-amber)' }}>이메일</div>
          <p style={{ color: 'var(--text-secondary)' }}>
            아래 주제별로 이메일을 보내주세요.
          </p>
          <ul className="mt-3 space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <li>• 광고·협업 문의: dudurim88255-dev@github.com</li>
            <li>• 오류·제보: GitHub Issues로 제출</li>
          </ul>
        </div>

        {/* GitHub */}
        <div className="rounded-xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="text-sm font-semibold mb-1" style={{ color: 'var(--accent-amber)' }}>GitHub</div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            오류 제보나 기능 제안은 GitHub에서 Issue를 열어주세요.
          </p>
          <a
            href="https://github.com/dudurim88255-dev/aiscout/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ color: 'var(--accent-amber)' }}
          >
            GitHub Issues 바로가기 →
          </a>
        </div>

        {/* 안내 */}
        <div className="rounded-xl p-5 text-sm" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', color: 'var(--text-muted)' }}>
          광고성 스팸, 악의적 요청에는 응하지 않습니다. 합리적인 문의에는 3영업일 내 답변 드립니다.
        </div>
      </div>
    </div>
  );
}
