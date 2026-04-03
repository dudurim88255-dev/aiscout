import fs from 'fs';
import path from 'path';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');
const MIN_CHARS = 3000;

export interface QualityResult {
  passed: boolean;
  reasons: string[];
}

export function checkLength(content: string): boolean {
  return content.replace(/\s+/g, '').length >= MIN_CHARS;
}

export function checkSeoKeyword(title: string, keyword: string): boolean {
  if (!keyword) return true;
  return title.toLowerCase().includes(keyword.toLowerCase());
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
  if (!checkSeoKeyword(params.title, params.seoKeyword)) {
    reasons.push(`제목에 SEO 키워드 없음: "${params.seoKeyword}"`);
  }
  if (checkDuplicate(params.slug)) {
    reasons.push(`중복 슬러그: ${params.slug}`);
  }

  return { passed: reasons.length === 0, reasons };
}
