import { defineField, defineType } from 'sanity';

export const episode = defineType({
  name: 'episode',
  title: 'Episode',
  type: 'document',
  groups: [
    { name: 'main', title: 'Episode', default: true },
    { name: 'player', title: 'Audio' },
    { name: 'notes', title: 'Show notes & guests' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Episode title',
      type: 'string',
      group: 'main',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      group: 'main',
      description:
        'The end of the episode’s web address. Click Generate to fill it from the title. Letters, numbers and dashes only — no spaces.',
      options: {
        source: 'title',
        maxLength: 96,
        // Spaces or punctuation here produce a URL that 404s, so force a safe
        // shape rather than trusting whatever gets typed in.
        slugify: (input) =>
          input
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 96),
      },
      validation: (rule) =>
        rule.required().custom((value) => {
          const current = value?.current;
          if (!current) return 'Click Generate to create the web address.';
          return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(current)
            ? true
            : 'Use lowercase letters, numbers and dashes only — no spaces. Click Generate to fix this.';
        }),
    }),
    defineField({
      name: 'episodeNumber',
      title: 'Episode number',
      type: 'number',
      group: 'main',
      description: 'Optional. Shown as “Ep 12” on the episode cards.',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'series',
      title: 'Series',
      type: 'reference',
      group: 'main',
      to: [{ type: 'series' }],
      description: 'Which of the four series this episode belongs to.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publish date',
      type: 'datetime',
      group: 'main',
      description:
        'Episodes are ordered newest first using this date. Future dates stay hidden until they arrive.',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      group: 'main',
      rows: 3,
      description:
        'One or two sentences. Shown on the episodes list and used when the episode is shared.',
      validation: (rule) => rule.max(300).warning('Shorter descriptions read better on cards.'),
    }),
    defineField({
      name: 'coverImage',
      title: 'Episode artwork',
      type: 'image',
      group: 'main',
      options: { hotspot: true },
      description: 'Optional. Falls back to the show artwork if you leave this empty.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Describe the image',
          type: 'string',
          description: 'For screen readers and when the image cannot load.',
        }),
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Pin to the top of the homepage',
      type: 'boolean',
      group: 'main',
      description:
        'Off by default. When on, this episode shows on the homepage instead of the newest one.',
      initialValue: false,
    }),
    defineField({
      name: 'audio',
      title: 'How should this episode play?',
      type: 'audioSource',
      group: 'player',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'showNotes',
      title: 'Show notes',
      type: 'array',
      group: 'notes',
      of: [{ type: 'block' }],
      description: 'Links, timestamps, anything you mentioned in the episode.',
    }),
    defineField({
      name: 'guests',
      title: 'Guests',
      type: 'array',
      group: 'notes',
      description: 'Add one entry per guest. Leave empty if it is just the two of you.',
      of: [
        {
          type: 'object',
          name: 'guest',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'role', title: 'Who they are', type: 'string' }),
            defineField({ name: 'bio', title: 'Short bio', type: 'text', rows: 3 }),
            defineField({
              name: 'photo',
              title: 'Photo',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({ name: 'link', title: 'Their website or social link', type: 'url' }),
          ],
          preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
        },
      ],
    }),
    defineField({
      name: 'transcript',
      title: 'Transcript',
      type: 'array',
      group: 'notes',
      of: [{ type: 'block' }],
      description: 'Optional, and can be added later. Shows in a collapsible panel.',
    }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Oldest first',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
    {
      title: 'Episode number',
      name: 'episodeNumberDesc',
      by: [{ field: 'episodeNumber', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      seriesTitle: 'series.title',
      publishedAt: 'publishedAt',
      episodeNumber: 'episodeNumber',
      media: 'coverImage',
    },
    prepare({ title, seriesTitle, publishedAt, episodeNumber, media }) {
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : 'No date';
      const number = typeof episodeNumber === 'number' ? `Ep ${episodeNumber} · ` : '';
      return {
        title,
        subtitle: `${number}${seriesTitle ?? 'No series'} · ${date}`,
        media,
      };
    },
  },
});
