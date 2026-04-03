'use client';
// Task 8에서 AI Scout용으로 교체 예정인 stub 컴포넌트
import { useState } from 'react';

interface Props {
  expertContent: React.ReactNode;
  easyContent: React.ReactNode | null;
}

export function ContentToggle({ expertContent, easyContent }: Props) {
  const [showEasy, setShowEasy] = useState(false);

  return (
    <div>
      {easyContent && (
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setShowEasy(false)}
            className="text-sm px-4 py-1.5 rounded"
            style={{
              background: !showEasy ? 'var(--accent-amber)' : 'var(--bg-card)',
              color: !showEasy ? '#000' : 'var(--text-secondary)',
            }}
          >
            전문가 버전
          </button>
          <button
            onClick={() => setShowEasy(true)}
            className="text-sm px-4 py-1.5 rounded"
            style={{
              background: showEasy ? 'var(--accent-amber)' : 'var(--bg-card)',
              color: showEasy ? '#000' : 'var(--text-secondary)',
            }}
          >
            쉬운 버전
          </button>
        </div>
      )}
      {showEasy && easyContent ? easyContent : expertContent}
    </div>
  );
}
