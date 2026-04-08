'use client';
import { useEffect, useRef } from 'react';

interface Props {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal';
  className?: string;
}

export function AdBanner({ slot, format = 'auto', className = '' }: Props) {
  const adRef = useRef<HTMLModElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    try {
      // @ts-expect-error adsbygoogle
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn('AdSense 초기화 실패:', e);
    }
  }, []);

  if (!process.env.NEXT_PUBLIC_ADSENSE_ID) return null;

  return (
    <div className={`min-h-[90px] flex items-center justify-center ${className}`} style={{ background: 'rgba(19,26,46,0.5)', borderRadius: 8, overflow: 'hidden' }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

export default AdBanner;
