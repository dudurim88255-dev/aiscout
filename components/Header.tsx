'use client';
import Link from 'next/link';
import { useState } from 'react';
import SearchBar from './SearchBar';

const CATEGORIES = [
  { slug: 'writing-ai', label: '글쓰기 AI' },
  { slug: 'image-ai', label: '이미지 AI' },
  { slug: 'video-ai', label: '영상 AI' },
  { slug: 'code-ai', label: '코딩 AI' },
  { slug: 'productivity-ai', label: '생산성 AI' },
  { slug: 'open-source-ai', label: '오픈소스 AI' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}
      className="sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span style={{ color: 'var(--accent-amber)' }} className="text-xl font-bold">⬡</span>
          <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>AI Scout</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="text-sm transition-colors hover:opacity-80"
              style={{ color: 'var(--text-secondary)' }}
            >
              {cat.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <SearchBar />
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: 'var(--text-secondary)' }}
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <div style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}
          className="md:hidden px-4 py-3 flex flex-col gap-3">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="text-sm"
              style={{ color: 'var(--text-secondary)' }}
              onClick={() => setMenuOpen(false)}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
