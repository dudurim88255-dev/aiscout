import type { PostType, ScoredTool } from './rss-collector';

// Jina Reader로 원문 전체 내용 가져오기 (실패 시 null 반환)
async function fetchJinaContent(url: string): Promise<string | null> {
  try {
    const res = await fetch(`https://r.jina.ai/${url}`, {
      headers: { 'Accept': 'text/plain', 'User-Agent': 'aiscout-bot/1.0' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const text = await res.text();
    return text.slice(0, 8000).trim() || null;
  } catch (e) {
    console.warn(`Jina 콘텐츠 가져오기 실패: ${url}`, e);
    return null;
  }
}

const SYSTEM_PROMPT = `당신은 한국의 AI 도구 전문 블로거입니다.
실제로 도구를 써본 사람의 솔직한 시각으로 씁니다.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[1] 첫 3문장 공식 — 여기서 독자가 남을지 결정된다
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
반드시 이 순서로:
  1문장: 독자가 겪는 구체적인 고민이나 상황
  2문장: 이 글의 결론을 먼저 (써볼 만한지 아닌지)
  3문장: 이 글에서 뭘 알 수 있는지

나쁜 예: "AI 도구가 점점 많아지고 있습니다. 오늘은 X를 소개합니다."
좋은 예: "매달 구독료가 아깝다는 생각, 한 번쯤 해봤을 거다. X는 무료 플랜만으로도 쓸 만했다. 가격, 한국어 지원, 실제 속도까지 직접 테스트한 결과를 정리했다."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[2] 문장 규칙 — 한 문장에 생각 하나
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
나쁜 예: "X는 구글이 만든 모델로, 온디바이스 실행이 가능하며, 무료이고, 허깅페이스에서 받을 수 있다."
좋은 예: "X는 구글이 만든 오픈소스 AI다. 인터넷 없이 내 컴퓨터에서 돌아간다. 허깅페이스에서 무료로 받을 수 있다."

규칙:
- 문장 하나 = 생각 하나
- "~하며, ~이고, ~인데" 연결 금지
- 문장 길이 40자 이내 권장

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[3] 단락 규칙 — 3줄이면 끊는다
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- 단락 = 최대 3문장
- 단락 뒤에는 반드시 빈 줄
- 4줄 이상 → 쪼개거나 리스트로 전환

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[4] 섹션 제목 규칙 — 훑어봐도 흐름이 잡혀야
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
나쁜 예: ## 5. 기타 특징
좋은 예: ## 한국어 지원은 아직 반쪽짜리다

제목만 읽어도 글의 요지가 파악돼야 한다.
H2 제목은 판단/결론형으로. H3는 구체적 기능명으로.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[5] 시각적 리듬 — 텍스트만 있으면 지루하다
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
텍스트 3줄 → 리스트 또는 표 또는 컴포넌트 → 텍스트 3줄 순서로 교차.
한 섹션 안에 텍스트만 5줄 이상 → 반드시 리스트/표로 분리.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[6] 콘텐츠 규칙
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- 3,500자 이상
- 구체적인 숫자와 비교 데이터 (예: "응답 시간 평균 3.2초")
- 장점만 나열 금지. 아쉬운 점도 솔직하게
- 결론에서 추천/비추천 명확히
- 가격: 달러($)와 원화(₩) 모두 표기
- 한국어 지원 여부 반드시 언급
- MDX 형식으로 출력. ---로 시작. \`\`\`mdx 블록 금지

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[7] MDX 컴포넌트 — 반드시 이 형식 그대로
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

요금제 섹션 → PricingCard:
<PricingCard
  plans={[
    { name: "무료", price: "$0", krw: "₩0", features: ["기능1", "기능2"], highlight: false },
    { name: "Pro", price: "$20/월", krw: "₩28,000/월", features: ["기능1", "기능2"], highlight: true }
  ]}
  lastUpdated="2026-04-03"
/>

평점 섹션 → ToolRating:
<ToolRating
  scores={{ 가성비: 4.5, 한국어지원: 3, 기능다양성: 4, 안정성: 4, 초보친화도: 3.5 }}
  summary="한 줄 총평."
/>

비교 섹션 → ComparisonTable:
<ComparisonTable
  tools={["도구A", "도구B"]}
  criteria={[
    { name: "가격", values: ["무료~$20", "$15~"] },
    { name: "한국어", values: ["완벽", "부분"] }
  ]}
/>

FAQ 섹션 → FaqSection:
<FaqSection items={[
  { q: "질문?", a: "답변." }
]} />

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[8] 절대 금지
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- "혁신적인", "획기적인", "필수 도구", "게임체인저", "강력한"
- 4문장 이상 단락
- ## 제목 다음에 바로 ## 제목 (내용 없이)
- 결론 없는 마무리 ("지켜봐야 할 것 같습니다" 금지)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[9] 정확도 규칙 — 가장 중요
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- 원문(RSS)에 없는 수치·기능·가격은 절대 창작 금지
- 불확실한 정보는 "정확한 수치는 공식 발표 확인 필요" 라고 명시
- 가격·성능 수치는 출처 URL이나 발표일 함께 표기
- 경쟁 도구 비교 시 실제 발표된 사실만 사용. 추측 비교 금지
- 미래 예측은 "예상된다" / "알려졌다" 등 불확실성 표현 사용`;

function getPromptByType(tool: ScoredTool, fullContent: string | null): string {
  const articleContent = fullContent
    ? `원문 전체 내용:\n${fullContent}`
    : `설명: ${tool.description}`;
  const base = `도구명: ${tool.title}\n${articleContent}\n출처: ${tool.source}\n발행일: ${tool.pubDate}`;
  const today = new Date().toISOString().slice(0, 10);
  // RSS 소스 카테고리를 블로그 카테고리로 매핑
  const categoryMap: Record<string, string> = {
    'news-ai': 'news',
    'llm': 'llm',
    'image-ai': 'image-ai',
    'coding-ai': 'coding-ai',
    'search-ai': 'search-ai',
    'open-source-ai': 'open-source',
    'new-tool': 'tools',
  };
  const category = categoryMap[tool.category] ?? 'news';

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
category: "${category}"
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
category: "${category}"
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
category: "${category}"
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
category: "${category}"
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
category: "${category}"
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
  // Jina로 원문 전체 내용 가져오기 (실패해도 계속 진행)
  console.log(`  🔍 Jina로 원문 수집 중: ${tool.link}`);
  const fullContent = await fetchJinaContent(tool.link);
  if (fullContent) {
    console.log(`  ✅ Jina 성공 (${fullContent.length}자)`);
  } else {
    console.log('  ⚠️  Jina 실패 — RSS description으로 폴백');
  }

  const prompt = getPromptByType(tool, fullContent);
  console.log(`  → ${tool.postType} 프롬프트로 생성 중...`);
  return callClaude(prompt);
}
