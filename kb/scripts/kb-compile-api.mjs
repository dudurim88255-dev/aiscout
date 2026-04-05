// kb/scripts/kb-compile-api.mjs
// Claude API로 raw/ 자료를 wiki/ 문서로 자동 컴파일

import { readdir, readFile, writeFile, mkdir, stat } from 'fs/promises';
import { join, basename, extname } from 'path';
import { existsSync } from 'fs';

const KB_ROOT = join(process.cwd(), 'kb');
const RAW_DIR = join(KB_ROOT, 'raw');
const WIKI_DIR = join(KB_ROOT, 'wiki');
const API_KEY = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
  console.error('ANTHROPIC_API_KEY not set');
  process.exit(1);
}

// ---- 유틸 ----

async function getFiles(dir, ext = '.md') {
  const entries = [];
  try {
    const items = await readdir(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = join(dir, item.name);
      if (item.isDirectory()) {
        entries.push(...(await getFiles(fullPath, ext)));
      } else if (extname(item.name) === ext) {
        entries.push(fullPath);
      }
    }
  } catch (e) { /* empty dir */ }
  return entries;
}

async function callClaude(prompt, maxTokens = 4096) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.content.map(b => b.text || '').join('');
}

// ---- 기존 위키 문서에서 처리 완료된 소스 목록 추출 ----

async function getProcessedSources() {
  const wikiFiles = await getFiles(WIKI_DIR);
  const processed = new Set();
  
  for (const f of wikiFiles) {
    const content = await readFile(f, 'utf-8');
    const sourcesMatch = content.match(/sources:\s*\[([^\]]*)\]/);
    if (sourcesMatch) {
      sourcesMatch[1].split(',').forEach(s => {
        processed.add(s.trim().replace(/['"]/g, ''));
      });
    }
  }
  return processed;
}

// ---- 메인 컴파일 로직 ----

async function compileRawFile(rawPath, existingWikiSummary) {
  const content = await readFile(rawPath, 'utf-8');
  const relativePath = rawPath.replace(process.cwd() + '/', '').replace(/\\/g, '/');
  const today = new Date().toISOString().split('T')[0];

  const prompt = `You are a knowledge base compiler for an AI tools review blog called "AI Scout".

Given this raw source document, generate wiki article(s) in Korean.

## Raw Source:
File: ${relativePath}

${content}

## Existing Wiki Summary:
${existingWikiSummary || 'No existing wiki documents yet.'}

## Instructions:
1. Analyze the raw document and decide which wiki articles to create or update.
2. Each article should be categorized: concepts/ (AI concepts), tools/ (specific tools), comparisons/ (tool comparisons), trends/ (trend analysis)
3. Output as JSON array with this format:
[
  {
    "path": "wiki/tools/claude-code.md",
    "content": "---\\ntitle: Claude Code\\ncategory: tool\\ncreated: ${today}\\nupdated: ${today}\\nsources: ['${relativePath}']\\nrelated: ['wiki/tools/cursor.md']\\n---\\n\\n# Claude Code\\n\\n..."
  }
]

Rules:
- Write in Korean
- Include frontmatter (title, category, created, updated, sources, related)
- Use relative links between wiki docs
- Always cite source: (source: raw/articles/xxx.md)
- If a tool/concept already exists in wiki summary, merge new info instead of creating duplicate
- Output ONLY valid JSON, no markdown fences, no explanation`;

  const response = await callClaude(prompt);
  
  try {
    const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error(`Failed to parse response for ${relativePath}:`, e.message);
    console.error('Response was:', response.substring(0, 200));
    return [];
  }
}

async function getWikiSummary() {
  const wikiFiles = await getFiles(WIKI_DIR);
  const summaries = [];
  
  for (const f of wikiFiles) {
    if (f.endsWith('INDEX.md')) continue;
    const content = await readFile(f, 'utf-8');
    const titleMatch = content.match(/title:\s*(.+)/);
    const categoryMatch = content.match(/category:\s*(.+)/);
    const relPath = f.replace(process.cwd() + '/', '').replace(/\\/g, '/');
    
    summaries.push(`- ${relPath}: ${titleMatch ? titleMatch[1] : basename(f)} (${categoryMatch ? categoryMatch[1] : 'unknown'})`);
  }
  
  return summaries.join('\n') || 'Empty wiki';
}

async function main() {
  console.log('--- KB Auto Compile Start ---\n');

  const rawFiles = await getFiles(RAW_DIR);
  const processedSources = await getProcessedSources();
  const wikiSummary = await getWikiSummary();

  // 아직 처리 안 된 raw 파일만 필터
  const newFiles = rawFiles.filter(f => {
    const rel = f.replace(process.cwd() + '/', '').replace(/\\/g, '/');
    return !processedSources.has(rel);
  });

  if (newFiles.length === 0) {
    console.log('No new raw files to compile.');
    return;
  }

  console.log(`New raw files to compile: ${newFiles.length}`);

  for (const rawFile of newFiles) {
    const rel = rawFile.replace(process.cwd() + '/', '').replace(/\\/g, '/');
    console.log(`\nCompiling: ${rel}`);
    
    const articles = await compileRawFile(rawFile, wikiSummary);
    
    for (const article of articles) {
      const fullPath = join(process.cwd(), article.path);
      const dir = join(fullPath, '..');
      
      if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
      }
      
      // 기존 파일이 있으면 merge (append sources)
      if (existsSync(fullPath)) {
        const existing = await readFile(fullPath, 'utf-8');
        console.log(`  Updating: ${article.path}`);
        // 기존 내용에 새 소스 정보 추가
        const merged = existing.replace(
          /sources:\s*\[([^\]]*)\]/,
          (match, sources) => {
            const srcList = sources.split(',').map(s => s.trim());
            if (!srcList.includes(`'${rel}'`)) {
              srcList.push(`'${rel}'`);
            }
            return `sources: [${srcList.join(', ')}]`;
          }
        );
        await writeFile(fullPath, article.content, 'utf-8');
      } else {
        console.log(`  Creating: ${article.path}`);
        await writeFile(fullPath, article.content, 'utf-8');
      }
    }
  }

  console.log('\n--- KB Auto Compile Done ---');
}

main().catch(err => {
  console.error('Compile failed:', err);
  process.exit(1);
});
