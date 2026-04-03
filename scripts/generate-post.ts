#!/usr/bin/env npx tsx
/**
 * DOI 기반 논문 포스트 자동 생성 스크립트
 * 사용법: npx tsx scripts/generate-post.ts <DOI> <category>
 * 예시:   npx tsx scripts/generate-post.ts 10.1038/s41586-026-xxxxx organoid
 *
 * 필요한 환경변수:
 *   ANTHROPIC_API_KEY — Claude API 키
 */
import fs from 'fs';
import path from 'path';

const [, , doi, category = 'organoid'] = process.argv;

if (!doi) {
  console.error('사용법: npx tsx scripts/generate-post.ts <DOI> <category>');
  process.exit(1);
}

async function fetchPaperMeta(doi: string) {
  const url = `https://api.crossref.org/works/${encodeURIComponent(doi)}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'science-blog/1.0' } });
  if (!res.ok) throw new Error(`CrossRef API 오류: ${res.status}`);
  const data = await res.json();
  const work = data.message;
  return {
    title: (work.title?.[0] ?? '').replace(/\s+/g, ' ').trim(),
    abstract: (work.abstract ?? '').replace(/<[^>]+>/g, '').trim(),
    journal: work['container-title']?.[0] ?? '',
    authors: (work.author ?? []).map((a: { given?: string; family?: string }) => `${a.given ?? ''} ${a.family ?? ''}`.trim()),
    date: work.published?.['date-parts']?.[0]?.join('-') ?? new Date().toISOString().slice(0, 10),
  };
}

async function callClaude(prompt: string, model = 'claude-sonnet-4-6', maxTokens = 2000): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ model, max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] }),
  });
  if (!res.ok) { console.warn('Claude API 오류'); return null; }
  const data = await res.json();
  return data.content?.[0]?.text ?? null;
}

async function generateKoreanTitle(englishTitle: string, abstract: string): Promise<string> {
  const result = await callClaude(`다음 생명과학 논문 제목을 한국어로 번역해줘.

규칙:
- 직역 말고, 블로그 독자가 흥미를 느낄 수 있는 자연스러운 한국어 제목
- 전문 용어는 한국어로 풀어서 설명
- 20~40자 이내
- 제목만 출력 (따옴표, 설명 없이)

영문 제목: ${englishTitle}
초록 요약: ${abstract.slice(0, 300)}`, 'claude-haiku-4-5-20251001', 100);
  return result?.trim() ?? englishTitle;
}

async function generateKoreanSummary(abstract: string): Promise<string> {
  const result = await callClaude(`다음 생명과학 논문 초록을 한국어로 1~2문장으로 요약해줘.
독자가 바로 이해할 수 있게 쉽게. 요약문만 출력.

${abstract.slice(0, 800)}`, 'claude-haiku-4-5-20251001', 150);
  return result?.trim().replace(/"/g, "'") ?? '';
}

async function generatePostContent(meta: { title: string; abstract: string; journal: string; doi: string; category: string }) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('ANTHROPIC_API_KEY 없음 — 기본 템플릿 사용');
    return null;
  }
  return callClaude(`다음 생명과학 논문을 한국어로 블로그 포스트로 작성해줘.

논문 제목: ${meta.title}
저널: ${meta.journal}
초록: ${meta.abstract}

다음 형식으로 MDX 본문만 작성해줘 (프론트매터 제외):

## 왜 중요한가?
(2~3문단)

## 연구 방법
(간략히)

## 핵심 발견
(bullet 포함)

## 우리 삶에 미치는 영향
(2~3문장)

규칙:
- 고등학생도 이해할 수 있는 쉬운 한국어
- 전문 용어에는 괄호로 설명 추가
- 각 섹션 200자 이상
- highlight-box 컴포넌트 1개 포함 (핵심 발견 강조)`);
}

async function generateEasyBody(title: string, content: string): Promise<string | null> {
  return callClaude(`아래 생명과학 논문 해설을 '쉬운 버전'으로 다시 써줘.

조건:
- AI 느낌 전혀 없이, 친한 친구가 설명해주는 것처럼 자연스럽게
- "~입니다" 대신 "~거예요", "~이에요", "~죠" 같은 친근한 말투
- 어려운 용어는 일상적인 비유로 설명
- 독자한테 말 거는 듯한 자연스러운 흐름
- 섹션 구조 유지, 제목도 쉽고 재밌게 변경
- 마크다운 형식 유지
- **중요: HTML이나 JSX 태그 절대 사용 금지. 순수 마크다운만 사용.**

논문 제목: ${title}

원본 내용:
${content.slice(0, 3000)}`, 'claude-haiku-4-5-20251001', 2000);
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

async function main() {
  console.log(`📄 논문 메타데이터 가져오는 중: ${doi}`);
  const meta = await fetchPaperMeta(doi);
  console.log(`✅ 제목: ${meta.title}`);

  console.log('🤖 Claude로 포스트 생성 중...');
  const [content, koreanTitle, koreanSummary] = await Promise.all([
    generatePostContent({ ...meta, doi, category }),
    generateKoreanTitle(meta.title, meta.abstract),
    generateKoreanSummary(meta.abstract),
  ]);
  console.log(`✅ 한국어 제목: ${koreanTitle}`);

  const today = new Date().toISOString().slice(0, 10);
  const slug = `${today}-${slugify(meta.title)}`;
  const filename = `${slug}.mdx`;

  const body = content ?? `## 왜 중요한가?\n\n${meta.abstract}\n\n## 핵심 발견\n\n(내용을 여기에 작성하세요)\n`;

  const mdx = `---
title: "${koreanTitle}"
slug: "${slug}"
date: "${today}"
category: "${category}"
tags: []
summary: "${koreanSummary || meta.abstract.slice(0, 200).replace(/"/g, "'")}"
paperDOI: "${doi}"
journal: "${meta.journal}"
difficulty: "입문"
coverImage: ""
---

${body}

<div className="cite-box">
  📄 원문: ${meta.authors.slice(0, 3).join(', ')} et al., "${meta.title}", *${meta.journal}*, ${meta.date}. DOI: ${doi}
</div>
`;

  const outPath = path.join(process.cwd(), 'content/posts', filename);
  fs.writeFileSync(outPath, mdx, 'utf-8');
  console.log(`\n✅ 포스트 생성 완료: content/posts/${filename}`);

  console.log('😊 쉬운 버전 생성 중...');
  const easy = await generateEasyBody(meta.title, body);
  if (easy) {
    const easyDir = path.join(process.cwd(), 'content/easy');
    if (!fs.existsSync(easyDir)) fs.mkdirSync(easyDir, { recursive: true });
    fs.writeFileSync(path.join(easyDir, `${slug}.md`), easy, 'utf-8');
    console.log(`✅ 쉬운 버전 생성 완료: content/easy/${slug}.md`);
  }
}

main().catch((e) => { console.error('오류:', e.message); process.exit(1); });
