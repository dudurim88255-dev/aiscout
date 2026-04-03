import { describe, it, expect } from 'vitest';

// ComparisonTable 유틸
function getRecommendedIndex(tools: string[], recommended: string): number {
  return tools.indexOf(recommended);
}

// ToolRating 유틸
function ratingToColor(rating: number): string {
  if (rating >= 4.5) return '#10b981';
  if (rating >= 3.5) return '#f59e0b';
  return '#ef4444';
}

// affiliate 링크 삽입
function insertAffiliateLinks(content: string, affiliateMap: Record<string, string>): string {
  let result = content;
  for (const [tool, link] of Object.entries(affiliateMap)) {
    const regex = new RegExp(`(?<!\\[)\\b${tool}\\b(?!\\])(?!\\()`, '');
    result = result.replace(regex, `[${tool}](${link})`);
  }
  return result;
}

describe('ComparisonTable 유틸', () => {
  it('추천 도구 인덱스를 올바르게 반환한다', () => {
    expect(getRecommendedIndex(['ChatGPT', 'Claude', 'Gemini'], 'Claude')).toBe(1);
  });
  it('없는 도구는 -1을 반환한다', () => {
    expect(getRecommendedIndex(['ChatGPT', 'Claude'], 'Gemini')).toBe(-1);
  });
});

describe('ToolRating 유틸', () => {
  it('4.5 이상은 초록색', () => expect(ratingToColor(4.8)).toBe('#10b981'));
  it('3.5~4.4는 앰버색', () => expect(ratingToColor(4.2)).toBe('#f59e0b'));
  it('3.5 미만은 빨간색', () => expect(ratingToColor(2.0)).toBe('#ef4444'));
});

describe('affiliate 링크 삽입', () => {
  const map = { 'ChatGPT': 'https://chat.openai.com' };
  it('첫 번째 언급에 링크 삽입', () => {
    const result = insertAffiliateLinks('ChatGPT는 좋습니다.', map);
    expect(result).toContain('[ChatGPT](https://chat.openai.com)');
  });
  it('이미 링크된 텍스트는 변경 안 함', () => {
    const content = '[ChatGPT](https://other.com) 사용법';
    expect(insertAffiliateLinks(content, map)).toBe(content);
  });
});
