import { defineField, defineType } from 'sanity';

import { PLATFORM_OPTIONS } from '../../lib/platforms';

/**
 * A "listen here too" button — one per platform the episode is on.
 *
 * Separate from mediaEmbed on purpose: this is a link out, not a player. Most
 * platforms give no embed at all, and even the ones that do only need one
 * inline player, not five.
 */
export const platformLink = defineType({
  name: 'platformLink',
  title: 'Platform link',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: { list: PLATFORM_OPTIONS },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'customLabel',
      title: 'Platform name',
      type: 'string',
      description: 'What to call it on the button.',
      hidden: ({ parent }) => parent?.platform !== 'other',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { platform?: string } | undefined;
          if (parent?.platform === 'other' && !value?.trim()) {
            return 'Give this platform a name so the button has something to say.';
          }
          return true;
        }),
    }),
    defineField({
      name: 'url',
      title: 'Link',
      type: 'url',
      description: 'The episode’s page on that platform.',
      validation: (rule) => rule.required().uri({ scheme: ['http', 'https'] }),
    }),
  ],
  preview: {
    select: { platform: 'platform', customLabel: 'customLabel', url: 'url' },
    prepare({ platform, customLabel, url }) {
      return { title: customLabel || platform || 'Platform link', subtitle: url };
    },
  },
});
