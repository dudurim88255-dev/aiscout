import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MouseGradient from '@/components/MouseGradient';
import './globals.css';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto',
});

export const metadata: Metadata = {
  title: { default: 'AI Scout — AI 도구 비교·리뷰·사용법', template: '%s | AI Scout' },
  description: 'ChatGPT, Claude, Gemini 등 AI 도구를 직접 사용해보고 가격·기능·한국어 지원을 비교합니다. 국내 블로그 중 가장 빠른 AI 도구 리뷰.',
  keywords: ['AI 도구 비교', 'AI 추천 2026', 'ChatGPT 리뷰', 'Claude 사용법', 'Gemini 비교', '무료 AI 도구', 'AI 도구 순위'],
  authors: [{ name: 'AI Scout' }],
  creator: 'AI Scout',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aiscout.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'AI Scout',
  },
  themeColor: '#f59e0b',
  verification: { google: 'de9TSsBBneQps0DJ0It1vzBsUTeGLGOoqqjAvSsx3fI' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <head>
        {process.env.NEXT_PUBLIC_ADSENSE_ACCOUNT && (
          <meta name="google-adsense-account" content={process.env.NEXT_PUBLIC_ADSENSE_ACCOUNT} />
        )}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body>
        <MouseGradient />
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
