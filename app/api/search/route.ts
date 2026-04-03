import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.toLowerCase().trim() ?? '';
  if (!q || q.length < 2) return NextResponse.json([]);

  const posts = getAllPosts();
  const results = posts
    .filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    )
    .slice(0, 8)
    .map(({ slug, title, summary, category, date, difficulty }) => ({
      slug, title, summary, category, date, difficulty,
    }));

  return NextResponse.json(results);
}
