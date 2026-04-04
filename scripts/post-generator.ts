import type { PostType, ScoredTool } from './rss-collector';

const SYSTEM_PROMPT = `당신은 한국의 AI 도구 전문 블로거입니다.
실제로 도구를 사용해본 사람의 관점에서 씁니다.

━━━ 가독성 규칙 (가장 중요) ━━━
- 단락은 최대 2~3문장. 길면 반드시 줄 바꿈
- 섹션(##) 시작 전에는 반드시 빈 줄 2개
- 리스트 항목 사이에 빈 줄 넣지 않기 (붙여서)
- 한 섹션에 글만 있으면 답답함 → 표나 리스트로 시각화
- 문장은 짧고 명확하게. "~했는데, ~이고, ~이며" 식의 긴 문장 금지

━━━ 콘텐츠 규칙 ━━━
1. 반드시 3,500자 이상
2. 첫 문단은 독자의 고민/상황으로 시작 (2~3문장)
3. "직접 써봤는데", "실제로 써보니" 체험형 표현
4. 구체적인 숫자, 비교 데이터 포함
5. 장점만 나열하지 않고 아쉬운 점도 솔직하게
6. 결론에서 "이런 사람에게 추천/비추천" 명확히
7. 가격은 달러($)와 원화(₩) 모두 표기
8. 한국어 지원 여부 반드시 언급
9. MDX 형식으로 출력. 반드시 ---로 시작. 코드 블록(\`\`\`mdx)으로 감싸지 말 것

━━━ MDX 컴포넌트 사용법 ━━━

요금제 섹션에 반드시 PricingCard 컴포넌트 사용:
<PricingCard
  plans={[
    { name: "무료", price: "$0", krw: "₩0", features: ["기능1", "기능2", "기능3"], highlight: false },
    { name: "Pro", price: "$20/월", krw: "₩28,000/월", features: ["기능1", "기능2", "기능3"], highlight: true }
  ]}
  lastUpdated="2026-04-03"
/>

평점 섹션에 반드시 ToolRating 컴포넌트 사용:
<ToolRating
  scores={{
    가성비: 4.5,
    한국어지원: 3,
    기능다양성: 4,
    안정성: 4,
    초보친화도: 3.5
  }}
  summary="전반적으로 추천. 특히 가성비 면에서 탁월하다."
/>

비교 섹션에 ComparisonTable 컴포넌트 사용:
<ComparisonTable
  tools={["도구A", "도구B", "도구C"]}
  criteria={[
    { name: "가격", values: ["무료~$20", "무료~$30", "$15~"] },
    { name: "한국어", values: ["완벽", "부분", "미지원"] }
  ]}
/>

FAQ 섹션에 반드시 FaqSection 컴포넌트 사용:
<FaqSection items={[
  { q: "질문1?", a: "답변1." },
  { q: "질문2?", a: "답변2." }
]} />

━━━ 절대 금지 ━━━
- "혁신적인", "획기적인", "필수 도구", "게임체인저"
- 3문장 넘는 단락
- ## 섹션 제목 바로 다음에 또 ## 제목 오는 구조`;

