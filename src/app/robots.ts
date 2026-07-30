import type { MetadataRoute } from 'next';
import { siteUrl } from '@/sanity/env';

/**
 * The Studio is an editor tool behind auth, and the embed/preview routes are not
 * content — keep crawlers on the public pages and point them at the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio', '/studio/', '/api/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
