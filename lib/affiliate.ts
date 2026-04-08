export const AFFILIATE_MAP: Record<string, string> = {
  'ChatGPT': 'https://chat.openai.com',
  'Claude': 'https://claude.ai',
  'Gemini': 'https://gemini.google.com',
  'Midjourney': 'https://midjourney.com',
  'Cursor': 'https://cursor.com',
  'Perplexity': 'https://perplexity.ai',
  'Runway': 'https://runwayml.com',
  'Notion AI': 'https://notion.so',
  'GitHub Copilot': 'https://github.com/features/copilot',
  'Kling': 'https://klingai.com',
  'Sora': 'https://sora.com',
  'DALL-E': 'https://labs.openai.com',
  'Stable Diffusion': 'https://stability.ai',
  'Replit': 'https://replit.com',
};

export function insertAffiliateLinks(
  content: string,
  affiliateMap: Record<string, string> = AFFILIATE_MAP
): string {
  let result = content;
  for (const [tool, link] of Object.entries(affiliateMap)) {
    // 이미 마크다운 링크 안에 있는 텍스트는 건드리지 않음
    const regex = new RegExp(`(?<!\\[)\\b${tool}\\b(?!\\])(?!\\()`, 'g');
    result = result.replace(regex, `[${tool}](${link})`);
  }
  return result;
}
