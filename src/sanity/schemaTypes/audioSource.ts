import { defineField, defineType } from 'sanity';

/**
 * How an episode is played on the site.
 *
 * Three layers, and only the first is required:
 *
 *  1. The main player — either an uploaded file (our own branded player) or a
 *     single pasted share link.
 *  2. `embeds` — any number of extra players, for episodes that exist as both a
 *     Spotify audio episode and a YouTube video. Accepts share links or raw
 *     embed code, for platforms our resolver doesn't know.
 *  3. `platformLinks` — "also on…" buttons for every platform that gives no
 *     embed at all, which is most of them.
 *
 * `url` and `mode` are kept at their original names so episodes created before
 * the extra layers existed keep working untouched.
 */
export const audioSource = defineType({
  name: 'audioSource',
  title: 'How should this episode play?',
  type: 'object',
  options: { columns: 1 },
  fields: [
    defineField({
      name: 'mode',
      title: 'Main player',
      type: 'string',
      description:
        'Upload the audio to use our own player, or paste a link from Spotify, Apple, YouTube and friends.',
      options: {
        list: [
          { title: 'Upload the audio file (our own player)', value: 'self' },
          { title: 'Paste a link from another platform', value: 'platform' },
        ],
        layout: 'radio',
      },
      initialValue: 'self',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'file',
      title: 'Audio file',
      type: 'file',
      description: 'MP3 or M4A. This plays in our own player, right on the page.',
      options: { accept: 'audio/*' },
      hidden: ({ parent }) => parent?.mode !== 'self',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { mode?: string } | undefined;
          if (parent?.mode === 'self' && !value) {
            return 'Upload an audio file, or switch the main player to a pasted link.';
          }
          return true;
        }),
    }),
    defineField({
      name: 'url',
      title: 'Link to the episode',
      type: 'url',
      description:
        'Paste the normal share link — for example open.spotify.com/episode/…, podcasts.apple.com/…, youtube.com/watch?v=…, music.amazon.com/…, or soundcloud.com/…. We build the player for you.',
      hidden: ({ parent }) => parent?.mode !== 'platform',
      validation: (rule) =>
        rule
          .uri({ scheme: ['http', 'https'] })
          .custom((value, context) => {
            const parent = context.parent as { mode?: string } | undefined;
            if (parent?.mode === 'platform' && !value) {
              return 'Paste a link, or switch the main player to an uploaded file.';
            }
            return true;
          }),
    }),
    defineField({
      name: 'durationSeconds',
      title: 'Length in seconds',
      type: 'number',
      description:
        'Optional. Only used to show the running time in listings — the player works without it.',
      hidden: ({ parent }) => parent?.mode !== 'self',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'embeds',
      title: 'Extra players',
      type: 'array',
      description:
        'Optional. Add more players below the main one — a YouTube video alongside the audio, for example. Add as many as you need.',
      of: [{ type: 'mediaEmbed' }],
    }),
    defineField({
      name: 'platformLinks',
      title: 'Also available on',
      type: 'array',
      description:
        'Buttons linking to this episode everywhere else it lives. Most platforms cannot be embedded, so a link is the right thing for them.',
      of: [{ type: 'platformLink' }],
      validation: (rule) =>
        rule.custom((value) => {
          const links = (value ?? []) as { platform?: string; customLabel?: string }[];
          const seen = new Set<string>();
          for (const link of links) {
            // 'other' is intentionally repeatable — each one is a different site.
            if (!link.platform || link.platform === 'other') continue;
            if (seen.has(link.platform)) {
              return `You have added ${link.platform} more than once.`;
            }
            seen.add(link.platform);
          }
          return true;
        }),
    }),
  ],
});
