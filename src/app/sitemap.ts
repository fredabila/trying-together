import type { MetadataRoute } from 'next';
import { siteUrl } from '@/sanity/env';
import { getAllEpisodes, getSeriesList } from '@/sanity/lib/content';

/**
 * Sitemap covering every public route: the static pages plus one entry per
 * published episode and per series.
 *
 * `getAllEpisodes` already filters to episodes whose publish date has arrived,
 * so nothing unreleased leaks into the sitemap. The /studio route is
 * deliberately absent — it is an editor tool, not public content, and robots.ts
 * disallows it.
 *
 * Revalidation follows safeFetch's 60s fetch cache rather than a route-level
 * value, which that cache would override anyway.
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [episodes, series] = await Promise.all([getAllEpisodes(), getSeriesList()]);

  const newestEpisode = episodes[0]?.publishedAt;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      // The home page leads with the newest episode, so it changes when one lands.
      lastModified: newestEpisode ? new Date(newestEpisode) : new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/episodes`,
      lastModified: newestEpisode ? new Date(newestEpisode) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact`,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  const episodeRoutes: MetadataRoute.Sitemap = episodes.map((episode) => ({
    url: `${siteUrl}/episodes/${episode.slug}`,
    lastModified: new Date(episode.publishedAt),
    // An episode is fixed once published; only show notes get the odd tweak.
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Series pages only exist as filters on /episodes today, so link the filtered
  // view rather than inventing a route that would 404.
  const seriesRoutes: MetadataRoute.Sitemap = series
    .filter((entry) => entry.slug && entry.episodeCount > 0)
    .map((entry) => ({
      url: `${siteUrl}/episodes?series=${encodeURIComponent(entry.slug)}`,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

  return [...staticRoutes, ...episodeRoutes, ...seriesRoutes];
}
