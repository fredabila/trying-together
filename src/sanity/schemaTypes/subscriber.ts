import { defineType, defineField } from 'sanity';

/**
 * Stores email sign-ups captured from the website.
 * Admins can browse these in the Studio and export via
 * sanity.io/manage → dataset → Export, or via the GROQ Vision tab.
 *
 * Documents are write-only from the public site (created via the
 * /api/subscribe route using a write-only token) — nobody on the
 * front-end can read or list them.
 */
export const subscriber = defineType({
  name: 'subscriber',
  title: 'Subscriber',
  type: 'document',
  // Hide from the "create new" menu — entries come in from the form only.
  __experimental_actions: ['read', 'update', 'delete'],
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'subscribedAt',
      title: 'Subscribed at',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'source',
      title: 'Source',
      description: 'Which page the subscriber signed up from.',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'active',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Unsubscribed', value: 'unsubscribed' },
        ],
        layout: 'radio',
      },
    }),
  ],
  preview: {
    select: {
      title: 'email',
      subtitle: 'subscribedAt',
      status: 'status',
    },
    prepare({ title, subtitle, status }) {
      return {
        title,
        subtitle: [
          subtitle ? new Date(subtitle).toLocaleDateString() : 'Unknown date',
          status === 'unsubscribed' ? '· unsubscribed' : '',
        ]
          .join(' ')
          .trim(),
      };
    },
  },
});
