import fs from 'fs';
import path from 'path';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');
const MIN_CHARS = 4500;

export interface QualityResult {
  passed: boolean;
  reasons: string[];
}

export function checkLength(content: string): boolean {
  return content.replace(/\s+/g, '').length >= MIN_CHARS;
}

export function checkSeoKeyword(title: string, keyword: string, content?: string): boolean {
  if (!keyword) return true;
  const kw = keyword.toLowerCase();
  const inTitle = title.toLowerCase().includes(kw);
  const inContent = content ? content.toLowerCase().includes(kw) : true;
  return inTitle && inContent;
}

export function checkDuplicate(slug: string): boolean {
  if (!fs.existsSync(POSTS_DIR)) return false;
  const files = fs.readdirSync(POSTS_DIR);
  return files.some(f => f.includes(slug.slice(0, 30)));
}

export function runQualityCheck(params: {
  title: string;
  content: string;
  slug: string;
  seoKeyword: string;
}): QualityResult {
  const reasons: string[] = [];

  if (!checkLength(params.content)) {
    reasons.push(`글자수 부족: ${params.content.replace(/\s+/g, '').length}자 (최소 ${MIN_CHARS}자)`);
  }
  if (!checkSeoKeyword(params.title, params.seoKeyword, params.content)) {
    reasons.push(`SEO 키워드 누락: "${params.seoKeyword}" (제목 또는 본문에 없음)`);
  }
  if (checkDuplicate(params.slug)) {
    reasons.push(`중복 슬러그: ${params.slug}`);
  }

  return { passed: reasons.length === 0, reasons };
}
