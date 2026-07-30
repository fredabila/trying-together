/**
 * Every platform an episode or the show can live on.
 *
 * One list, used by both the Studio dropdowns and the buttons on the site, so
 * the two can never drift apart. Adding a platform here makes it appear in the
 * Studio and render correctly on the page with no other changes.
 *
 * `verb` is how the button reads — you watch YouTube, you listen to Spotify,
 * and an RSS feed is neither.
 */

export type PlatformId =
  | 'spotify'
  | 'apple'
  | 'youtube'
  | 'youtubeMusic'
  | 'amazon'
  | 'audible'
  | 'iheart'
  | 'pocketcasts'
  | 'overcast'
  | 'castbox'
  | 'castro'
  | 'deezer'
  | 'tunein'
  | 'podcastAddict'
  | 'playerFm'
  | 'podchaser'
  | 'goodpods'
  | 'soundcloud'
  | 'rss'
  | 'other';

export type PlatformMeta = {
  id: PlatformId;
  /** Platform name as a person would read it. */
  label: string;
  verb: 'Listen on' | 'Watch on' | 'none';
};

export const PLATFORMS: PlatformMeta[] = [
  { id: 'spotify', label: 'Spotify', verb: 'Listen on' },
  { id: 'apple', label: 'Apple Podcasts', verb: 'Listen on' },
  { id: 'youtube', label: 'YouTube', verb: 'Watch on' },
  { id: 'youtubeMusic', label: 'YouTube Music', verb: 'Listen on' },
  { id: 'amazon', label: 'Amazon Music', verb: 'Listen on' },
  { id: 'audible', label: 'Audible', verb: 'Listen on' },
  { id: 'iheart', label: 'iHeartRadio', verb: 'Listen on' },
  { id: 'pocketcasts', label: 'Pocket Casts', verb: 'Listen on' },
  { id: 'overcast', label: 'Overcast', verb: 'Listen on' },
  { id: 'castbox', label: 'Castbox', verb: 'Listen on' },
  { id: 'castro', label: 'Castro', verb: 'Listen on' },
  { id: 'deezer', label: 'Deezer', verb: 'Listen on' },
  { id: 'tunein', label: 'TuneIn', verb: 'Listen on' },
  { id: 'podcastAddict', label: 'Podcast Addict', verb: 'Listen on' },
  { id: 'playerFm', label: 'Player FM', verb: 'Listen on' },
  { id: 'podchaser', label: 'Podchaser', verb: 'Listen on' },
  { id: 'goodpods', label: 'Goodpods', verb: 'Listen on' },
  { id: 'soundcloud', label: 'SoundCloud', verb: 'Listen on' },
  { id: 'rss', label: 'RSS feed', verb: 'none' },
  { id: 'other', label: 'Somewhere else', verb: 'Listen on' },
];

/** Shape Sanity's `options.list` expects. */
export const PLATFORM_OPTIONS = PLATFORMS.map(({ id, label }) => ({
  title: label,
  value: id,
}));

const BY_ID = new Map(PLATFORMS.map((p) => [p.id, p]));

export function platformMeta(id?: string): PlatformMeta | undefined {
  return id ? BY_ID.get(id as PlatformId) : undefined;
}

/**
 * Button text for a platform link.
 *
 * `customLabel` covers 'other', where the client types the platform name
 * themselves rather than us guessing it.
 */
export function platformLinkLabel(id?: string, customLabel?: string): string {
  const meta = platformMeta(id);
  const name = customLabel?.trim() || meta?.label || 'this platform';

  if (!meta || meta.verb === 'none') return name;
  return `${meta.verb} ${name}`;
}
