import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
export { CATEGORY_MAP } from './categories';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');
const EASY_DIR = path.join(process.cwd(), 'content/easy');

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  summary: string;
  paperDOI?: string;
  journal?: string;
  difficulty: '입문' | '중급' | '심화';
  coverImage?: string;
  readingTime: string;
  updatedAt?: string;
}

export interface Post extends PostMeta {
  content: string;
  easyBody?: string;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx'));
  const posts = files.map((file) => {
    const slug = file.replace(/\.mdx$/, '');
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title ?? '',
      date: data.date ?? '',
      category: data.category ?? '',
      tags: data.tags ?? [],
      summary: data.summary ?? '',
      paperDOI: data.paperDOI,
      journal: data.journal,
      difficulty: data.difficulty ?? '입문',
      coverImage: data.coverImage,
      readingTime: readingTime(content).text,
      updatedAt: data.updatedAt,
    } as PostMeta;
  });
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? '',
    date: data.date ?? '',
    category: data.category ?? '',
    tags: data.tags ?? [],
    summary: data.summary ?? '',
    paperDOI: data.paperDOI,
    journal: data.journal,
    difficulty: data.difficulty ?? '입문',
    coverImage: data.coverImage,
    readingTime: readingTime(content).text,
    updatedAt: data.updatedAt,
    content,
    easyBody: (() => {
      const easyPath = path.join(EASY_DIR, `${slug}.md`);
      return fs.existsSync(easyPath) ? fs.readFileSync(easyPath, 'utf-8') : undefined;
    })(),
  };
}

export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getAllCategories(): string[] {
  const posts = getAllPosts();
  return [...new Set(posts.map((p) => p.category))];
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = posts.flatMap((p) => p.tags);
  return [...new Set(tags)].filter(Boolean).sort();
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((p) => p.tags.includes(tag));
}

export function getRelatedPosts(slug: string, limit = 3): PostMeta[] {
  const all = getAllPosts();
  const current = all.find((p) => p.slug === slug);
  if (!current) return [];

  // 같은 카테고리 우선, 태그 겹치면 가중치
  const scored = all
    .filter((p) => p.slug !== slug)
    .map((p) => {
      let score = 0;
      if (p.category === current.category) score += 3;
      const sharedTags = p.tags.filter((t) => current.tags.includes(t)).length;
      score += sharedTags;
      return { post: p, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.post);
}

