export type PostType = 'NEW_TOOL_REVIEW' | 'VS_COMPARISON' | 'PRICING_GUIDE' | 'UPDATE_SUMMARY' | 'HOW_TO_GUIDE';

export interface RssItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: string;
}

export interface ScoredTool {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: string;
  daysSinceLaunch: number;
  competitors: string[];
  priceChanged: boolean;
  hasUpdate: boolean;
  score: number;
  postType: PostType;
}

const RSS_SOURCES = [
  // AI 뉴스 (한국인이 많이 검색하는 핫 토픽)
  { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', name: 'TechCrunch', category: 'news-ai' },
  { url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', name: 'TheVerge', category: 'news-ai' },
  { url: 'https://feeds.feedburner.com/venturebeat/SZYF', name: 'VentureBeat', category: 'news-ai' },
  { url: 'https://feeds.arstechnica.com/arstechnica/technology-lab', name: 'ArsTechnica', category: 'news-ai' },
  { url: 'https://www.technologyreview.com/feed/', name: 'MITTechReview', category: 'news-ai' },

  // AI 기업 공식 블로그
  { url: 'https://openai.com/blog/rss.xml', name: 'OpenAI', category: 'llm' },
  { url: 'https://www.anthropic.com/rss.xml', name: 'Anthropic', category: 'llm' },
  { url: 'https://blog.google/technology/ai/rss/', name: 'GoogleAI', category: 'llm' },
  { url: 'https://mistral.ai/news/rss.xml', name: 'MistralAI', category: 'llm' },
  { url: 'https://ai.meta.com/blog/rss/', name: 'MetaAI', category: 'llm' },

  // 이미지·영상·코딩 AI
  { url: 'https://stability.ai/blog/rss.xml', name: 'StabilityAI', category: 'image-ai' },
  { url: 'https://github.blog/category/ai-ml/feed/', name: 'GitHubAI', category: 'coding-ai' },
  { url: 'https://blog.perplexity.ai/rss', name: 'Perplexity', category: 'search-ai' },
  { url: 'https://huggingface.co/blog/feed.xml', name: 'HuggingFace', category: 'open-source-ai' },

  // 제품 출시
  { url: 'https://www.producthunt.com/feed?category=artificial-intelligence', name: 'ProductHunt', category: 'new-tool' },
];

const AI_COMPETITORS: Record<string, string[]> = {
  'chatgpt': ['claude', 'gemini', 'gpt'],
  'claude': ['chatgpt', 'gemini', 'gpt-4'],
  'midjourney': ['dall-e', 'stable diffusion', 'ideogram'],
  'cursor': ['copilot', 'codeium', 'replit'],
  'sora': ['runway', 'kling', 'veo'],
};

async function fetchRss(url: string, sourceName: string, category: string): Promise<RssItem[]> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'aiscout-bot/1.0' },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.warn(`RSS 수집 실패 (${res.status}): ${sourceName}`);
      return [];
    }
    const text = await res.text();
    return parseRssXml(text, sourceName, category);
  } catch {
    console.warn(`RSS 수집 실패: ${sourceName}`);
    return [];
  }
}

function parseRssXml(xml: string, sourceName: string, category: string): RssItem[] {
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
      items.push({ title, description: description.slice(0, 500), link, pubDate, source: sourceName, category });
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
  } catch (e) {
    console.warn(`날짜 파싱 실패: "${dateStr}"`, e);
    return 30;
  }
}

// 한국인이 많이 검색할 만한 키워드 가중치
const HOT_KEYWORDS = [
  'gpt-5', 'gpt5', 'chatgpt', 'claude', 'gemini', 'llama', 'sora',
  'grok', 'deepseek', 'qwen', 'mistral',
  'free', 'open source', 'open-source',
  'released', 'launches', 'announces',
  'vs ', 'compared', 'beats', 'surpasses',
  'breakthrough', 'new model', 'new version',
  'price', 'pricing', 'cost',
  'api', 'multimodal', 'reasoning', 'coding',
  'image', 'video', 'voice', 'search',
];

function scoreItem(item: RssItem, competitors: string[]): number {
  let score = 0;
  const days = daysSince(item.pubDate);

  // 최신성 — 핫한 뉴스일수록 높은 가중치
  if (days === 0) score += 60;
  else if (days <= 1) score += 50;
  else if (days <= 3) score += 30;
  else if (days <= 7) score += 15;

  // 경쟁/비교 내용 → 검색량 많음
  if (competitors.length >= 2) score += 25;
  if (competitors.length >= 1) score += 10;

  // 핫 키워드
  const lower = `${item.title} ${item.description}`.toLowerCase();
  for (const kw of HOT_KEYWORDS) {
    if (lower.includes(kw)) score += 8;
  }

  // 신뢰도 높은 소스 (메이저 AI 기업 공식 발표)
  if (['OpenAI', 'Anthropic', 'GoogleAI', 'MetaAI', 'MistralAI'].includes(item.source)) score += 20;
  // 주요 뉴스 매체
  if (['TechCrunch', 'TheVerge', 'VentureBeat'].includes(item.source)) score += 10;

  if (item.title.toLowerCase().includes('launch') || item.title.includes('출시')) score += 10;
  return score;
}

export async function collectTopItems(limit = 2): Promise<ScoredTool[]> {
  const allItems: RssItem[] = [];

  for (const source of RSS_SOURCES) {
    const items = await fetchRss(source.url, source.name, source.category);
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
      category: item.category,
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
