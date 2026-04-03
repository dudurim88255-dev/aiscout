'use client';
import Link from 'next/link';
import { useState } from 'react';
import { CATEGORY_MAP } from '@/lib/categories';
import { SITE_TAGLINE } from '@/lib/seo';
import { SearchBar } from './SearchBar';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={{ background: 'rgba(10,15,26,0.92)', borderBottom: '1px solid #1e2a42', backdropFilter: 'blur(12px)' }} className="sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2 font-bold shrink-0" style={{ color: '#4fd1c5' }}>
          <span>⏳</span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold" style={{ color: '#4fd1c5' }}>150세 가능한가?</span>
            <span className="hidden lg:block text-xs font-normal" style={{ color: '#8b96b0' }}>{SITE_TAGLINE}</span>
          </div>
        </Link>

        {/* 검색바 (데스크탑) */}
        <div className="hidden md:flex flex-1 justify-center">
          <SearchBar />
        </div>

        {/* 데스크탑 네비 */}
        <nav className="hidden md:flex items-center gap-5 text-sm shrink-0" style={{ color: '#8b96b0' }}>
          {Object.entries(CATEGORY_MAP).slice(0, 3).map(([slug, { name }]) => (
            <Link key={slug} href={`/category/${slug}`} className="hover:text-[#4fd1c5] transition-colors">
              {name}
            </Link>
          ))}
          <Link href="/about" className="hover:text-[#4fd1c5] transition-colors">소개</Link>
        </nav>

        {/* 모바일 햄버거 */}
        <button
          className="md:hidden p-2 ml-auto"
          style={{ color: '#8b96b0' }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="메뉴"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {menuOpen && (
        <div style={{ background: '#0d1424', borderTop: '1px solid #1e2a42' }} className="md:hidden px-4 py-3 flex flex-col gap-3 text-sm">
          <SearchBar />
          {Object.entries(CATEGORY_MAP).map(([slug, { name }]) => (
            <Link key={slug} href={`/category/${slug}`} style={{ color: '#8b96b0' }} className="hover:text-[#4fd1c5] transition-colors" onClick={() => setMenuOpen(false)}>
              {name}
            </Link>
          ))}
          <Link href="/about" style={{ color: '#8b96b0' }} className="hover:text-[#4fd1c5] transition-colors" onClick={() => setMenuOpen(false)}>소개</Link>
        </div>
      )}
    </header>
  );
}
