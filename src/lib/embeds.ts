/**
 * Turns a normal share link into the embed the platform actually offers.
 *
 * The client is not technical, so they never copy iframe code — they paste the
 * same link they'd send a friend and we work out the rest. Anything we don't
 * recognise degrades to a plain "listen on…" link rather than breaking.
 */

export type EmbedPlatform =
  | 'spotify'
  | 'apple'
  | 'youtube'
  | 'amazon'
  | 'soundcloud'
  | 'deezer'
  | 'generic'
  | 'audio'
  | 'unknown';

/**
 * Hosts we will put inside an iframe.
 *
 * An allowlist rather than a blocklist: a pasted embed can execute in the
 * context of an iframe, so an unrecognised host degrades to a plain link rather
 * than being trusted. Covers the mainstream platforms plus the common podcast
 * hosts whose players clients are most likely to be given.
 *
 * Kept in sync by hand with ALLOWED_EMBED_HOSTS in
 * src/sanity/schemaTypes/mediaEmbed.ts, which validates this at edit time.
 */
const ALLOWED_EMBED_HOSTS = [
  'spotify.com',
  'podcasts.apple.com',
  'embed.podcasts.apple.com',
  'youtube.com',
  'youtube-nocookie.com',
  'youtu.be',
  'music.amazon.com',
  'soundcloud.com',
  'w.soundcloud.com',
  'deezer.com',
  'widget.deezer.com',
  'iheart.com',
  'tunein.com',
  'castbox.fm',
  'player.fm',
  'podbean.com',
  'buzzsprout.com',
  'megaphone.fm',
  'player.captivate.fm',
  'redcircle.com',
  'transistor.fm',
  'share.transistor.fm',
  'simplecast.com',
  'player.simplecast.com',
  'libsyn.com',
  'html5-player.libsyn.com',
  'acast.com',
  'embed.acast.com',
  'anchor.fm',
  'podcasters.spotify.com',
  'audioboom.com',
  'blubrry.com',
  'fireside.fm',
  'zencast.fm',
  'spreaker.com',
  'widget.spreaker.com',
];

function isAllowedEmbedHost(host: string): boolean {
  const clean = host.replace(/^www\./, '').toLowerCase();
  return ALLOWED_EMBED_HOSTS.some((h) => clean === h || clean.endsWith(`.${h}`));
}

export type ResolvedEmbed = {
  platform: EmbedPlatform;
  /** Platform name as a person would read it. */
  label: string;
  /** iframe src, when the platform gives us one. */
  embedUrl?: string;
  /** Height in px that suits this platform's player. */
  height?: number;
  /** Whether the iframe needs to allow fullscreen video. */
  video?: boolean;
  /** The original link, always kept so we can fall back to it. */
  originalUrl: string;
};

const PLATFORM_LABELS: Record<EmbedPlatform, string> = {
  spotify: 'Spotify',
  apple: 'Apple Podcasts',
  youtube: 'YouTube',
  amazon: 'Amazon Music',
  soundcloud: 'SoundCloud',
  deezer: 'Deezer',
  generic: 'the player',
  audio: 'Audio',
  unknown: 'this platform',
};

function safeParse(raw: string): URL | null {
  try {
    return new URL(raw.trim());
  } catch {
    return null;
  }
}

/**
 * If someone pastes full iframe code anyway, pull the src out of it so it still
 * works instead of rendering escaped HTML on the page.
 */
