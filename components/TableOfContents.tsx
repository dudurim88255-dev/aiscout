'use client';
import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState('');

  useEffect(() => {
    const els = document.querySelectorAll('.prose h2');
    const list: Heading[] = [];
    els.forEach((el) => {
      const id = el.id || (el.textContent?.replace(/\s+/g, '-').toLowerCase() ?? '');
      if (!el.id) el.id = id;
      list.push({ id, text: el.textContent ?? '', level: 2 });
    });
    setHeadings(list);

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  if (headings.length < 2) return null;

  return (
    <nav style={{ position: 'sticky', top: 80 }}>
      <div style={{ background: '#131a2e', border: '1px solid #1e2a42', borderRadius: 12, padding: '1rem 1.25rem' }}>
        <div className="text-xs font-semibold mb-3" style={{ color: '#4fd1c5', letterSpacing: '0.1em', textTransform: 'uppercase' }}>목차</div>
        <ul className="space-y-1">
          {headings.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                style={{ color: active === h.id ? '#4fd1c5' : '#8b96b0', fontSize: 13, transition: 'color 0.15s' }}
                className="hover:text-[#4fd1c5] block leading-snug py-0.5"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
