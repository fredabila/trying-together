import type { PortableTextBlock } from '@portabletext/react';
import type { Image } from 'sanity';

import type { PlatformId } from '@/lib/platforms';

export type SanityImage = Image & {
  alt?: string;
  caption?: string;
};

/** One extra player on an episode — a share link or vetted embed code. */
export type MediaEmbedData = {
  _key?: string;
  source?: 'link' | 'iframe';
  platform?: PlatformId;
  url?: string;
  iframeCode?: string;
  label?: string;
  height?: number;
};

/** An "also on…" button. */
export type PlatformLinkData = {
  _key?: string;
  platform: PlatformId;
  customLabel?: string;
  url: string;
};

export type EpisodeAudioData = {
  mode?: 'self' | 'platform';
  url?: string;
  fileUrl?: string;
  durationSeconds?: number;
  embeds?: MediaEmbedData[];
  platformLinks?: PlatformLinkData[];
};

export type SeriesRef = {
  _id: string;
  title: string;
  slug: string;
};

export type SeriesSummary = SeriesRef & {
  description?: string;
  episodeCount: number;
};

export type Guest = {
  name: string;
  role?: string;
  bio?: string;
  link?: string;
  photo?: SanityImage;
};

export type Episode = {
  _id: string;
  title: string;
  slug: string;
  episodeNumber?: number;
  publishedAt: string;
  description?: string;
  featured?: boolean;
  coverImage?: SanityImage;
  series?: SeriesRef;
  audio?: EpisodeAudioData;
};

export type EpisodeDetail = Episode & {
  showNotes?: PortableTextBlock[];
  transcript?: PortableTextBlock[];
  guests?: Guest[];
};

export type AboutSection =
  | {
      _key: string;
      _type: 'textSection';
      heading?: string;
      body?: PortableTextBlock[];
    }
  | {
      _key: string;
      _type: 'quoteSection';
      quote?: string;
      attribution?: string;
    }
  | {
      _key: string;
      _type: 'imageSection';
      image?: SanityImage;
      caption?: string;
    }
  | {
      _key: string;
      _type: 'valuesSection';
      heading?: string;
      items?: { title: string; body?: string }[];
    }
  | {
      _key: string;
      _type: 'ctaSection';
      heading?: string;
      body?: string;
      buttonLabel?: string;
      buttonUrl?: string;
    };

export type AboutPage = {
  heading?: string;
  missionStatement?: string;
  portrait?: SanityImage;
  seoTitle?: string;
  seoDescription?: string;
  sections?: AboutSection[];
};

/**
 * Kept as an alias so existing imports keep working. The list of platforms now
 * lives in src/lib/platforms.ts, shared with the Studio dropdowns.
 */
export type ListenPlatform = PlatformId;

export type SocialPlatform =
  | 'instagram'
  | 'tiktok'
  | 'facebook'
  | 'linkedin'
  | 'youtube'
  | 'x';

export type SiteSettings = {
  showName?: string;
  tagline?: string;
  shortDescription?: string;
  showArtwork?: SanityImage;
  listenLinks?: PlatformLinkData[];
  showEmbeds?: MediaEmbedData[];
  socialLinks?: { platform: SocialPlatform; handle?: string; url: string }[];
  heroHeading?: string;
  heroSubheading?: string;
  newsletterHeading?: string;
  newsletterBody?: string;
  contactHeading?: string;
  contactIntro?: string;
  contactEmail?: string;
};
