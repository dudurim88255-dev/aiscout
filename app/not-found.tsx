import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: '페이지를 찾을 수 없습니다' };

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-32 text-center">
      <div className="text-6xl mb-6">🔬</div>
      <h1 className="text-3xl font-bold mb-3" style={{ color: '#e8edf5' }}>404</h1>
      <p className="text-lg mb-2" style={{ color: '#4fd1c5', fontWeight: 600 }}>페이지를 찾을 수 없습니다</p>
      <p className="mb-8 text-sm" style={{ color: '#8b96b0', lineHeight: 1.8 }}>
        요청하신 페이지가 삭제됐거나 주소가 변경됐을 수 있습니다.
      </p>
      <Link
        href="/"
        style={{ background: 'linear-gradient(135deg, #4fd1c5, #7c3aed)', borderRadius: '12px', padding: '12px 32px', color: '#fff', fontWeight: 700, display: 'inline-block' }}
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
