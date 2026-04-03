import type { PostType, ScoredTool } from './rss-collector.ts';

const SYSTEM_PROMPT = `당신은 한국의 AI 도구 전문 블로거입니다.
실제로 도구를 사용해본 사람의 관점에서 글을 작성합니다.

작성 규칙:
1. 반드시 3,000자 이상 작성
2. 첫 문단은 독자의 고민/상황으로 시작
3. "직접 써봤는데", "실제로 써보니" 같은 체험형 표현 사용
4. 구체적인 숫자와 비교 데이터 포함
5. 장점만 나열하지 않고, 아쉬운 점도 솔직하게
6. 결론에서 "이런 사람에게 추천/비추천" 명확히
7. 가격은 달러($)와 원화(₩) 모두 표기
8. 한국어 지원 여부 반드시 언급
9. MDX 형식으로 출력 (frontmatter 포함)

절대 사용 금지: "혁신적인", "획기적인", "필수 도구", "게임체인저"
MDX 컴포넌트 활용: ComparisonTable, PricingCard, ToolRating, FaqSection`;

function getPromptByType(tool: ScoredTool): string {
  const base = `도구명: ${tool.title}\n설명: ${tool.description}\n출처: ${tool.source}\n발행일: ${tool.pubDate}`;

  const today = new Date().toISOString().slice(0, 10);

  const prompts: Record<PostType, string> = {
    NEW_TOOL_REVIEW: `${base}

새로 출시된 AI 도구 리뷰 블로그 글을 MDX 형식으로 작성하세요.

글 구조:
1. 도입 — "${tool.title}이 출시됐는데, 실제로 어떤 도구인지 정리했다"
2. 30초 요약 (핵심 기능, 가격, 대상)
3. 핵심 기능 3~5가지 (각각 구체적 설명)
4. PricingCard 컴포넌트 삽입 (무료/유료 요금제)
5. ToolRating 컴포넌트 삽입 (가성비/한국어/기능/안정성/초보친화 5항목, 각 0~5점)
6. 기존 대안 대비 장단점
7. 누구에게 추천하는지 / 비추천 경우
8. FaqSection 컴포넌트로 자주 묻는 질문 5개

반드시 frontmatter 포함:
---
title: "[제목]"
slug: "[slug]"
date: "${today}"
lastUpdated: "${today}"
postType: "NEW_TOOL_REVIEW"
category: "writing-ai"
tags: []
tools: ["${tool.title}"]
seoKeyword: "${tool.title} 사용법 2026"
summary: "[요약]"
faqEnabled: true
rating: [0~5 숫자]
---`,

    VS_COMPARISON: `${base}
경쟁 도구: ${tool.competitors.slice(0, 2).join(', ')}

AI 도구 비교 분석 블로그 글을 MDX 형식으로 작성하세요.

글 구조:
1. 도입 — "뭘 써야 할까? 직접 비교했습니다"
2. ComparisonTable 컴포넌트 삽입 (가격/한국어/기능/무료플랜/속도 비교)
3. 각 도구별 상세 리뷰 (장점 3개, 단점 2개씩)
4. 실사용 시나리오별 추천 (학생/직장인/개발자/크리에이터)
5. 최종 결론
6. FaqSection 컴포넌트로 자주 묻는 질문 5개

반드시 frontmatter 포함:
---
title: "[도구A] vs [도구B] 2026 — [핵심 차이점]"
slug: "[slug]"
date: "${today}"
lastUpdated: "${today}"
postType: "VS_COMPARISON"
category: "writing-ai"
tags: []
tools: ["${tool.title}", "${tool.competitors[0] ?? ''}"]
seoKeyword: "${tool.title} vs ${tool.competitors[0] ?? ''} 비교 2026"
summary: "[요약]"
faqEnabled: true
---`,

    PRICING_GUIDE: `${base}

AI 도구 가격 가이드 블로그 글을 MDX 형식으로 작성하세요.

글 구조:
1. 도입 — 가격 관련 독자 고민
2. PricingCard 컴포넌트로 전체 요금제 정리
3. 무료로 할 수 있는 것 vs 없는 것
4. 유료 플랜 가치 분석
5. 저렴한 대안 소개
6. 결론 — 예산별 추천

반드시 frontmatter 포함:
---
title: "${tool.title} 가격 2026 — 무료로 얼마나 쓸 수 있나?"
slug: "[slug]"
date: "${today}"
lastUpdated: "${today}"
postType: "PRICING_GUIDE"
category: "writing-ai"
tags: []
tools: ["${tool.title}"]
seoKeyword: "${tool.title} 가격 2026"
summary: "[요약]"
faqEnabled: false
---`,

    UPDATE_SUMMARY: `${base}

AI 도구 업데이트 정리 블로그 글을 MDX 형식으로 작성하세요.

글 구조:
1. 도입 — "업데이트됐다. 뭐가 바뀐건지 정리했다"
2. 핵심 변경사항 (bullet 3~5개)
3. 이전 버전 대비 달라진 점
4. 기존 사용자 영향
5. 신규 기능 활용법

반드시 frontmatter 포함:
---
title: "${tool.title} 업데이트 2026 — 뭐가 바뀌었나?"
slug: "[slug]"
date: "${today}"
lastUpdated: "${today}"
postType: "UPDATE_SUMMARY"
category: "writing-ai"
tags: []
tools: ["${tool.title}"]
seoKeyword: "${tool.title} 업데이트 2026"
summary: "[요약]"
faqEnabled: false
---`,

    HOW_TO_GUIDE: `${base}

AI 도구 활용법 블로그 글을 MDX 형식으로 작성하세요.

글 구조:
1. 도입 — 독자가 이 도구로 해결하려는 문제 상황
2. 기본 사용법 (단계별)
3. 실전 활용 예시 3가지 (직장인/학생/크리에이터)
4. 숨겨진 기능 2~3가지
5. 자주 하는 실수와 해결법
6. ToolRating 컴포넌트로 종합 평점
7. FaqSection으로 자주 묻는 질문 5개

반드시 frontmatter 포함:
---
title: "${tool.title} 사용법 2026 — 직장인이 바로 쓸 수 있는 활용법"
slug: "[slug]"
date: "${today}"
lastUpdated: "${today}"
postType: "HOW_TO_GUIDE"
category: "writing-ai"
tags: []
tools: ["${tool.title}"]
seoKeyword: "${tool.title} 사용법 2026"
summary: "[요약]"
faqEnabled: true
---`,
  };

  return prompts[tool.postType];
}

async function callClaude(prompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY 환경변수가 없습니다');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API 오류 ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text ?? '';
}

export async function generatePost(tool: ScoredTool): Promise<string> {
  const prompt = getPromptByType(tool);
  console.log(`  → ${tool.postType} 프롬프트로 생성 중...`);
  return callClaude(prompt);
}
