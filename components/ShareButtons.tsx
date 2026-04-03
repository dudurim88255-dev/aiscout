'use client';
import { useState } from 'react';

interface Props {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: Props) {
  const [copied, setCopied] = useState(false);

  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(`${title} | 인간 수명 150세 가능한가?`);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encoded}`;

  const copyUrl = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const btnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '7px 14px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    border: '1px solid #1e2a42',
    background: '#131a2e',
    color: '#8b96b0',
    cursor: 'pointer',
    transition: 'all 0.15s',
  } as React.CSSProperties;

  return (
    <div className="flex items-center gap-2 flex-wrap mt-8 pt-6" style={{ borderTop: '1px solid #1e2a42' }}>
      <span style={{ color: '#8b96b0', fontSize: 13, marginRight: 4 }}>공유하기</span>

      <a href={twitterUrl} target="_blank" rel="noopener noreferrer" style={btnStyle}
        className="hover:border-[#1da1f2] hover:text-[#1da1f2]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.636 5.904-5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        X (트위터)
      </a>

      <a href={facebookUrl} target="_blank" rel="noopener noreferrer" style={btnStyle}
        className="hover:border-[#1877f2] hover:text-[#1877f2]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        페이스북
      </a>

      <button onClick={copyUrl} style={{ ...btnStyle, border: copied ? '1px solid #4fd1c5' : '1px solid #1e2a42', color: copied ? '#4fd1c5' : '#8b96b0' }}>
        {copied ? '✓ 복사됨' : '🔗 링크 복사'}
      </button>
    </div>
  );
}
