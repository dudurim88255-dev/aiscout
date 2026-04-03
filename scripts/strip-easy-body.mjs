#!/usr/bin/env node
/**
 * MDX 파일에서 easyBody 프론트매터 필드를 제거하는 스크립트
 * 사용법: node scripts/strip-easy-body.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.join(__dirname, '../content/posts');

const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx'));
let count = 0;

for (const file of files) {
  const filePath = path.join(POSTS_DIR, file);
  const raw = fs.readFileSync(filePath, 'utf-8');

  // easyBody: "..." 또는 easyBody: >- ... 패턴 제거
  // 프론트매터 끝(---) 전까지만 처리
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) continue;

  const fm = fmMatch[1];
  if (!fm.includes('easyBody:')) continue;

  // easyBody 필드 제거 (다음 필드 시작 또는 프론트매터 끝까지)
  const cleaned = raw.replace(/\neasyBody:[\s\S]*?(?=\n[a-zA-Z가-힣]|\n---)/g, '');

  fs.writeFileSync(filePath, cleaned, 'utf-8');
  count++;
  console.log(`  ✅ ${file}`);
}

console.log(`\n완료: ${count}개 파일에서 easyBody 제거됨`);
