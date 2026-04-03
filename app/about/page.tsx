import type { Metadata } from 'next';
import { SITE_NAME, SITE_TAGLINE } from '@/lib/seo';

export const metadata: Metadata = {
  title: '소개',
  description: `${SITE_NAME} — ${SITE_TAGLINE}. 역노화·오가노이드·CRISPR 등 최신 연구를 쉽게 소개합니다.`,
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="text-5xl mb-4">⏳</div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#e8edf5' }}>인간 수명 150세 가능한가?</h1>
        <p className="font-semibold" style={{ color: '#4fd1c5' }}>{SITE_TAGLINE}</p>
      </div>

      <div className="space-y-8" style={{ color: '#c5d8f0', lineHeight: 1.9 }}>
        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: '#4fd1c5' }}>이 블로그는?</h2>
          <p style={{ color: '#8b96b0' }}>
            역노화, 오가노이드, CRISPR, 줄기세포… 과학은 지금 인간의 한계를 빠르게 넘어서고 있습니다.
            이 블로그는 150세 시대를 준비하는 사람들을 위해, 최신 생명과학 논문을 전문 지식 없이도
            이해할 수 있도록 쉽게 풀어 설명합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: '#4fd1c5' }}>다루는 분야</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { emoji: '🫁', name: '오가노이드', desc: '장기 모사체 연구' },
              { emoji: '⏳', name: '역노화', desc: '수명 연장 연구' },
              { emoji: '🧬', name: '유전체학', desc: 'CRISPR, 유전자 편집' },
              { emoji: '🔬', name: '줄기세포', desc: '재생의학' },
              { emoji: '💊', name: '신약개발', desc: '임상시험 결과' },
              { emoji: '🧠', name: '뇌과학', desc: '신경과학 연구' },
            ].map((item) => (
              <div key={item.name} style={{ background: '#131a2e', border: '1px solid #1e2a42', borderRadius: 12, padding: '12px 16px' }}>
                <div className="text-xl mb-1">{item.emoji}</div>
                <div className="font-semibold text-sm" style={{ color: '#e8edf5' }}>{item.name}</div>
                <div className="text-xs" style={{ color: '#8b96b0' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: '#4fd1c5' }}>E-E-A-T 관련</h2>
          <p style={{ color: '#8b96b0' }}>
            모든 포스트는 원문 논문의 DOI 링크를 제공하며, 정확성을 위해 원문 초록과 주요 결과를
            기반으로 작성됩니다. 과학적 사실은 해당 논문의 내용에 근거하며, 의학적 조언이 아닌
            과학 정보 제공을 목적으로 합니다.
          </p>
        </section>
      </div>
    </div>
  );
}
