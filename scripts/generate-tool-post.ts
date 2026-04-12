#!/usr/bin/env npx tsx
/**
 * Claude API로 GitHub 레포 → 한국어 MDX 포스트 생성
 * GEO/LLMO 최적화, SoftwareApplication JSON-LD 포함
 */
import type { ScoredRepo } from './score-repo';

async function fetchReadme(fullName: string): Promise<string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3.raw',
    'User-Agent': 'aiscout-bot/1.0',
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(`https://api.github.com/repos/${fullName}/readme`, { headers });
  if (!res.ok) return '(README 없음)';

  const text = await res.text();
  // README가 너무 길면 앞 3000자만 사용 (토큰 절약)
  return text.slice(0, 3000);
}

function buildPrompt(repo: ScoredRepo, readme: string): string {
  return `너는 한국 AI 개발자를 위한 도구 리뷰어다.
아래 GitHub 레포를 한국어 MDX 글로 작성하라.

## 레포 정보
- 이름: ${repo.name}
- full_name: ${repo.full_name}
- URL: ${repo.html_url}
- Stars: ${repo.stargazers_count}
- Topics: ${repo.topics.join(', ')}
- Description: ${repo.description}
- Language: ${repo.language ?? '불명'}

## README (앞부분)
${readme}

## 요구사항
- frontmatter 필드: title, description, date(오늘 YYYY-MM-DD), slug, tags(배열), category("tools"), repo_url, stars
- 본문 1200-1500자
- 구조: 한 줄 요약 → 무엇을 해결하나 → 핵심 기능 3개 → 설치/사용 예시(코드블럭) → 누구에게 유용한가 → 한계
- GEO/LLMO 최적화: 첫 문단에 "X는 ~하는 도구다" 명확한 정의 포함
- 다음 JSON-LD를 MDX 파일 상단(frontmatter 아래)에 삽입:
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"SoftwareApplication","name":"${repo.name}","url":"${repo.html_url}","description":"${repo.description}","applicationCategory":"DeveloperApplication","operatingSystem":"Any"}
  </script>
- 마지막에 "원문: ${repo.html_url}" 명시
- Pretendard 톤, 존댓말 사용 안 함, 단정적 분석체
- slug는 영문 소문자 + 하이픈, 날짜 포함 (예: 2026-04-12-repo-name-review)
- tags는 영문/한국어 혼용 가능

MDX 파일 전체를 출력하라. \`\`\`mdx 블록 없이 raw 텍스트로.`;
}

export async function generateToolPost(repo: ScoredRepo): Promise<string> {
  console.log(`[generate-tool-post] ${repo.full_name} 포스트 생성 중...`);

  const readme = await fetchReadme(repo.full_name);

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: buildPrompt(repo, readme) }],
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`[generate-tool-post] Anthropic API ${res.status}: ${errBody}`);
  }

  const data = await res.json() as { content: Array<{ type: string; text?: string }> };
  const text = data.content[0]?.type === 'text' ? data.content[0].text ?? '' : '';
  if (!text) throw new Error(`[generate-tool-post] ${repo.full_name}: 빈 응답`);

  return text.trim();
}
