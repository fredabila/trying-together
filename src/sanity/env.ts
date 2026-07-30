export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-07-22';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';

/** Cached responses are fine for a content site; drafts are never served. */
export const useCdn = true;

/** False in a fresh clone with no env file — the site then renders its defaults. */
export const isSanityConfigured =
  Boolean(projectId) && projectId !== 'replace-me-with-your-project-id';

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://tryingtogetherpodcast.com'
).replace(/\/$/, '');
