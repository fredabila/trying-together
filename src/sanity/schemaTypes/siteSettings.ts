import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    { name: 'show', title: 'The show', default: true },
    { name: 'listen', title: 'Listen on' },
    { name: 'social', title: 'Social links' },
    { name: 'home', title: 'Homepage text' },
    { name: 'contact', title: 'Contact page' },
  ],
  fields: [
    defineField({
      name: 'showName',
      title: 'Show name',
      type: 'string',
      group: 'show',
      initialValue: 'Trying Together',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'show',
      description: 'One short line. Used in the footer and when the site is shared.',
      initialValue: 'Both voices. No shame.',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short show description',
      type: 'text',
      group: 'show',
      rows: 4,
      description:
        'A couple of sentences describing the show. Used in the footer, and as the description search engines show.',
    }),
    defineField({
      name: 'showArtwork',
      title: 'Show artwork',
      type: 'image',
      group: 'show',
      options: { hotspot: true },
      description:
        'The square podcast cover. Used as a fallback for episodes without their own artwork, and as the image shown when links are shared.',
    }),
    defineField({
      name: 'listenLinks',
      title: 'Listen on',
      type: 'array',
      group: 'listen',
      description:
        'Where the show lives, as buttons on the homepage. Paste your show link for each platform — leave out any you are not on yet. Pick “Somewhere else” for anything not in the list.',
      of: [{ type: 'platformLink' }],
      validation: (rule) =>
        rule.custom((value) => {
          const links = (value ?? []) as { platform?: string }[];
          const seen = new Set<string>();
          for (const link of links) {
            if (!link.platform || link.platform === 'other') continue;
            if (seen.has(link.platform)) return `You have added ${link.platform} more than once.`;
            seen.add(link.platform);
          }
          return true;
        }),
    }),
    defineField({
      name: 'showEmbeds',
      title: 'Show players',
      type: 'array',
      group: 'listen',
      description:
        'Optional. A follow player for the whole show — the Spotify show embed, a YouTube channel trailer. Shown on the homepage. Add as many as you like.',
      of: [{ type: 'mediaEmbed' }],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      group: 'social',
      description: 'Shown in the footer and on the contact page.',
      of: [
        {
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'TikTok', value: 'tiktok' },
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'X / Twitter', value: 'x' },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'handle',
              title: 'Handle',
              type: 'string',
              description: 'For example @tryingtogetherpod. Shown as the link text.',
            }),
            defineField({
              name: 'url',
              title: 'Link',
              type: 'url',
              validation: (rule) => rule.required().uri({ scheme: ['http', 'https'] }),
            }),
          ],
          preview: { select: { title: 'platform', subtitle: 'handle' } },
        },
      ],
    }),
    defineField({
      name: 'heroHeading',
      title: 'Homepage headline',
      type: 'string',
      group: 'home',
      description: 'The large heading at the top of the homepage.',
      initialValue: 'One conversation that should have started years ago.',
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Homepage intro text',
      type: 'text',
      group: 'home',
      rows: 4,
      description: 'The paragraph under the homepage headline.',
    }),
    defineField({
      name: 'newsletterHeading',
      title: 'Email signup heading',
      type: 'string',
      group: 'home',
      initialValue: 'Join the Community',
    }),
    defineField({
      name: 'newsletterBody',
      title: 'Email signup text',
      type: 'text',
      group: 'home',
      rows: 3,
    }),
    defineField({
      name: 'contactHeading',
      title: 'Contact page heading',
      type: 'string',
      group: 'contact',
      initialValue: 'Get in Touch',
    }),
    defineField({
      name: 'contactIntro',
      title: 'Contact page intro text',
      type: 'text',
      group: 'contact',
      rows: 3,
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact email address',
      type: 'string',
      group: 'contact',
      description: 'Where messages from the contact form are sent.',
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true;
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))
            ? true
            : 'That does not look like an email address.';
        }),
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site settings' };
    },
  },
});
