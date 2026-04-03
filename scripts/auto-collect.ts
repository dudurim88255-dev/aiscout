#!/usr/bin/env npx tsx
/**
 * 논문 자동 수집 + 포스트 생성 스크립트
 * GitHub Actions에서 6시간마다 실행됨
 *
 * 환경변수: ANTHROPIC_API_KEY
 */
import fs from 'fs';
import path from 'path';

const MAX_POSTS_PER_RUN = 2;

const SEARCH_QUERIES = [
  { query: 'organoid cancer drug resistance', category: 'organoid' },
  { query: 'aging epigenetics longevity senescence', category: 'anti-aging' },
  { query: 'CRISPR base editing prime editing gene therapy', category: 'genomics' },
  { query: 'stem cell reprogramming iPSC therapy', category: 'stem-cell' },
  { query: 'AI drug discovery protein structure', category: 'drug-discovery' },
  { query: 'brain organoid neural circuit autism alzheimer', category: 'neuroscience' },
];

// 고영향 저널 ISSN (Nature, Science, Cell, Nature Medicine 등)
const JOURNAL_ISSNS = [
  '0028-0836', // Nature
  '0036-8075', // Science
  '0092-8674', // Cell
  '1078-8956', // Nature Medicine
  '1087-0156', // Nature Biotechnology
  '1465-7392', // Nature Cell Biology
];

// ── 유틸 ──────────────────────────────────────────────────────────────────────

function getFromDate(daysAgo = 90): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

function getExistingDOIs(): Set<string> {
  const postsDir = path.join(process.cwd(), 'content/posts');
  const dois = new Set<string>();
  if (!fs.existsSync(postsDir)) return dois;

  for (const file of fs.readdirSync(postsDir).filter(f => f.endsWith('.mdx'))) {
    const text = fs.readFileSync(path.join(postsDir, file), 'utf-8');
    const m = text.match(/^paperDOI:\s*"([^"]+)"/m);
    if (m) dois.add(m[1].toLowerCase());
  }
  return dois;
}

// ── API 호출 ──────────────────────────────────────────────────────────────────

async function searchCrossRef(query: string, issn: string): Promise<any[]> {
  const fromDate = getFromDate(90);
  const url = `https://api.crossref.org/works?query=${encodeURIComponent(query)}&filter=from-pub-date:${fromDate},type:journal-article,has-abstract:true,issn:${issn}&rows=3&select=DOI,title,abstract,published,author,container-title&sort=score`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'science-blog/1.0' } });
    if (!res.ok) return [];
    const data: any = await res.json();
    return data.message?.items ?? [];
  } catch {
    return [];
  }
}

async function callClaude(prompt: string, maxTokens = 150): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) { console.warn('ANTHROPIC_API_KEY 없음'); return null; }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) return null;
  const data: any = await res.json();
  return data.content?.[0]?.text?.trim() ?? null;
}

async function generateKoreanTitle(englishTitle: string, abstract: string): Promise<string> {
  const result = await callClaude(
    `생명과학 논문 제목을 한국어로 번역. 블로그 독자가 흥미를 느낄 자연스러운 표현으로. 20~40자. 제목만 출력.\n\n영문: ${englishTitle}\n초록: ${abstract.slice(0, 200)}`,
    80,
  );
  return result ?? englishTitle;
}

