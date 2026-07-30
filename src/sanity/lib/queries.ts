import { groq } from 'next-sanity';

/**
 * Shared episode projection.
 *
 * `audio.fileUrl` is resolved here so pages never have to know that a
 * self-hosted episode is a Sanity file asset.
 */
const episodeFields = groq`
  _id,
  title,
  "slug": slug.current,
  episodeNumber,
  publishedAt,
  description,
  featured,
  coverImage,
  "series": series->{ _id, title, "slug": slug.current },
  "audio": {
    "mode": audio.mode,
    "url": audio.url,
    "fileUrl": audio.file.asset->url,
    "durationSeconds": audio.durationSeconds,
    "embeds": audio.embeds[]{
      _key, source, platform, url, iframeCode, label, height
    },
    "platformLinks": audio.platformLinks[]{
      _key, platform, customLabel, url
    }
  }
`;

/** Only episodes whose publish date has actually arrived. */
const publishedFilter = groq`_type == "episode" && defined(slug.current) && publishedAt <= now()`;

export const allEpisodesQuery = groq`
  *[${publishedFilter}] | order(publishedAt desc) {
    ${episodeFields}
  }
`;

/** A pinned episode if there is one, otherwise the newest. */
export const homeEpisodeQuery = groq`
  coalesce(
    *[${publishedFilter} && featured == true] | order(publishedAt desc)[0],
    *[${publishedFilter}] | order(publishedAt desc)[0]
  ) {
    ${episodeFields}
  }
`;

export const episodeBySlugQuery = groq`
  *[_type == "episode" && slug.current == $slug][0] {
    ${episodeFields},
    showNotes,
    transcript,
    guests[]{
      name,
      role,
      bio,
      link,
      photo
    }
  }
`;

export const episodeSlugsQuery = groq`
  *[${publishedFilter}].slug.current
`;

export const seriesListQuery = groq`
  *[_type == "series"] | order(order asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "episodeCount": count(*[_type == "episode" && references(^._id) && publishedAt <= now()])
  }
`;

export const aboutPageQuery = groq`
  *[_type == "aboutPage"][0] {
    heading,
    missionStatement,
    portrait,
    seoTitle,
    seoDescription,
    sections[]{
      _key,
      _type,
      _type == "textSection" => { heading, body },
      _type == "quoteSection" => { quote, attribution },
      _type == "imageSection" => { image, caption },
      _type == "valuesSection" => { heading, items[]{ title, body } },
      _type == "ctaSection" => { heading, body, buttonLabel, buttonUrl }
    }
  }
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    showName,
    tagline,
    shortDescription,
    showArtwork,
    listenLinks[]{ _key, platform, customLabel, url },
    showEmbeds[]{ _key, source, platform, url, iframeCode, label, height },
    socialLinks[]{ platform, handle, url },
    heroHeading,
    heroSubheading,
    newsletterHeading,
    newsletterBody,
    contactHeading,
    contactIntro,
    contactEmail
  }
`;
