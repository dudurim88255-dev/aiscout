import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: '개인정보처리방침 | AI Scout',
  description: 'AI Scout의 개인정보처리방침입니다.',
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
        개인정보처리방침
      </h1>
      <p className="text-sm mb-10" style={{ color: 'var(--text-muted)' }}>
        시행일: {today}
      </p>

      <div className="space-y-8" style={{ color: 'var(--text-secondary)', lineHeight: 1.9 }}>
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>1. 수집하는 정보</h2>
          <p>
            AI Scout(이하 "본 사이트")는 서비스 제공을 위해 아래 정보를 수집할 수 있습니다.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>방문 기록, IP 주소, 브라우저 정보 (Google Analytics)</li>
            <li>광고 클릭 및 노출 데이터 (Google AdSense)</li>
            <li>문의 시 제출한 이름, 이메일 (선택)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>2. 쿠키 사용</h2>
          <p>
            본 사이트는 Google Analytics 및 Google AdSense를 통해 쿠키를 사용합니다.
            쿠키는 브라우저 설정에서 거부할 수 있으나, 일부 기능이 제한될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>3. 제3자 서비스</h2>
          <p>본 사이트는 다음 제3자 서비스를 사용합니다.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Google Analytics</strong>: 방문자 통계 분석</li>
            <li><strong>Google AdSense</strong>: 맞춤형 광고 제공</li>
            <li><strong>Vercel</strong>: 웹사이트 호스팅</li>
          </ul>
          <p className="mt-2">
            각 서비스의 개인정보처리방침은 해당 회사 웹사이트에서 확인할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>4. 정보 보유 및 파기</h2>
          <p>
            수집된 정보는 서비스 제공 목적 달성 시 즉시 파기합니다.
            법령에 의한 보존 의무가 있는 경우 해당 기간 동안 보관합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>5. 문의</h2>
          <p>
            개인정보 관련 문의는{' '}
            <a href="/contact" style={{ color: 'var(--accent-amber)' }}>문의 페이지</a>를 이용해주세요.
          </p>
        </section>
      </div>
    </div>
  );
}
