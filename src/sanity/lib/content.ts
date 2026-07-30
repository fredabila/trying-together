import { safeFetch } from './client';
import {
  aboutPageQuery,
  allEpisodesQuery,
  episodeBySlugQuery,
  episodeSlugsQuery,
  homeEpisodeQuery,
  seriesListQuery,
  siteSettingsQuery,
} from './queries';
import type {
  AboutPage,
  Episode,
  EpisodeDetail,
  SeriesSummary,
  SiteSettings,
} from './types';
import { DEFAULT_ABOUT, DEFAULT_SERIES, DEFAULT_SETTINGS } from '@/lib/defaults';

/**
 * Every read the site does, in one place.
 *
 * Each helper merges Sanity content over a hand-written default, so the site is
 * presentable the moment it deploys and gets better as the client fills the
 * Studio in — no page ever shows an empty shell or a "not connected" notice.
 */

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await safeFetch<SiteSettings>(siteSettingsQuery, {}, {
    tags: ['siteSettings'],
  });
  return { ...DEFAULT_SETTINGS, ...stripEmpty(settings) };
}

export async function getAboutPage(): Promise<AboutPage> {
  const about = await safeFetch<AboutPage>(aboutPageQuery, {}, { tags: ['aboutPage'] });
  const merged = { ...DEFAULT_ABOUT, ...stripEmpty(about) };
  // Only fall back to the drafted copy while the client has added no sections.
  if (!merged.sections?.length) merged.sections = DEFAULT_ABOUT.sections;
  return merged;
}

export async function getHomeEpisode(): Promise<Episode | null> {
  return safeFetch<Episode>(homeEpisodeQuery, {}, { tags: ['episode'] });
}

export async function getAllEpisodes(): Promise<Episode[]> {
  return (await safeFetch<Episode[]>(allEpisodesQuery, {}, { tags: ['episode'] })) ?? [];
}

export async function getEpisode(slug: string): Promise<EpisodeDetail | null> {
  return safeFetch<EpisodeDetail>(episodeBySlugQuery, { slug }, { tags: ['episode'] });
}

export async function getEpisodeSlugs(): Promise<string[]> {
  return (await safeFetch<string[]>(episodeSlugsQuery, {}, { tags: ['episode'] })) ?? [];
}

export async function getSeriesList(): Promise<SeriesSummary[]> {
  const series = await safeFetch<SeriesSummary[]>(seriesListQuery, {}, { tags: ['series'] });
  return series?.length ? series : DEFAULT_SERIES;
}

/**
 * Drop null/undefined/empty values so a half-filled Sanity document does not
 * blank out a good default.
 */
function stripEmpty<T extends object>(input: T | null | undefined): Partial<T> {
  if (!input) return {};
  const output: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value === null || value === undefined) continue;
    if (typeof value === 'string' && value.trim() === '') continue;
    if (Array.isArray(value) && value.length === 0) continue;
    output[key] = value;
  }
  return output as Partial<T>;
}