async function generateKoreanSummary(abstract: string): Promise<string> {
  const result = await callClaude(
    `다음 논문 초록을 한국어로 1~2문장 요약. 쉽게. 요약문만 출력.\n\n${abstract.slice(0, 600)}`,
    150,
  );
  return result?.replace(/"/g, "'") ?? '';
}

async function generatePostBody(englishTitle: string, abstract: string, journal: string): Promise<string> {
  const result = await callClaude(
    `다음 생명과학 논문을 한국어 블로그 포스트로 작성. MDX 본문만 (프론트매터 제외).

논문: ${englishTitle}
저널: ${journal}
초록: ${abstract}

형식:
## 왜 중요한가?
(2~3문단, 고등학생도 이해 가능, 전문용어 괄호 설명)

## 연구 방법
(간략히)

## 핵심 발견
- bullet 3~5개

## 우리 삶에 미치는 영향
(2~3문장)

<div className="highlight-box">핵심 한 줄 요약</div>`,
    2000,
  );
  return result ?? `## 왜 중요한가?\n\n${abstract}\n`;
}

async function generateEasyBody(koreanTitle: string, body: string): Promise<string> {
  const result = await callClaude(
    `아래 논문 해설을 친구한테 설명하듯 쉬운 버전으로 써줘. "~거예요", "~이에요" 말투. HTML/JSX 태그 금지, 마크다운만.\n\n제목: ${koreanTitle}\n\n${body.slice(0, 2000)}`,
    1500,
  );
  return result ?? body;
}

// ── 포스트 저장 ───────────────────────────────────────────────────────────────

async function savePost(paper: any, category: string): Promise<string> {
  const doi = paper.DOI as string;
  const englishTitle = ((paper.title?.[0] ?? '') as string).replace(/\s+/g, ' ').trim();
  const abstract = ((paper.abstract ?? '') as string).replace(/<[^>]+>/g, '').trim();
  const journal = (paper['container-title']?.[0] ?? '') as string;
  const authors = ((paper.author ?? []) as any[])
    .slice(0, 3)
    .map((a) => `${a.given ?? ''} ${a.family ?? ''}`.trim());
  const pubDate = (paper.published?.['date-parts']?.[0] as number[] | undefined)?.join('-')
    ?? new Date().toISOString().slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);

  const [koreanTitle, koreanSummary, body] = await Promise.all([
    generateKoreanTitle(englishTitle, abstract),
    generateKoreanSummary(abstract),
    generatePostBody(englishTitle, abstract, journal),
  ]);

  const slug = `${today}-${slugify(englishTitle)}`;

  const mdx = `---
title: "${koreanTitle}"
slug: "${slug}"
date: "${today}"
category: "${category}"
tags: []
summary: "${koreanSummary}"
paperDOI: "${doi}"
journal: "${journal}"
difficulty: "입문"
coverImage: ""
---

${body}

<div className="cite-box">
  📄 원문: ${authors.join(', ')} et al., "${englishTitle}", *${journal}*, ${pubDate}. DOI: ${doi}
</div>
`;

  const postsDir = path.join(process.cwd(), 'content/posts');
  fs.writeFileSync(path.join(postsDir, `${slug}.mdx`), mdx, 'utf-8');

  const easy = await generateEasyBody(koreanTitle, body);
  const easyDir = path.join(process.cwd(), 'content/easy');
  if (!fs.existsSync(easyDir)) fs.mkdirSync(easyDir, { recursive: true });
  fs.writeFileSync(path.join(easyDir, `${slug}.md`), easy, 'utf-8');

  return `${slug} [${category}]`;
}

// ── 메인 ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔍 논문 자동 수집 시작...\n');

  const existingDOIs = getExistingDOIs();
  console.log(`📚 기존 포스트 ${existingDOIs.size}개 확인\n`);

  const candidates: { paper: any; category: string }[] = [];

  for (const { query, category } of SEARCH_QUERIES) {
    for (const issn of JOURNAL_ISSNS.slice(0, 2)) {
      const papers = await searchCrossRef(query, issn);
      for (const paper of papers) {
        const doi = (paper.DOI as string | undefined)?.toLowerCase();
        if (!doi || existingDOIs.has(doi)) continue;
        if (!paper.abstract || !paper.title?.[0]) continue;
        existingDOIs.add(doi);
        candidates.push({ paper, category });
      }
    }
    if (candidates.length >= MAX_POSTS_PER_RUN * 3) break;
  }

  if (candidates.length === 0) {
    console.log('✅ 새 논문 없음. 종료.');
    return;
  }

  console.log(`📄 후보 ${candidates.length}개 → 상위 ${MAX_POSTS_PER_RUN}개 처리\n`);

  const results: string[] = [];
  for (const { paper, category } of candidates.slice(0, MAX_POSTS_PER_RUN)) {
    try {
      const slug = await savePost(paper, category);
      results.push(slug);
      console.log(`✅ 생성: ${slug}`);
    } catch (e: any) {
      console.warn(`⚠️ 실패 (${paper.DOI}): ${e.message}`);
    }
  }

  console.log(`\n🎉 완료: ${results.length}개\n${results.join('\n')}`);
}

main().catch((e) => { console.error('오류:', e.message); process.exit(1); });
