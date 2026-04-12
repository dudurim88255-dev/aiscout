#!/usr/bin/env npx tsx
/**
 * 레포 필터링 + 점수 계산
 * score = stars_velocity * 0.6 + topic_match * 0.4
 */
import fs from 'fs';
import path from 'path';
import type { GitHubRepo } from './fetch-trending';

const SEEN_REPOS_PATH = path.join(process.cwd(), 'data', 'seen-repos.json');
const AI_TOPICS = new Set(['ai', 'llm', 'agent', 'mcp', 'claude', 'gpt', 'rag', 'prompt', 'embedding']);

export interface ScoredRepo extends GitHubRepo {
  score: number;
  ageHours: number;
}

function loadSeenRepos(): Set<number> {
  if (!fs.existsSync(SEEN_REPOS_PATH)) return new Set();
  try {
    const raw = fs.readFileSync(SEEN_REPOS_PATH, 'utf-8');
    const ids = JSON.parse(raw) as number[];
    return new Set(ids);
  } catch {
    return new Set();
  }
}

function saveSeenRepo(id: number): void {
  const seen = loadSeenRepos();
  seen.add(id);
  fs.mkdirSync(path.dirname(SEEN_REPOS_PATH), { recursive: true });
  fs.writeFileSync(SEEN_REPOS_PATH, JSON.stringify([...seen], null, 2));
}

function calcAgeHours(createdAt: string): number {
  const ms = Date.now() - new Date(createdAt).getTime();
  return ms / (1000 * 60 * 60);
}

function calcScore(repo: GitHubRepo, ageHours: number): number {
  // stars velocity: 시간당 별 수
  const velocity = repo.stargazers_count / Math.max(ageHours, 1);
  // velocity를 0-10 범위로 정규화 (10 stars/hour = 만점)
  const velocityScore = Math.min(velocity / 10, 1) * 10;

  // topic match: AI 관련 토픽 개수
  const matchCount = repo.topics.filter(t => AI_TOPICS.has(t)).length;
  const topicScore = Math.min(matchCount / 3, 1) * 10;

  return velocityScore * 0.6 + topicScore * 0.4;
}

export function scoreAndFilter(repos: GitHubRepo[], topN = 5): ScoredRepo[] {
  const seen = loadSeenRepos();

  const candidates = repos.filter(repo => {
    // 이미 처리한 레포 제외
    if (seen.has(repo.id)) return false;
    // stars 범위 필터
    if (repo.stargazers_count < 50 || repo.stargazers_count > 50000) return false;
    // description 없으면 제외 (리뷰 쓰기 어려움)
    if (!repo.description?.trim()) return false;
    // AI 관련 토픽이 1개 이상 있어야 함
    const hasAiTopic = repo.topics.some(t => AI_TOPICS.has(t));
    if (!hasAiTopic) return false;
    return true;
  });

  const scored: ScoredRepo[] = candidates.map(repo => {
    const ageHours = calcAgeHours(repo.created_at);
    return { ...repo, score: calcScore(repo, ageHours), ageHours };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, topN);

  console.log(`[score-repo] 후보 ${candidates.length}개 중 상위 ${top.length}개 선택`);
  top.forEach(r => console.log(`  ${r.full_name} | stars:${r.stargazers_count} | score:${r.score.toFixed(2)}`));

  return top;
}

export { saveSeenRepo };
