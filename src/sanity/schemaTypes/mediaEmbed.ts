import { defineField, defineType } from 'sanity';

import { PLATFORM_OPTIONS } from '../../lib/platforms';

/**
 * One embedded player on an episode page.
 *
 * Two ways in, because clients differ:
 *  - 'link'   -> paste the normal share link and we build the player
 *  - 'iframe' -> paste the embed code a platform gave them, for anything our
 *                resolver doesn't know about
 *
 * Episodes can hold several of these, so a single episode can show a Spotify
 * player and a YouTube video together.
 */
export const mediaEmbed = defineType({
  name: 'mediaEmbed',
  title: 'Embedded player',
  type: 'object',
  fields: [
    defineField({
      name: 'source',
      title: 'How are you adding this?',
      type: 'string',
      options: {
        list: [
          { title: 'Paste a share link (easiest)', value: 'link' },
          { title: 'Paste embed code from the platform', value: 'iframe' },
        ],
        layout: 'radio',
      },
      initialValue: 'link',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'platform',
      title: 'Which platform is this?',
      type: 'string',
      description: 'Only used for the label. We detect the platform from the link automatically.',
      options: { list: PLATFORM_OPTIONS },
      hidden: ({ parent }) => parent?.source !== 'iframe',
    }),
    defineField({
      name: 'url',
      title: 'Share link',
      type: 'url',
      description:
        'The normal link you would send a friend — open.spotify.com/episode/…, podcasts.apple.com/…, youtube.com/watch?v=…, soundcloud.com/…, and others.',
      hidden: ({ parent }) => parent?.source !== 'link',
      validation: (rule) =>
        rule.uri({ scheme: ['http', 'https'] }).custom((value, context) => {
          const parent = context.parent as { source?: string } | undefined;
          if (parent?.source === 'link' && !value) return 'Paste the share link.';
          return true;
        }),
    }),
    defineField({
      name: 'iframeCode',
      title: 'Embed code',
      type: 'text',
      rows: 4,
      description:
        'Paste the whole <iframe …> block the platform gave you. We keep only the player address and drop anything unsafe.',
      hidden: ({ parent }) => parent?.source !== 'iframe',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { source?: string } | undefined;
          if (parent?.source !== 'iframe') return true;
          if (!value) return 'Paste the embed code.';

          const raw = String(value);
          const src = raw.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i)?.[1] ?? raw.trim();
          let host: string;
          try {
            host = new URL(src).hostname.replace(/^www\./, '').toLowerCase();
          } catch {
            return 'That does not look like embed code. It should contain an iframe with a src address.';
          }

          // Mirrors the runtime allowlist in src/lib/embeds.ts. Catching it here
          // means the client finds out while editing, not after publishing.
          return ALLOWED_EMBED_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))
            ? true
            : `We do not allow embeds from ${host} for security reasons. Add it as a platform link instead and it becomes a button.`;
        }),
    }),
    defineField({
      name: 'label',
      title: 'Heading above this player',
      type: 'string',
      description: 'Optional. Useful when an episode has more than one player, e.g. “Watch the video”.',
    }),
    defineField({
      name: 'height',
      title: 'Player height in pixels',
      type: 'number',
      description:
        'Optional. Leave empty and we pick a sensible height. Video players always size themselves.',
      validation: (rule) => rule.min(80).max(1200),
    }),
  ],
  preview: {
    select: { label: 'label', platform: 'platform', url: 'url', source: 'source' },
    prepare({ label, platform, url, source }) {
      return {
        title: label || platform || (source === 'iframe' ? 'Embed code' : 'Share link'),
        subtitle: url || (source === 'iframe' ? 'Pasted embed code' : undefined),
      };
    },
  },
});

/**
 * Hosts we will render inside an iframe.
 *
 * Kept in sync with src/lib/embeds.ts by hand — duplicated deliberately so the
 * Studio bundle doesn't pull in site-only code.
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
