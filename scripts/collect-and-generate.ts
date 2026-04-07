#!/usr/bin/env npx tsx
/**
 * aiscout 자동 포스트 생성 스크립트
 * 사용법: npx tsx scripts/collect-and-generate.ts
 * GitHub Actions가 매일 09:00 KST에 자동 실행
 */
import fs from 'fs';
import path from 'path';
import { collectTopItems } from './rss-collector';
import { generatePost } from './post-generator';
import { runQualityCheck } from './quality-checker';
import { insertAffiliateLinks, AFFILIATE_MAP } from '../lib/affiliate';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

function extractFrontmatterAndContent(mdx: string): { frontmatter: string; content: string } {
  const match = mdx.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: '', content: mdx };
  return { frontmatter: match[1], content: match[2] };
}

function extractField(frontmatter: string, field: string): string {
  const match = frontmatter.match(new RegExp(`^${field}:\\s*"?([^"\\n]+)"?`, 'm'));
  return match?.[1]?.trim() ?? '';
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

// 최근 N일 이내에 같은 주제(RSS 타이틀 키워드)로 쓴 포스트가 있는지 확인
function isTopicAlreadyWritten(toolTitle: string, recentDays = 7): boolean {
  if (!fs.existsSync(POSTS_DIR)) return false;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - recentDays);

  const keywords = toolTitle
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 3)
    .slice(0, 3);

  return fs.readdirSync(POSTS_DIR).some(file => {
    const dateStr = file.slice(0, 10); // YYYY-MM-DD
    if (new Date(dateStr) < cutoff) return false;
    const lower = file.toLowerCase();
    return keywords.every(k => lower.includes(k));
  });
}

async function processOneTool(toolData: Awaited<ReturnType<typeof collectTopItems>>[number]): Promise<boolean> {
  console.log(`\n📌 처리 중: ${toolData.title} (${toolData.postType})`);

  // 최근 14일 내 같은 주제 포스트가 있으면 바로 건너뜀
  if (isTopicAlreadyWritten(toolData.title)) {
    console.log('  ⏭️ 최근 14일 내 같은 주제 포스트 존재 — 건너뜀');
    return false;
  }

  let mdxContent = await generatePost(toolData);
  if (!mdxContent.trim()) {
    console.warn('  ⚠️ 빈 응답 — 건너뜀');
    return false;
  }

  // 코드 블록 래핑 제거 (```mdx ... ``` 또는 ``` ... ```)
  mdxContent = mdxContent.replace(/^```[a-z]*\n/, '').replace(/\n```\s*$/, '');

  const { frontmatter, content } = extractFrontmatterAndContent(mdxContent);
  const contentWithLinks = insertAffiliateLinks(content, AFFILIATE_MAP);
  mdxContent = `---\n${frontmatter}\n---\n${contentWithLinks}`;

  const title = extractField(frontmatter, 'title');
  const slug = extractField(frontmatter, 'slug') || slugify(toolData.title);
  const seoKeyword = extractField(frontmatter, 'seoKeyword');

  const quality = runQualityCheck({ title, content: contentWithLinks, slug, seoKeyword });

  if (!quality.passed) {
    const isDuplicate = quality.reasons.some(r => r.includes('중복'));
    if (isDuplicate) {
      console.log(`  ⏭️ 중복 슬러그 감지 — 건너뜀`);
      return false;
    }
    console.log(`  ❌ 품질 체크 실패: ${quality.reasons.join(', ')}`);
    console.log('  🔄 재생성 시도...');
    mdxContent = await generatePost(toolData);
    mdxContent = mdxContent.replace(/^```[a-z]*\n/, '').replace(/\n```\s*$/, '');
  }

  const today = new Date().toISOString().slice(0, 10);
  const filename = `${today}-${slug}.mdx`;
  const outPath = path.join(POSTS_DIR, filename);

  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }

  fs.writeFileSync(outPath, mdxContent, 'utf-8');
  console.log(`  ✅ 저장 완료: content/posts/${filename}`);
  return true;
}

const TARGET_POSTS = 1; // 1회 실행당 최고 포스트 1개 (하루 2회 실행 = 일 2개)

async function main() {
  console.log('🤖 aiscout 자동 포스트 생성 시작');
  console.log(`📅 날짜: ${new Date().toISOString()}`);

  console.log('\n📡 RSS 수집 중...');
  // 중복 제외 후에도 TARGET_POSTS 확보를 위해 후보 풀을 넓게 수집
  const candidates = await collectTopItems(30);

  if (candidates.length === 0) {
    console.log('수집된 아이템 없음 — 종료');
    process.exit(0);
  }

  console.log(`✅ ${candidates.length}개 후보 수집 완료`);

  let successCount = 0;
  for (const item of candidates) {
    if (successCount >= TARGET_POSTS) break;
    const success = await processOneTool(item);
    if (success) successCount++;
  }

  console.log(`\n🎉 완료: ${successCount}/${TARGET_POSTS}개 포스트 생성`);
}

main().catch(e => {
  console.error('오류:', e.message);
  process.exit(1);
});
