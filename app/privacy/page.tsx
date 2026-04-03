import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-8" style={{ color: '#e8edf5' }}>개인정보처리방침</h1>
      <div className="space-y-6 text-sm" style={{ color: '#8b96b0', lineHeight: 1.9 }}>
        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: '#c5d8f0' }}>1. 수집하는 개인정보</h2>
          <p>본 사이트는 방문자의 개인정보를 별도로 수집하지 않습니다. 다만, Google Analytics 및 Google AdSense를 통해 익명의 방문 통계 데이터가 수집될 수 있습니다.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: '#c5d8f0' }}>2. 쿠키 사용</h2>
          <p>Google AdSense는 맞춤형 광고 제공을 위해 쿠키를 사용할 수 있습니다. 브라우저 설정에서 쿠키를 비활성화할 수 있습니다.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: '#c5d8f0' }}>3. 제3자 서비스</h2>
          <p>Google AdSense, Google Analytics 등 제3자 서비스의 개인정보 처리는 각 서비스의 개인정보처리방침을 따릅니다.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold mb-2" style={{ color: '#c5d8f0' }}>4. 문의</h2>
          <p>개인정보 관련 문의는 연락처 페이지를 통해 주세요.</p>
        </section>
        <p className="text-xs" style={{ color: '#4a5568' }}>최종 수정일: {new Date().toLocaleDateString('ko-KR')}</p>
      </div>
    </div>
  );
}
