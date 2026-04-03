import { Metadata } from 'next';
import { PostMeta } from './posts';

export const SITE_NAME = 'AI Scout';
export const SITE_TAGLINE = 'AI 도구, 먼저 찾고 직접 검증했습니다';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aiscout.vercel.app';
export const SITE_DESCRIPTION = 'ChatGPT, Claude, Midjourney 등 AI 도구를 직접 사용해보고 비교 분석합니다. 가격, 기능, 한국어 지원까지 솔직하게 정리했습니다.';

export function buildOgImageUrl(post: PostMeta): string {
  const params = new URLSearchParams({ title: post.title, category: post.category });
  return `${SITE_URL}/og?${params.toString()}`;
}

export function buildPostMetadata(post: PostMeta): Metadata {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = post.coverImage ? `${SITE_URL}${post.coverImage}` : buildOgImageUrl(post);
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.summary,
      url,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
      locale: 'ko_KR',
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.lastUpdated ?? post.date,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: [image],
    },
  };
}

export function buildArticleJsonLd(post: PostMeta) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = post.coverImage ? `${SITE_URL}${post.coverImage}` : buildOgImageUrl(post);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.summary,
    image,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: `${SITE_URL}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    datePublished: post.date,
    dateModified: post.lastUpdated ?? post.date,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: post.tags.join(', '),
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
