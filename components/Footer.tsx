import Link from 'next/link';
import { SITE_NAME, SITE_TAGLINE } from '@/lib/seo';

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #1e2a42', background: '#070c15' }} className="mt-16 py-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between gap-6 text-sm" style={{ color: '#8b96b0' }}>
        <div>
          <div className="font-bold mb-1" style={{ color: '#4fd1c5' }}>⏳ {SITE_NAME}</div>
          <p className="max-w-xs" style={{ color: '#8b96b0' }}>{SITE_TAGLINE}</p>
        </div>
        <div className="flex gap-8">
          <div className="flex flex-col gap-2">
            <span className="font-semibold" style={{ color: '#c5d8f0' }}>카테고리</span>
            <Link href="/category/organoid" className="hover:text-[#4fd1c5] transition-colors">오가노이드</Link>
            <Link href="/category/anti-aging" className="hover:text-[#4fd1c5] transition-colors">역노화</Link>
            <Link href="/category/genomics" className="hover:text-[#4fd1c5] transition-colors">유전체학</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold" style={{ color: '#c5d8f0' }}>사이트</span>
            <Link href="/about" className="hover:text-[#4fd1c5] transition-colors">소개</Link>
            <Link href="/privacy" className="hover:text-[#4fd1c5] transition-colors">개인정보처리방침</Link>
            <Link href="/contact" className="hover:text-[#4fd1c5] transition-colors">연락처</Link>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 mt-6 text-xs" style={{ color: '#4a5568' }}>
        © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
