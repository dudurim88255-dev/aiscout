import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'AI Scout — AI 도구, 먼저 찾고 직접 검증했습니다', template: '%s | AI Scout' },
  description: 'ChatGPT, Claude, Midjourney 등 AI 도구를 직접 사용해보고 비교 분석합니다. 가격, 기능, 한국어 지원까지 솔직하게 정리했습니다.',
  keywords: ['AI 도구', 'AI 비교', 'ChatGPT', 'Claude', 'Midjourney', 'AI 추천'],
  authors: [{ name: 'AI Scout' }],
  creator: 'AI Scout',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aiscout.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'AI Scout',
  },
  themeColor: '#f59e0b',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={notoSansKR.className}>
      <head>
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
