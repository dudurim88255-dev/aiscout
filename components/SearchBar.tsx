'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Result {
  slug: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  difficulty: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (query.length < 2) { setResults([]); setOpen(false); return; }
    setLoading(true);
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) { setResults([]); setOpen(false); setLoading(false); return; }
        const data = await res.json();
        setResults(data);
        setOpen(true);
      } catch {
        setResults([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [query]);

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <div style={{ background: '#131a2e', border: '1px solid #1e2a42', borderRadius: 10 }} className="flex items-center px-3 gap-2">
        <span style={{ color: '#8b96b0', fontSize: 16 }}>🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="논문 제목, 키워드 검색..."
          className="flex-1 bg-transparent py-2.5 text-sm outline-none"
          style={{ color: '#e8edf5' }}
        />
        {loading && <span style={{ color: '#8b96b0', fontSize: 12 }}>...</span>}
        {query && !loading && (
          <button onClick={() => { setQuery(''); setResults([]); setOpen(false); }} style={{ color: '#8b96b0', fontSize: 16, lineHeight: 1 }}>✕</button>
        )}
      </div>

      {open && results.length > 0 && (
        <div
          style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 6, background: '#131a2e', border: '1px solid #1e2a42', borderRadius: 12, zIndex: 100, maxHeight: 420, overflowY: 'auto' }}
        >
          {results.map((r) => (
            <Link
              key={r.slug}
              href={`/blog/${r.slug}`}
              onClick={() => { setOpen(false); setQuery(''); }}
              className="block px-4 py-3 hover:bg-[#1a2340] transition-colors"
              style={{ borderBottom: '1px solid #1e2a42' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span style={{ background: 'rgba(79,209,197,0.1)', color: '#4fd1c5', borderRadius: 20, padding: '1px 8px', fontSize: 11 }}>{r.category}</span>
                <span style={{ color: '#4a5568', fontSize: 11 }}>{r.date}</span>
              </div>
              <p className="text-sm font-semibold leading-snug" style={{ color: '#e8edf5' }}>{r.title}</p>
              <p className="text-xs mt-1 line-clamp-1" style={{ color: '#8b96b0' }}>{r.summary}</p>
            </Link>
          ))}
        </div>
      )}

      {open && query.length >= 2 && results.length === 0 && !loading && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 6, background: '#131a2e', border: '1px solid #1e2a42', borderRadius: 12, padding: '16px', textAlign: 'center', zIndex: 100 }}>
          <p style={{ color: '#8b96b0', fontSize: 14 }}>검색 결과가 없습니다</p>
        </div>
      )}
    </div>
  );
}