function extractIframeSrc(raw: string): string | null {
  const match = raw.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

export function resolveEmbed(rawInput: string | undefined | null): ResolvedEmbed | null {
  if (!rawInput) return null;

  const fromIframe = extractIframeSrc(rawInput);
  const raw = (fromIframe ?? rawInput).trim();
  const url = safeParse(raw);
  if (!url) return null;

  const host = url.hostname.replace(/^www\./, '').toLowerCase();
  const segments = url.pathname.split('/').filter(Boolean);
  const originalUrl = raw;

  // --- Spotify -------------------------------------------------------------
  // open.spotify.com/episode/<id>  |  /show/<id>  |  already-embedded /embed/…
  if (host.endsWith('spotify.com')) {
    const embedIndex = segments.indexOf('embed');
    const parts = embedIndex === 0 ? segments.slice(1) : segments;
    const [kind, id] = parts;
    if (kind && id) {
      return {
        platform: 'spotify',
        label: PLATFORM_LABELS.spotify,
        embedUrl: `https://open.spotify.com/embed/${kind}/${id}`,
        height: kind === 'show' ? 352 : 232,
        originalUrl,
      };
    }
    return { platform: 'spotify', label: PLATFORM_LABELS.spotify, originalUrl };
  }

  // --- Apple Podcasts ------------------------------------------------------
  // podcasts.apple.com/<country>/podcast/<name>/id123?i=456
  if (host.endsWith('podcasts.apple.com') || host.endsWith('embed.podcasts.apple.com')) {
    const embedUrl = new URL(url.toString());
    embedUrl.hostname = 'embed.podcasts.apple.com';
    const isEpisode = embedUrl.searchParams.has('i');
    return {
      platform: 'apple',
      label: PLATFORM_LABELS.apple,
      embedUrl: embedUrl.toString(),
      height: isEpisode ? 175 : 450,
      originalUrl,
    };
  }

  // --- YouTube -------------------------------------------------------------
  // youtube.com/watch?v=<id> | youtu.be/<id> | /embed/<id> | /live/<id> | /shorts/<id>
  if (host.endsWith('youtube.com') || host === 'youtu.be' || host.endsWith('youtube-nocookie.com')) {
    let id: string | undefined;
    let listId = url.searchParams.get('list') ?? undefined;

    if (host === 'youtu.be') {
      id = segments[0];
    } else if (segments[0] === 'watch') {
      id = url.searchParams.get('v') ?? undefined;
    } else if (['embed', 'live', 'shorts', 'v'].includes(segments[0] ?? '')) {
      id = segments[1];
    } else if (segments[0] === 'playlist') {
      listId = url.searchParams.get('list') ?? listId;
    }

    if (id) {
      const embed = new URL(`https://www.youtube-nocookie.com/embed/${id}`);
      if (listId) embed.searchParams.set('list', listId);
      return {
        platform: 'youtube',
        label: PLATFORM_LABELS.youtube,
        embedUrl: embed.toString(),
        video: true,
        originalUrl,
      };
    }
    if (listId) {
      return {
        platform: 'youtube',
        label: PLATFORM_LABELS.youtube,
        embedUrl: `https://www.youtube-nocookie.com/embed/videoseries?list=${listId}`,
        video: true,
        originalUrl,
      };
    }
    return { platform: 'youtube', label: PLATFORM_LABELS.youtube, originalUrl };
  }

  // --- Amazon Music --------------------------------------------------------
  // Amazon has no public iframe embed for podcasts, so we link out on purpose.
  if (host.endsWith('music.amazon.com') || host.endsWith('amazon.com')) {
    return { platform: 'amazon', label: PLATFORM_LABELS.amazon, originalUrl };
  }

  // --- SoundCloud ----------------------------------------------------------
  if (host.endsWith('soundcloud.com')) {
    const embed = new URL('https://w.soundcloud.com/player/');
    embed.searchParams.set('url', originalUrl);
    embed.searchParams.set('color', '#243D2C');
    embed.searchParams.set('hide_related', 'true');
    embed.searchParams.set('show_comments', 'false');
    embed.searchParams.set('show_teaser', 'false');
    return {
      platform: 'soundcloud',
      label: PLATFORM_LABELS.soundcloud,
      embedUrl: embed.toString(),
      height: 166,
      originalUrl,
    };
  }

  // --- Deezer --------------------------------------------------------------
  // deezer.com/<lang>/episode/<id> -> widget.deezer.com/widget/dark/episode/<id>
  if (host.endsWith('deezer.com')) {
    const kindIndex = segments.findIndex((s) => ['episode', 'show', 'album', 'playlist'].includes(s));
    const kind = segments[kindIndex];
    const id = segments[kindIndex + 1];
    if (kind && id) {
      return {
        platform: 'deezer',
        label: PLATFORM_LABELS.deezer,
        embedUrl: `https://widget.deezer.com/widget/dark/${kind}/${id}`,
        height: kind === 'episode' ? 200 : 300,
        originalUrl,
      };
    }
    return { platform: 'deezer', label: PLATFORM_LABELS.deezer, originalUrl };
  }

  // --- A bare audio file ---------------------------------------------------
  // Someone may paste a direct MP3 link rather than uploading it. Treat that as
  // our own player instead of an embed.
  if (/\.(mp3|m4a|aac|ogg|wav|flac)(\?|$)/i.test(url.pathname + url.search)) {
    return { platform: 'audio', label: PLATFORM_LABELS.audio, originalUrl };
  }

  // --- A known podcast host ------------------------------------------------
  // If the link came out of an iframe on a host we trust, it is already a player
  // address — render it rather than throwing away a working embed.
  if (fromIframe && isAllowedEmbedHost(host)) {
    return {
      platform: 'generic',
      label: PLATFORM_LABELS.generic,
      embedUrl: originalUrl,
      height: 200,
      originalUrl,
    };
  }

  return { platform: 'unknown', label: PLATFORM_LABELS.unknown, originalUrl };
}

/**
 * Resolve pasted embed code into something we can safely render.
 *
 * Pulls the src out of the iframe and checks it against the allowlist. The
 * pasted markup itself is always discarded — we never inject client HTML into
 * the page, only reconstruct an iframe from a URL we have vetted. Anything from
 * an unrecognised host returns null so the caller can fall back to a link.
 */
export function resolveIframeEmbed(rawCode: string | undefined | null): ResolvedEmbed | null {
  if (!rawCode) return null;

  const src = extractIframeSrc(rawCode) ?? rawCode.trim();
  const url = safeParse(src);
  if (!url) return null;
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
  if (!isAllowedEmbedHost(url.hostname)) return null;

  // Let the normal resolver have it first — it knows the good heights and
  // whether a given platform is video.
  const resolved = resolveEmbed(url.toString());
  if (resolved?.embedUrl) return resolved;

  return {
    platform: 'generic',
    label: PLATFORM_LABELS.generic,
    embedUrl: url.toString(),
    height: 200,
    originalUrl: url.toString(),
  };
}

/** Default iframe height for a platform, used when the resolver has no opinion. */
export function embedHeight(embed: ResolvedEmbed): number {
  if (embed.height) return embed.height;
  return embed.video ? 0 : 232; // 0 => use a 16:9 aspect box instead
}
