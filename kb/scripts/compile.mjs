// kb/scripts/compile.mjs
// Claude Code에서 실행: node kb/scripts/compile.mjs
// 또는 Claude Code에게: "raw/ 자료를 위키에 컴파일해줘"

import { readdir, readFile, writeFile, stat } from 'fs/promises';
import { join, basename, extname } from 'path';

const KB_ROOT = join(process.cwd(), 'kb');
const RAW_DIR = join(KB_ROOT, 'raw');
const WIKI_DIR = join(KB_ROOT, 'wiki');

async function getFiles(dir, ext = '.md') {
  const entries = [];
  try {
    const items = await readdir(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = join(dir, item.name);
      if (item.isDirectory()) {
        entries.push(...await getFiles(fullPath, ext));
      } else if (extname(item.name) === ext) {
        entries.push(fullPath);
      }
    }
  } catch { }
  return entries;
}

async function getFileInfo(filePath) {
  const content = await readFile(filePath, 'utf-8');
  const stats = await stat(filePath);
  const name = basename(filePath, '.md');
  const relativePath = filePath.replace(KB_ROOT, '').replace(/\\/g, '/');

  // 첫 번째 # 헤딩을 제목으로 사용
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : name;

  // 단어 수
  const wordCount = content.split(/\s+/).length;

  return {
    path: filePath,
    relativePath,
    name,
    title,
    wordCount,
    modified: stats.mtime,
    content
  };
}

async function generateIndex(rawFiles, wikiFiles) {
  const now = new Date().toISOString().split('T')[0];

  // raw 파일 분류
  const rawByCategory = {};
  for (const f of rawFiles) {
    const category = f.relativePath.split('/')[2] || 'uncategorized'; // raw/articles/ → articles
    if (!rawByCategory[category]) rawByCategory[category] = [];
    rawByCategory[category].push(f);
  }

  // wiki 파일 분류
  const wikiByCategory = {};
  for (const f of wikiFiles) {
    const category = f.relativePath.split('/')[2] || 'uncategorized';
    if (!wikiByCategory[category]) wikiByCategory[category] = [];
    wikiByCategory[category].push(f);
  }

  let index = `# AI Scout Knowledge Base\n\n`;
  index += `> 이 위키는 LLM이 자동으로 컴파일하고 유지합니다.\n`;
  index += `> 마지막 컴파일: ${now}\n\n`;

  // 통계
  const totalRaw = rawFiles.length;
  const totalWiki = wikiFiles.length;
  const totalWords = wikiFiles.reduce((sum, f) => sum + f.wordCount, 0);
  index += `## 통계\n\n`;
  index += `| 항목 | 수치 |\n|------|------|\n`;
  index += `| 원본 자료 (raw/) | ${totalRaw}개 |\n`;
  index += `| 위키 문서 (wiki/) | ${totalWiki}개 |\n`;
  index += `| 총 단어 수 | ${totalWords.toLocaleString()}자 |\n\n`;

  // Raw 자료 목록
  index += `## 원본 자료\n\n`;
  for (const [cat, files] of Object.entries(rawByCategory)) {
    index += `### ${cat}\n`;
    for (const f of files.sort((a, b) => b.modified - a.modified)) {
      index += `- [${f.title}](..${f.relativePath}) (${f.wordCount}자)\n`;
    }
    index += `\n`;
  }

  // Wiki 문서 목록
  index += `## 위키 문서\n\n`;
  for (const [cat, files] of Object.entries(wikiByCategory)) {
    if (cat === 'wiki') continue; // INDEX.md 자체 제외
    index += `### ${cat}\n`;
    for (const f of files.sort((a, b) => b.modified - a.modified)) {
      index += `- [${f.title}](..${f.relativePath}) (${f.wordCount}자, 수정: ${f.modified.toISOString().split('T')[0]})\n`;
    }
    index += `\n`;
  }

  // 미처리 raw 파일 표시
  index += `## 컴파일 필요\n\n`;
  index += `_Claude Code에게 "새 raw 자료를 위키에 컴파일해줘"라고 요청하세요._\n`;

  await writeFile(join(WIKI_DIR, 'INDEX.md'), index, 'utf-8');
  console.log(`✅ INDEX.md 업데이트 완료 (raw: ${totalRaw}, wiki: ${totalWiki}, ${totalWords.toLocaleString()}자)`);
}

async function main() {
  console.log('📚 KB 컴파일 시작...\n');

  const rawFiles = await getFiles(RAW_DIR);
  const wikiFiles = (await getFiles(WIKI_DIR)).filter(f => !f.endsWith('INDEX.md'));

  console.log(`📄 Raw 파일: ${rawFiles.length}개`);
  console.log(`📝 Wiki 파일: ${wikiFiles.length}개\n`);

  const rawInfos = await Promise.all(rawFiles.map(getFileInfo));
  const wikiInfos = await Promise.all(wikiFiles.map(getFileInfo));

  await generateIndex(rawInfos, wikiInfos);

  console.log('\n💡 다음 단계:');
  console.log('   Claude Code에서 "kb의 raw 자료를 분석해서 위키 문서로 만들어줘"');
}

main().catch(console.error);
