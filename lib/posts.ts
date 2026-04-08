import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export { CATEGORY_MAP } from './categories';

export type PostType =
  | 'NEW_TOOL_REVIEW'
  | 'VS_COMPARISON'
  | 'PRICING_GUIDE'
  | 'UPDATE_SUMMARY'
  | 'HOW_TO_GUIDE';

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  lastUpdated: string;
  category: string;
  tags: string[];
  summary: string;
  postType: PostType;
  tools: string[];
  seoKeyword: string;
  faqEnabled: boolean;
  rating?: number;
  coverImage?: string;
}

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.mdx'))
    .map(filename => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf-8');
      const { data } = matter(raw);
      return {
        slug: data.slug ?? filename.replace('.mdx', ''),
        title: data.title ?? '',
        date: data.date ?? '',
        lastUpdated: data.lastUpdated ?? data.date ?? '',
        category: data.category ?? '',
        tags: data.tags ?? [],
        summary: data.summary ?? '',
        postType: (data.postType ?? 'HOW_TO_GUIDE') as PostType,
        tools: data.tools ?? [],
        seoKeyword: data.seoKeyword ?? '',
        faqEnabled: data.faqEnabled ?? false,
        rating: data.rating,
        coverImage: data.coverImage,
      } satisfies PostMeta;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): { meta: PostMeta; content: string } | null {
  if (!fs.existsSync(POSTS_DIR)) return null;

  // 파일명 = slug.mdx 규칙이므로 O(1) 직접 접근 먼저 시도
  const directPath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (fs.existsSync(directPath)) {
    const raw = fs.readFileSync(directPath, 'utf-8');
    const { data, content } = matter(raw);
    if ((data.slug ?? slug) === slug) {
      return {
        meta: {
          slug: data.slug ?? slug,
          title: data.title ?? '',
          date: data.date ?? '',
          lastUpdated: data.lastUpdated ?? data.date ?? '',
          category: data.category ?? '',
          tags: data.tags ?? [],
          summary: data.summary ?? '',
          postType: (data.postType ?? 'HOW_TO_GUIDE') as PostType,
          tools: data.tools ?? [],
          seoKeyword: data.seoKeyword ?? '',
          faqEnabled: data.faqEnabled ?? false,
          rating: data.rating,
          coverImage: data.coverImage,
        },
        content,
      };
    }
  }

  // fallback: frontmatter slug로 전체 스캔 (파일명이 slug와 다른 경우)
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx'));
  const file = files.find(f => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, f), 'utf-8');
    const { data } = matter(raw);
    return (data.slug ?? f.replace('.mdx', '')) === slug;
  });
  if (!file) return null;

  const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
  const { data, content } = matter(raw);

  return {
    meta: {
      slug: data.slug ?? slug,
      title: data.title ?? '',
      date: data.date ?? '',
      lastUpdated: data.lastUpdated ?? data.date ?? '',
      category: data.category ?? '',
      tags: data.tags ?? [],
      summary: data.summary ?? '',
      postType: (data.postType ?? 'HOW_TO_GUIDE') as PostType,
      tools: data.tools ?? [],
      seoKeyword: data.seoKeyword ?? '',
      faqEnabled: data.faqEnabled ?? false,
      rating: data.rating,
      coverImage: data.coverImage,
    },
    content,
  };
}

export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPosts().filter(p => p.category === category);
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter(p => p.tags.includes(tag));
}

export function getRelatedPosts(slug: string, category: string, limit = 3): PostMeta[] {
  return getAllPosts()
    .filter(p => p.slug !== slug && p.category === category)
    .slice(0, limit);
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = posts.flatMap(p => p.tags);
  return [...new Set(tags)].filter(Boolean).sort();
}
