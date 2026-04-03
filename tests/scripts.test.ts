import { describe, it, expect } from 'vitest';
import { decidePostType } from '../scripts/rss-collector.ts';
import { checkLength, checkSeoKeyword } from '../scripts/quality-checker.ts';
import { insertAffiliateLinks } from '../lib/affiliate.ts';

describe('decidePostType', () => {
  it('7일 이내 신규 도구 → NEW_TOOL_REVIEW', () => {
    expect(decidePostType({ daysSinceLaunch: 3, competitors: [], priceChanged: false, hasUpdate: false }))
      .toBe('NEW_TOOL_REVIEW');
  });
  it('경쟁 도구 2개+ → VS_COMPARISON', () => {
    expect(decidePostType({ daysSinceLaunch: 30, competitors: ['A', 'B'], priceChanged: false, hasUpdate: false }))
      .toBe('VS_COMPARISON');
  });
  it('가격 변동 → PRICING_GUIDE', () => {
    expect(decidePostType({ daysSinceLaunch: 30, competitors: ['A'], priceChanged: true, hasUpdate: false }))
      .toBe('PRICING_GUIDE');
  });
  it('업데이트 → UPDATE_SUMMARY', () => {
    expect(decidePostType({ daysSinceLaunch: 30, competitors: [], priceChanged: false, hasUpdate: true }))
      .toBe('UPDATE_SUMMARY');
  });
  it('기본값 → HOW_TO_GUIDE', () => {
    expect(decidePostType({ daysSinceLaunch: 30, competitors: [], priceChanged: false, hasUpdate: false }))
      .toBe('HOW_TO_GUIDE');
  });
});

describe('checkLength', () => {
  it('3000자 이상은 통과', () => expect(checkLength('가'.repeat(3000))).toBe(true));
  it('2999자는 실패', () => expect(checkLength('가'.repeat(2999))).toBe(false));
});

describe('checkSeoKeyword', () => {
  it('제목에 키워드 있으면 통과', () => {
    expect(checkSeoKeyword('ChatGPT vs Claude 비교 2026', 'chatgpt')).toBe(true);
  });
  it('키워드 없으면 실패', () => {
    expect(checkSeoKeyword('AI 도구 사용법', 'chatgpt vs claude')).toBe(false);
  });
  it('키워드 빈 문자열이면 통과', () => {
    expect(checkSeoKeyword('아무 제목', '')).toBe(true);
  });
});

describe('insertAffiliateLinks', () => {
  it('첫 번째 언급에만 링크 삽입', () => {
    const result = insertAffiliateLinks('Claude는 좋습니다.', { 'Claude': 'https://claude.ai' });
    expect(result).toContain('[Claude](https://claude.ai)');
  });
  it('이미 링크된 텍스트는 변경 안 함', () => {
    const content = '[Claude](https://other.com) 사용법';
    expect(insertAffiliateLinks(content, { 'Claude': 'https://claude.ai' })).toBe(content);
  });
});
