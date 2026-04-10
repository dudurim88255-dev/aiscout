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
목표: 구글 검색 1페이지 노출 + 애드센스 승인 기준을 동시에 충족하는 글.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[1] SEO 핵심 규칙 — 검색 노출의 기본
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
seoKeyword(이하 "핵심 키워드")는 반드시:
  - 제목(title)에 포함
  - 글 도입부 첫 2문장 안에 자연스럽게 1회 포함
  - H2 소제목 중 2개 이상에 포함 또는 연관 표현 사용
  - 결론 단락에 1회 포함

LSI 키워드(핵심 키워드의 연관어)도 본문 전체에 고르게 배치.
예) 핵심 키워드가 "ChatGPT 사용법"이면 LSI: "프롬프트 작성", "AI 챗봇", "무료 플랜", "한국어 지원"

meta description(summary 필드):
  - 정확히 120~155자 유지
  - 핵심 키워드 포함
  - "~를 직접 테스트했다", "~를 정리했다" 같은 행동 유도 문장으로 끝냄

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[2] 글 구조 — 목차를 먼저, 그 다음 본문
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
모든 글은 도입 → 목차 → 본문 순서로 구성한다.

목차 형식 (도입부 바로 아래에 위치):
## 이 글의 목차
1. [섹션명](#앵커)
2. [섹션명](#앵커)
...

목차가 있으면:
- 독자 이탈률 감소 (체류시간 증가 → SEO 상승)
- 스크롤 가이드 → 광고 노출 구간 자연스럽게 확보

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[3] 도입부 — 3문장 공식
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
반드시 이 순서로:
  1문장: 독자가 겪는 구체적인 고민/상황 (핵심 키워드 포함)
  2문장: 이 글의 결론을 먼저 (써볼 만한지 아닌지)
  3문장: 이 글에서 뭘 알 수 있는지

나쁜 예: "AI 도구가 점점 많아지고 있습니다. 오늘은 X를 소개합니다."
좋은 예: "ChatGPT 사용법을 찾고 있다면, 이 글 하나로 끝낼 수 있다. 무료 플랜만으로도 충분히 쓸 만하다는 게 직접 써본 결론이다. 가격, 한국어 지원, 실제 속도까지 테스트한 결과를 정리했다."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[4] 문장 규칙
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- 문장 하나 = 생각 하나
- "~하며, ~이고, ~인데" 연결 금지
- 문장 길이 40자 이내 권장
- 단락 = 최대 3문장, 단락 뒤 반드시 빈 줄

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[5] 소제목 규칙 — 훑어봐도 흐름이 잡혀야
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
나쁜 예: ## 5. 기타 특징
좋은 예: ## 한국어 지원은 아직 반쪽짜리다

H2 제목은 판단/결론형으로. H3는 구체적 기능명으로.
H2 제목에 핵심 키워드 또는 LSI 키워드 2개 이상 포함 필수.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[6] 시각적 리듬 — 텍스트·표·컴포넌트 교차
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
텍스트 3줄 → 리스트 또는 표 또는 컴포넌트 → 텍스트 3줄 패턴 반복.
한 H2 섹션 안에 텍스트만 5줄 이상 → 반드시 리스트/표로 분리.
이미지 대신 표(markdown table)로 데이터 시각화.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[7] 콘텐츠 분량 및 깊이 — 애드센스 승인 기준
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- 최소 5,000자 이상 (공백 포함). 얇은 글(thin content)은 애드센스 반려 원인.
- 각 H2 섹션은 최소 200자 이상의 실질적 내용 포함
- 단순 나열 금지. 각 항목마다 "왜 그런지" 근거 1~2문장 추가
- 구체적인 숫자와 비교 데이터 (예: "응답 시간 평균 3.2초")
- 장점만 나열 금지. 아쉬운 점/단점도 솔직하게 포함
- 결론에서 추천/비추천 명확히 (모호한 결론 금지)
- 가격: 달러($)와 원화(₩) 모두 표기
- 한국어 지원 여부 반드시 언급
- MDX 형식으로 출력. ---로 시작. \`\`\`mdx 블록 금지

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[8] 결론 섹션 — CTA가 있어야 이탈률이 낮아진다
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
결론은 반드시 이 구조로:
  1. 핵심 요약 (3문장 이내, 핵심 키워드 포함)
  2. 추천 대상 vs 비추천 대상 명확히
  3. 다음 행동 제안: "지금 바로 무료로 시작하려면 →", "더 자세한 비교는 →"

결론 없는 마무리 ("지켜봐야 할 것 같습니다" / "앞으로가 기대됩니다") 금지.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[9] MDX 컴포넌트 — 반드시 이 형식 그대로
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

FAQ 섹션 → FaqSection (반드시 7개 이상 질문 — FAQ가 많을수록 구글 리치 스니펫 노출 기회 증가):
<FaqSection items={[
  { q: "질문?", a: "답변. 최소 2문장 이상으로 충분히 설명." }
]} />

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[10] 절대 금지
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- "혁신적인", "획기적인", "필수 도구", "게임체인저", "강력한"
- 4문장 이상 단락
- ## 제목 바로 다음에 ## 제목 (내용 없이 연속)
- 얇은 섹션: H2 아래 3문장 미만의 내용
- 광고성 표현, 과장된 효능 주장 (애드센스 정책 위반)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[11] 정확도 규칙 — 가장 중요
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

새로 출시된 AI 도구 리뷰 블로그 글을 MDX 형식으로 작성하세요. 최소 5,000자 이상.

글 구조 (이 순서대로, 각 섹션 앞에 빈 줄 2개):
1. 도입 (2~3문장 단락 2개) — 핵심 키워드 포함, 독자 고민 → 한줄 결론
2. ## 이 글의 목차 — 번호 목록으로 전체 섹션 나열
3. ## 핵심 요약 — 불릿 리스트 (모델유형, 핵심기능, 가격, 대상, 한국어지원, 출시일)
4. ## [도구명]이란? — 개요 + 개발사 배경 + 경쟁 도구와의 차이 (300자 이상)
5. ## 핵심 기능 [번호]가지 — 각 기능은 ### 소제목 + 충분한 설명(200자 이상) + 표/리스트
6. ## 직접 써본 솔직한 후기 — 장점 3개 + 단점/아쉬운 점 2개 이상 (각 근거 포함)
7. ## 요금제 — PricingCard 컴포넌트 + 무료 한계·유료 가치 분석 텍스트
8. ## 이런 분께 추천합니다 / 이런 분께는 비추천 — 각 불릿 3~5개
9. ## 솔직한 평점 — ToolRating 컴포넌트
10. ## 자주 묻는 질문 — FaqSection 컴포넌트 (7개 이상, 각 답변 2문장 이상)
11. ## 결론 — 핵심 키워드 포함, 추천/비추천 명확히, 다음 행동 제안으로 마무리

frontmatter:
---
title: "[도구명] 직접 써봤다: [핵심 차별점 한 줄] (${today.slice(0,4)})"
slug: "[영문-소문자-하이픈]"
date: "${today}"
lastUpdated: "${today}"
postType: "NEW_TOOL_REVIEW"
category: "${category}"
tags: ["[도구명]", "[주요기능]", "[카테고리]", "[비교키워드]", "AI 도구 리뷰"]
tools: ["${tool.title}"]
seoKeyword: "[도구명] 리뷰 사용법 한국어 ${today.slice(0,4)}"
summary: "[핵심 키워드 포함, 120~155자, 행동 유도 문장으로 끝]"
coverImage: ""
faqEnabled: true
rating: [0~5 소수점1자리]
---`,

    VS_COMPARISON: `${base}
경쟁 도구: ${tool.competitors.slice(0, 2).join(', ')}

AI 도구 비교 분석 블로그 글을 MDX 형식으로 작성하세요. 최소 5,000자 이상.

글 구조:
1. 도입 (2~3문장) — 핵심 키워드 포함. "어떤 걸 써야 할지 고민이라면, 직접 비교했습니다"
2. ## 이 글의 목차 — 번호 목록
3. ## 한눈에 비교 — ComparisonTable 컴포넌트 (가격/기능/한국어/속도/무료한도 등 6항목 이상)
4. ## [도구A] 상세 분석 — 개요(100자) + 장점 3개(각 근거 포함) + 단점 2개 이상
5. ## [도구B] 상세 분석 — 개요(100자) + 장점 3개(각 근거 포함) + 단점 2개 이상
6. ## 실제 사용 시나리오별 추천 — 표로 정리 (학생/직장인/개발자/크리에이터/기업)
7. ## 가격 비교 — PricingCard 컴포넌트
8. ## 솔직한 평점 비교 — ToolRating 컴포넌트
9. ## 자주 묻는 질문 — FaqSection (7개 이상)
10. ## 최종 결론 — 핵심 키워드 포함, 상황별 추천 명확히, 다음 행동 제안

frontmatter:
---
title: "[도구A] vs [도구B] ${today.slice(0,4)} 비교 — [핵심 차이 한 줄]"
slug: "[slug]"
date: "${today}"
lastUpdated: "${today}"
postType: "VS_COMPARISON"
category: "${category}"
tags: ["[도구A]", "[도구B]", "AI 도구 비교", "[카테고리]", "${today.slice(0,4)}"]
tools: ["${tool.title}", "${tool.competitors[0] ?? ''}"]
seoKeyword: "${tool.title} vs ${tool.competitors[0] ?? ''} 비교 ${today.slice(0,4)}"
summary: "[핵심 키워드 포함, 120~155자, 어떤 상황에 누가 더 좋은지 결론 포함]"
coverImage: ""
faqEnabled: true
---`,

    PRICING_GUIDE: `${base}

AI 도구 가격 가이드 글을 MDX 형식으로 작성하세요. 최소 5,000자 이상.

글 구조:
1. 도입 — 핵심 키워드 포함, 가격 때문에 고민하는 독자 상황 (2~3문장)
2. ## 이 글의 목차 — 번호 목록
3. ## 전체 요금제 한눈에 보기 — PricingCard 컴포넌트
4. ## 무료 플랜으로 할 수 있는 것 vs 못 하는 것 — 표로 정리 (항목 6개 이상)
5. ## 유료 플랜 실제 가치 분석 — 월 사용량 기준 원가 계산 + 근거
6. ## 더 저렴한 대안 3가지 — 각 도구 소개 + 비교 요점
7. ## 예산별 추천 플랜 — 표 (월 $0 / $10 / $20 / $50+, 추천 대상 포함)
8. ## 할인·프로모션 받는 법 — 실용적인 팁 (연간 결제, 학생 할인 등)
9. ## 자주 묻는 질문 — FaqSection (7개 이상)
10. ## 결론 — 핵심 키워드 포함, 예산 상황별 명확한 추천

frontmatter:
---
title: "${tool.title} 요금제 완전 정리 ${today.slice(0,4)} — 무료로 얼마나 쓸 수 있나?"
slug: "[slug]"
date: "${today}"
lastUpdated: "${today}"
postType: "PRICING_GUIDE"
category: "${category}"
tags: ["${tool.title}", "AI 요금제", "가격 비교", "무료 AI", "${today.slice(0,4)}"]
tools: ["${tool.title}"]
seoKeyword: "${tool.title} 가격 요금제 ${today.slice(0,4)}"
summary: "[핵심 키워드 포함, 120~155자, 무료 한계와 유료 가치를 한 줄로 요약]"
coverImage: ""
faqEnabled: true
---`,

    UPDATE_SUMMARY: `${base}

AI 도구 업데이트 정리 글을 MDX 형식으로 작성하세요. 최소 5,000자 이상.

글 구조:
1. 도입 — 핵심 키워드 포함, "업데이트됐다. 뭐가 바뀐건지 빠르게 정리했다" (2~3문장)
2. ## 이 글의 목차 — 번호 목록
3. ## 이번 업데이트 핵심 변경사항 — 굵은 소제목(### ) + 각 200자 이상 설명
4. ## 이전 버전 vs 신버전 비교 — 표 (기능/이전/이후, 항목 6개 이상)
5. ## 기존 사용자에게 미치는 영향 — 구체적 시나리오로 설명
6. ## 신규 기능 바로 써보는 법 — 단계별 번호 가이드 (5단계 이상)
7. ## 업데이트 후 경쟁 도구와 비교 — ComparisonTable 컴포넌트
8. ## 업데이트 후 솔직한 평점 — ToolRating 컴포넌트
9. ## 자주 묻는 질문 — FaqSection (7개 이상)
10. ## 결론 — 핵심 키워드 포함, 업데이트 후 추천 여부 명확히

frontmatter:
---
title: "${tool.title} ${today.slice(0,4)} 업데이트 — 뭐가 달라졌나 직접 확인했다"
slug: "[slug]"
date: "${today}"
lastUpdated: "${today}"
postType: "UPDATE_SUMMARY"
category: "${category}"
tags: ["${tool.title}", "AI 업데이트", "신기능", "[카테고리]", "${today.slice(0,4)}"]
tools: ["${tool.title}"]
seoKeyword: "${tool.title} 업데이트 변경사항 ${today.slice(0,4)}"
summary: "[핵심 키워드 포함, 120~155자, 가장 중요한 변경점 한 줄 요약]"
coverImage: ""
faqEnabled: true
---`,

    HOW_TO_GUIDE: `${base}

AI 도구 활용법 가이드 글을 MDX 형식으로 작성하세요. 최소 5,000자 이상.

글 구조 (이 순서대로, 각 섹션 앞에 빈 줄 2개):
1. 도입 (2~3문장 단락 2개) — 핵심 키워드 포함, "직접 써보니 이렇더라" 솔직한 한 줄 결론 포함
2. ## 이 글의 목차 — 번호 목록으로 전체 섹션 나열
3. ## 시작 전 꼭 알아야 할 것 — 불릿 리스트 (준비물, 가격/무료 여부, 소요시간, 한국어 지원 여부)
4. ## [도구명] 기본 사용법 완전 정복 — 단계별 번호 가이드 (7단계 이상, 각 단계 2~3문장 + 팁)
5. ## 실전 활용 예시 — ### 직장인 활용법 / ### 학생 활용법 / ### 크리에이터 활용법 (각 200자 이상)
6. ## 초보자가 모르는 꿀 기능 5가지 — 각 ### 소제목 + 사용법 설명 (각 150자 이상)
7. ## 자주 하는 실수와 해결법 — 표 (실수 / 원인 / 해결법, 5행 이상)
8. ## [도구명] 무료로 최대한 활용하는 법 — 무료 한도 설명 + 절약 팁 3가지 이상
9. ## 솔직한 평점 — ToolRating 컴포넌트
10. ## 자주 묻는 질문 — FaqSection 컴포넌트 (7개 이상, 각 답변 2문장 이상)
11. ## 결론 — 핵심 키워드 포함, 어떤 사람에게 추천/비추천, 다음 행동 제안으로 마무리

frontmatter:
---
title: "${tool.title} 사용법 완전 정복 ${today.slice(0,4)} — 초보도 바로 써먹는 실전 가이드"
slug: "[slug]"
date: "${today}"
lastUpdated: "${today}"
postType: "HOW_TO_GUIDE"
category: "${category}"
tags: ["${tool.title}", "AI 사용법", "활용법", "[카테고리]", "${today.slice(0,4)}"]
tools: ["${tool.title}"]
seoKeyword: "${tool.title} 사용법 활용법 ${today.slice(0,4)}"
summary: "[핵심 키워드 포함, 120~155자, 이 가이드로 뭘 얻을 수 있는지 행동 유도 문장으로 끝]"
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
