import { defineField, defineType } from 'sanity';

export const series = defineType({
  name: 'series',
  title: 'Series',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Series name',
      type: 'string',
      description: 'For example: Trying In Marriage',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      description:
        'Created automatically from the name. Click Generate if it is empty. Letters, numbers and dashes only.',
      options: {
        source: 'title',
        maxLength: 96,
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
            : 'Use lowercase letters, numbers and dashes only — no spaces.';
        }),
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 3,
      description: 'One or two sentences about what this series covers.',
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers show first in the series filter. 1, 2, 3, 4.',
      initialValue: 99,
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'description' },
  },
});
