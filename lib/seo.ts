import { Metadata } from 'next';
import { PostMeta } from './posts';

export const SITE_NAME = '인간 수명 150세 가능한가?';
export const SITE_TAGLINE = '150세 시대의 생존전략';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://science-blog-dun.vercel.app';
export const SITE_DESCRIPTION = '인간 수명 150세, 현실이 될 수 있을까? 역노화·오가노이드·CRISPR·줄기세포 등 최신 생명과학 연구를 쉽게 풀어 드립니다. 150세 시대를 준비하는 생존전략.';

export function buildOgImageUrl(post: PostMeta): string {
  const params = new URLSearchParams({ title: post.title, category: post.category });
  if (post.journal) params.set('journal', post.journal);
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
      modifiedTime: post.updatedAt ?? post.date,
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
      '@type': 'Person',
      name: SITE_NAME,
      url: `${SITE_URL}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
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
