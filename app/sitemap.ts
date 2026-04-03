import type { MetadataRoute } from 'next';
import { getAllPosts, CATEGORY_MAP, getAllTags } from '@/lib/posts';
import { SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = Object.keys(CATEGORY_MAP).map((cat) => ({
    url: `${SITE_URL}/category/${cat}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => {
    const dateStr = post.lastUpdated || post.date;
    const lastModified = dateStr ? new Date(dateStr) : now;
    return {
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: isNaN(lastModified.getTime()) ? now : lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    };
  });

  const tagRoutes: MetadataRoute.Sitemap = getAllTags().map((tag) => ({
    url: `${SITE_URL}/tag/${encodeURIComponent(tag)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...tagRoutes, ...postRoutes];
}
