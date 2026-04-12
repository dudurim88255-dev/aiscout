#!/usr/bin/env npx tsx
/**
 * AI 도구 큐레이션 오케스트레이터
 * fetch-trending → score-repo → generate-tool-post → MDX 저장
 * 사용법: npx tsx scripts/curate.ts
 * GitHub Actions: .github/workflows/curate-tools.yml (매일 KST 07:00)
 */
import fs from 'fs';
import path from 'path';
import { fetchTrendingRepos } from './fetch-trending';
import { scoreAndFilter, saveSeenRepo } from './score-repo';
import { generateToolPost } from './generate-tool-post';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts', 'tools');
const TARGET_POSTS = 1; // 하루 1개 (충분한 품질 유지)

function extractSlug(mdx: string): string {
  const match = mdx.match(/^slug:\s*"?([^"\n]+)"?/m);
  return match?.[1]?.trim() ?? `tool-${Date.now()}`;
}

async function run(): Promise<void> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[curate] ANTHROPIC_API_KEY 환경변수가 없습니다.');
    process.exit(1);
  }

  fs.mkdirSync(POSTS_DIR, { recursive: true });

  // 1. GitHub Trending 수집
  console.log('[curate] GitHub Trending 수집 시작...');
  const repos = await fetchTrendingRepos();

  if (repos.length === 0) {
    console.log('[curate] 수집된 레포 없음. 종료.');
    return;
  }

  // 2. 점수 계산 및 필터링
  const topRepos = scoreAndFilter(repos, TARGET_POSTS * 3); // 여유분 3배 확보

  if (topRepos.length === 0) {
    console.log('[curate] 새로운 후보 레포 없음. 종료.');
    return;
  }

  // 3. 상위 TARGET_POSTS개 MDX 생성
  let published = 0;
  for (const repo of topRepos) {
    if (published >= TARGET_POSTS) break;

    try {
      const mdx = await generateToolPost(repo);
      const slug = extractSlug(mdx);
      const filename = `${slug}.mdx`;
      const filepath = path.join(POSTS_DIR, filename);

      fs.writeFileSync(filepath, mdx, 'utf-8');
      saveSeenRepo(repo.id);

      console.log(`[curate] ✅ 저장 완료: ${filename}`);
      published++;

      // API rate limit 방지: 레포 간 2초 대기
      if (published < TARGET_POSTS) {
        await new Promise(r => setTimeout(r, 2000));
      }
    } catch (err) {
      console.error(`[curate] ❌ ${repo.full_name} 실패:`, err);
      // 한 레포 실패해도 다음 레포 시도
    }
  }

  console.log(`[curate] 완료. ${published}개 포스트 발행.`);
}

run();
