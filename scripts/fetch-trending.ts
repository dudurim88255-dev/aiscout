#!/usr/bin/env npx tsx
/**
 * GitHub Search API로 최근 7일 내 급상승 AI 레포 수집
 * topics: ai, llm, agent, mcp, claude, gpt, rag, prompt, embedding
 */

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  topics: string[];
  language: string | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  readme?: string;
}

const AI_TOPICS = ['ai', 'llm', 'agent', 'mcp', 'claude', 'gpt', 'rag', 'prompt', 'embedding'];
const FETCH_LIMIT = 30;

function getSevenDaysAgo(): string {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString().slice(0, 10);
}

async function searchRepos(topic: string, since: string): Promise<GitHubRepo[]> {
  const query = encodeURIComponent(`topic:${topic} stars:>50 created:>${since}`);
  const url = `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=10`;

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'aiscout-bot/1.0',
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) {
    console.warn(`[fetch-trending] GitHub API ${res.status} for topic:${topic}`);
    return [];
  }

  const data = await res.json() as { items?: GitHubRepo[] };
  return data.items ?? [];
}

export async function fetchTrendingRepos(): Promise<GitHubRepo[]> {
  const since = getSevenDaysAgo();
  console.log(`[fetch-trending] 검색 기준일: ${since}`);

  const results = await Promise.all(
    AI_TOPICS.map(topic => searchRepos(topic, since))
  );

  // 중복 제거 (id 기준)
  const seen = new Set<number>();
  const unique: GitHubRepo[] = [];
  for (const repo of results.flat()) {
    if (!seen.has(repo.id)) {
      seen.add(repo.id);
      unique.push(repo);
    }
  }

  // stars 내림차순 정렬 후 상위 30개
  unique.sort((a, b) => b.stargazers_count - a.stargazers_count);
  const top = unique.slice(0, FETCH_LIMIT);

  console.log(`[fetch-trending] 수집 완료: ${top.length}개 레포`);
  return top;
}
