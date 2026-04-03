'use client';
import { useState, useEffect, type ReactNode } from 'react';

interface Props {
  expertContent: ReactNode;
  easyContent: ReactNode | null;
}

export function ContentToggle({ expertContent, easyContent }: Props) {
  const [isEasy, setIsEasy] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('content-mode');
    if (saved === 'easy' && easyContent) setIsEasy(true);
  }, [easyContent]);

  const toggle = (easy: boolean) => {
    setIsEasy(easy);
    localStorage.setItem('content-mode', easy ? 'easy' : 'expert');
  };

  if (!easyContent) return <>{expertContent}</>;

  return (
    <>
      {/* 토글 버튼 */}
      <div className="flex items-center gap-1 mb-8 p-1 rounded-xl w-fit" style={{ background: '#0d1424', border: '1px solid #1e2a42' }}>
        <button
          onClick={() => toggle(false)}
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          style={{
            background: !isEasy ? '#1a2440' : 'transparent',
            color: !isEasy ? '#e8edf5' : '#4a5568',
            border: !isEasy ? '1px solid #4fd1c5' : '1px solid transparent',
            boxShadow: !isEasy ? '0 0 10px rgba(79,209,197,0.15)' : 'none',
          }}
        >
          🔬 전문가 버전
        </button>
        <button
          onClick={() => toggle(true)}
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          style={{
            background: isEasy ? '#1a2440' : 'transparent',
            color: isEasy ? '#e8edf5' : '#4a5568',
            border: isEasy ? '1px solid #f6c90e' : '1px solid transparent',
            boxShadow: isEasy ? '0 0 10px rgba(246,201,14,0.15)' : 'none',
          }}
        >
          😊 쉬운 버전
        </button>
      </div>

      {/* 콘텐츠 */}
      <div style={{ display: isEasy ? 'none' : 'block' }}>{expertContent}</div>
      <div style={{ display: isEasy ? 'block' : 'none' }}>{easyContent}</div>
    </>
  );
}