function getPromptByType(tool: ScoredTool): string {
  const base = `도구명: ${tool.title}\n설명: ${tool.description}\n출처: ${tool.source}\n발행일: ${tool.pubDate}`;
  const today = new Date().toISOString().slice(0, 10);

  const prompts: Record<PostType, string> = {
    NEW_TOOL_REVIEW: `${base}

새로 출시된 AI 도구 리뷰 블로그 글을 MDX 형식으로 작성하세요.

글 구조 (이 순서대로, 각 섹션 앞에 빈 줄 2개):
1. 도입 (2~3문장 단락 2개) — 독자 고민 → 이 도구를 써본 한줄 결론
2. ## 30초 요약 — 불릿 리스트 (모델유형, 핵심기능, 가격, 대상, 한국어지원)
3. ## 핵심 기능 [번호]가지 — 각 기능은 ### 소제목 + 2~3문장 설명 + 필요시 표
4. ## 요금제 — PricingCard 컴포넌트 (무료/유료 플랜)
5. ## 이런 분께 추천합니다 — 불릿 3~5개
6. ## 솔직한 평점 — ToolRating 컴포넌트
7. ## 자주 묻는 질문 — FaqSection 컴포넌트 (5개)

frontmatter:
---
title: "[한국어 제목 — 체험형]"
slug: "[영문-소문자-하이픈]"
date: "${today}"
lastUpdated: "${today}"
postType: "NEW_TOOL_REVIEW"
category: "writing-ai"
tags: ["[도구명]", "[주요기능]", "[카테고리]", "[비교키워드]"]
tools: ["${tool.title}"]
seoKeyword: "[도구명] [핵심기능] 리뷰 사용법 [연도]"
summary: "[2~3문장 요약]"
coverImage: ""
faqEnabled: true
rating: [0~5 소수점1자리]
---`,

    VS_COMPARISON: `${base}
경쟁 도구: ${tool.competitors.slice(0, 2).join(', ')}

AI 도구 비교 분석 블로그 글을 MDX 형식으로 작성하세요.

글 구조:
1. 도입 (2~3문장) — "뭘 써야 할지 모르겠다면, 직접 비교했습니다"
2. ## 한눈에 비교 — ComparisonTable 컴포넌트
3. ## [도구A] 상세 분석 — 장점 3개, 단점 2개 (각 불릿)
4. ## [도구B] 상세 분석 — 장점 3개, 단점 2개 (각 불릿)
5. ## 상황별 추천 — 표로 정리 (학생/직장인/개발자/크리에이터)
6. ## 최종 결론
7. ## 자주 묻는 질문 — FaqSection (5개)

frontmatter:
---
title: "[도구A] vs [도구B] 2026 비교 — [핵심 차이 한 줄]"
slug: "[slug]"
date: "${today}"
lastUpdated: "${today}"
postType: "VS_COMPARISON"
category: "writing-ai"
tags: ["[도구A]", "[도구B]", "AI 도구 비교", "[카테고리]"]
tools: ["${tool.title}", "${tool.competitors[0] ?? ''}"]
seoKeyword: "${tool.title} vs ${tool.competitors[0] ?? ''} 비교 2026"
summary: "[2~3문장]"
coverImage: ""
faqEnabled: true
---`,

    PRICING_GUIDE: `${base}

AI 도구 가격 가이드 글을 MDX 형식으로 작성하세요.

글 구조:
1. 도입 — 가격 때문에 고민하는 독자 상황 (2~3문장)
2. ## 전체 요금제 정리 — PricingCard 컴포넌트
3. ## 무료로 할 수 있는 것 vs 못 하는 것 — 표로 정리
4. ## 유료 플랜 가치 분석 — 숫자로 근거
5. ## 더 저렴한 대안 — 불릿 3~5개
6. ## 예산별 추천 — 표 (월 $0 / $10 / $20 / $50+)

frontmatter:
---
title: "${tool.title} 가격 요금제 2026 — 무료로 얼마나 쓸 수 있나?"
slug: "[slug]"
date: "${today}"
lastUpdated: "${today}"
postType: "PRICING_GUIDE"
category: "writing-ai"
tags: ["${tool.title}", "AI 요금제", "가격 비교", "무료 AI"]
tools: ["${tool.title}"]
seoKeyword: "${tool.title} 가격 요금제 2026"
summary: "[2~3문장]"
coverImage: ""
faqEnabled: false
---`,

    UPDATE_SUMMARY: `${base}

AI 도구 업데이트 정리 글을 MDX 형식으로 작성하세요.

글 구조:
1. 도입 — "업데이트됐다. 뭐가 바뀐건지 빠르게 정리했다" (2~3문장)
2. ## 이번 업데이트 핵심 3가지 — 굵은 소제목 + 2~3문장 설명
3. ## 이전 버전과 비교 — 표 (기능/이전/이후)
4. ## 기존 사용자에게 미치는 영향
5. ## 신규 기능 바로 써보는 법 — 단계별 가이드
6. ## ToolRating — 업데이트 후 평점

frontmatter:
---
title: "${tool.title} 업데이트 2026 — 뭐가 달라졌나 직접 확인했다"
slug: "[slug]"
date: "${today}"
lastUpdated: "${today}"
postType: "UPDATE_SUMMARY"
category: "writing-ai"
tags: ["${tool.title}", "AI 업데이트", "신기능", "[카테고리]"]
tools: ["${tool.title}"]
seoKeyword: "${tool.title} 업데이트 변경사항 2026"
summary: "[2~3문장]"
coverImage: ""
faqEnabled: false
---`,

    HOW_TO_GUIDE: `${base}

AI 도구 활용법 가이드 글을 MDX 형식으로 작성하세요.

글 구조:
1. 도입 — 독자가 이 도구로 해결하려는 문제 (2~3문장)
2. ## 시작 전 알아야 할 것 — 불릿 (준비물, 가격, 소요시간)
3. ## 기본 사용법 — 단계별 번호 리스트 (각 단계 2~3문장)
4. ## 실전 활용 예시 — ### 직장인 / ### 학생 / ### 크리에이터
5. ## 잘 모르는 꿀 기능 3가지
6. ## 자주 하는 실수와 해결법 — 표 (실수 / 해결)
7. ## 솔직한 평점 — ToolRating 컴포넌트
8. ## 자주 묻는 질문 — FaqSection (5개)

frontmatter:
---
title: "${tool.title} 사용법 2026 — 바로 써먹는 실전 가이드"
slug: "[slug]"
date: "${today}"
lastUpdated: "${today}"
postType: "HOW_TO_GUIDE"
category: "writing-ai"
tags: ["${tool.title}", "AI 사용법", "활용법", "[카테고리]"]
tools: ["${tool.title}"]
seoKeyword: "${tool.title} 사용법 활용법 2026"
summary: "[2~3문장]"
coverImage: ""
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
      max_tokens: 6000,
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
