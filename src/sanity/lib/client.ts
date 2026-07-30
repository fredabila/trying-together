import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId, useCdn, isSanityConfigured } from '../env';

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
  perspective: 'published',
});

/**
 * Fetch from Sanity without ever taking a page down with it.
 *
 * The site has to survive a missing project id, an empty dataset, or Sanity
 * being briefly unreachable — every caller falls back to sensible defaults when
 * this returns null.
 */
export async function safeFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  options: { tags?: string[]; revalidate?: number } = {},
): Promise<T | null> {
  if (!isSanityConfigured) return null;

  const { tags = [], revalidate = 60 } = options;

  try {
    return await client.fetch<T>(query, params, {
      next: tags.length ? { revalidate, tags } : { revalidate },
    });
  } catch (error) {
    console.error('Sanity fetch failed:', error instanceof Error ? error.message : error);
    return null;
  }
}
