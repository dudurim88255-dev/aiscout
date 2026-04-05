import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'AI Scout 소개 | AI 도구 비교·리뷰 블로그',
  description: 'AI Scout는 ChatGPT, Claude, Gemini 등 AI 도구를 직접 사용해보고 가격·기능·한국어 지원을 비교하는 한국어 블로그입니다.',
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
        AI Scout 소개
      </h1>

      <div className="space-y-6" style={{ color: 'var(--text-secondary)', lineHeight: 1.9 }}>
        <p>
          <strong style={{ color: 'var(--text-primary)' }}>AI Scout</strong>는 쏟아지는 AI 도구들을
          직접 써보고 솔직하게 정리하는 한국어 블로그입니다.
        </p>

        <p>
          매달 수십 개의 새로운 AI 도구가 출시됩니다. 어떤 걸 써야 할지, 유료 플랜이 돈값을 하는지,
          한국어는 제대로 지원되는지 — 직접 테스트하지 않으면 알기 어렵습니다.
        </p>

        <p>
          AI Scout는 그 물음에 답하기 위해 만들어졌습니다. 광고성 홍보 없이,
          실제 사용 경험을 기반으로 가격·기능·한국어 지원을 비교합니다.
        </p>

        <hr style={{ borderColor: 'var(--border)', margin: '2rem 0' }} />

        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>다루는 내용</h2>
        <ul className="space-y-2 list-disc pl-5">
          <li>글쓰기·언어 AI (ChatGPT, Claude, Gemini 등)</li>
          <li>이미지 생성 AI (Midjourney, DALL-E, Stable Diffusion 등)</li>
          <li>영상 AI (Sora, Runway, Kling 등)</li>
          <li>코딩 AI (Cursor, Copilot, Replit 등)</li>
          <li>생산성 AI (Notion AI, Perplexity 등)</li>
          <li>오픈소스 AI (Llama, Mistral, Gemma 등)</li>
        </ul>

        <hr style={{ borderColor: 'var(--border)', margin: '2rem 0' }} />

        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>업데이트 주기</h2>
        <p>
          매일 최신 AI 뉴스를 수집해 자동으로 리뷰를 생성합니다.
          중요한 업데이트나 가격 변경이 있을 때는 즉시 반영합니다.
        </p>

        <hr style={{ borderColor: 'var(--border)', margin: '2rem 0' }} />

        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>문의</h2>
        <p>
          광고, 협업, 제보 등은{' '}
          <a href="/contact" style={{ color: 'var(--accent-amber)' }}>문의 페이지</a>를 이용해주세요.
        </p>
      </div>
    </div>
  );
}
