export type PostType = 'NEW_TOOL_REVIEW' | 'VS_COMPARISON' | 'PRICING_GUIDE' | 'UPDATE_SUMMARY' | 'HOW_TO_GUIDE';

export interface RssItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
}

export interface ScoredTool {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  daysSinceLaunch: number;
  competitors: string[];
  priceChanged: boolean;
  hasUpdate: boolean;
  score: number;
  postType: PostType;
}

const RSS_SOURCES = [
  // 글쓰기·언어 AI
  { url: 'https://www.producthunt.com/feed?category=artificial-intelligence', name: 'ProductHunt' },
  { url: 'https://openai.com/blog/rss', name: 'OpenAI' },
  { url: 'https://www.anthropic.com/rss.xml', name: 'Anthropic' },
  { url: 'https://blog.google/technology/ai/rss/', name: 'GoogleAI' },
  { url: 'https://huggingface.co/blog/feed.xml', name: 'HuggingFace' },

  // 이미지 AI
  { url: 'https://stability.ai/blog/rss.xml', name: 'StabilityAI' },
  { url: 'https://www.midjourney.com/updates/rss.xml', name: 'Midjourney' },

  // 영상 AI
  { url: 'https://runwayml.com/blog/rss.xml', name: 'RunwayML' },

  // 코딩 AI
  { url: 'https://github.blog/category/ai-ml/feed/', name: 'GitHubAI' },
  { url: 'https://cursor.sh/blog/rss.xml', name: 'Cursor' },

  // 생산성 AI
  { url: 'https://www.notion.so/blog/rss.xml', name: 'NotionAI' },
  { url: 'https://blog.perplexity.ai/rss', name: 'Perplexity' },

  // 오픈소스 AI
  { url: 'https://mistral.ai/news/rss.xml', name: 'MistralAI' },
  { url: 'https://ai.meta.com/blog/rss/', name: 'MetaAI' },
];

const AI_COMPETITORS: Record<string, string[]> = {
  'chatgpt': ['claude', 'gemini', 'gpt'],
  'claude': ['chatgpt', 'gemini', 'gpt-4'],
  'midjourney': ['dall-e', 'stable diffusion', 'ideogram'],
  'cursor': ['copilot', 'codeium', 'replit'],
  'sora': ['runway', 'kling', 'veo'],
};

async function fetchRss(url: string, sourceName: string): Promise<RssItem[]> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'aiscout-bot/1.0' },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const text = await res.text();
    return parseRssXml(text, sourceName);
  } catch {
    console.warn(`RSS 수집 실패: ${sourceName}`);
    return [];
  }
}

function parseRssXml(xml: string, sourceName: string): RssItem[] {
  const items: RssItem[] = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const title = extractTag(itemXml, 'title');
    const description = extractTag(itemXml, 'description').replace(/<[^>]+>/g, '').trim();
    const link = extractTag(itemXml, 'link');
    const pubDate = extractTag(itemXml, 'pubDate');

    if (title && link) {
      items.push({ title, description: description.slice(0, 500), link, pubDate, source: sourceName });
    }
  }
  return items;
}

function extractTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i'));
  return match?.[1]?.trim() ?? '';
}

export function decidePostType(item: {
  daysSinceLaunch: number;
  competitors: string[];
  priceChanged: boolean;
  hasUpdate: boolean;
}): PostType {
  if (item.daysSinceLaunch <= 7) return 'NEW_TOOL_REVIEW';
  if (item.competitors.length >= 2) return 'VS_COMPARISON';
  if (item.priceChanged) return 'PRICING_GUIDE';
  if (item.hasUpdate) return 'UPDATE_SUMMARY';
  return 'HOW_TO_GUIDE';
}

function detectCompetitors(text: string): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];
  for (const [tool, rivals] of Object.entries(AI_COMPETITORS)) {
    if (lower.includes(tool)) {
      found.push(...rivals.filter(r => lower.includes(r)));
    }
  }
  return [...new Set(found)];
}

function daysSince(dateStr: string): number {
  try {
    const pub = new Date(dateStr);
    const now = new Date();
    return Math.floor((now.getTime() - pub.getTime()) / (1000 * 60 * 60 * 24));
  } catch {
    return 30;
  }
}

function scoreItem(item: RssItem, competitors: string[]): number {
  let score = 0;
  const days = daysSince(item.pubDate);
  if (days <= 1) score += 50;
  else if (days <= 3) score += 30;
  else if (days <= 7) score += 20;
  if (competitors.length >= 2) score += 30;
  if (item.source === 'ProductHunt') score += 20;
  if (item.title.toLowerCase().includes('launch') || item.title.includes('출시')) score += 15;
  return score;
}

export async function collectTopItems(limit = 2): Promise<ScoredTool[]> {
  const allItems: RssItem[] = [];

  for (const source of RSS_SOURCES) {
    const items = await fetchRss(source.url, source.name);
    allItems.push(...items);
  }

  const seen = new Set<string>();
  const unique = allItems.filter(item => {
    const key = item.title.toLowerCase().slice(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const scored: ScoredTool[] = unique.map(item => {
    const competitors = detectCompetitors(`${item.title} ${item.description}`);
    const days = daysSince(item.pubDate);
    const hasUpdate = item.title.toLowerCase().includes('update') || item.title.includes('업데이트');
    const priceChanged = item.title.toLowerCase().includes('price') || item.title.includes('가격');

    return {
      ...item,
      daysSinceLaunch: days,
      competitors,
      priceChanged,
      hasUpdate,
      score: scoreItem(item, competitors),
      postType: decidePostType({ daysSinceLaunch: days, competitors, priceChanged, hasUpdate }),
    };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}
