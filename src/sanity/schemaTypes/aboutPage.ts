import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * The About page, built out of movable sections.
 *
 * The client asked to be able to restructure this page themselves, so nothing
 * here is a fixed slot: they add, reorder and remove sections in the Studio and
 * the page renders whatever they end up with.
 */
export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  groups: [
    { name: 'intro', title: 'Top of the page', default: true },
    { name: 'sections', title: 'Page sections' },
    { name: 'seo', title: 'Sharing' },
  ],
  fields: [
    defineField({
      name: 'heading',
      title: 'Page heading',
      type: 'string',
      group: 'intro',
      description: 'The big heading at the top. For example: Our Story.',
      initialValue: 'Our Story',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'missionStatement',
      title: 'Mission statement',
      type: 'text',
      group: 'intro',
      rows: 4,
      description:
        'The one or two standout sentences shown just under the heading, in larger type.',
    }),
    defineField({
      name: 'portrait',
      title: 'Photo of Mike & Ros',
      type: 'image',
      group: 'intro',
      options: { hotspot: true },
      description:
        'Click the image to reposition it — the focal point you choose is kept when the photo is cropped on smaller screens.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Describe the photo',
          type: 'string',
          description: 'Read aloud by screen readers. For example: Mike and Ros standing together.',
          initialValue: 'Mike and Ros, hosts of Trying Together',
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
          description: 'Optional. Shown in small text under the photo.',
        }),
      ],
    }),
    defineField({
      name: 'sections',
      title: 'Page sections',
      type: 'array',
      group: 'sections',
      description:
        'Add as many sections as you like and drag them into the order you want. Everything below the photo is built from these.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'textSection',
          title: 'Text section',
          fields: [
            defineField({
              name: 'heading',
              title: 'Section heading',
              type: 'string',
              description: 'Optional. Leave empty for plain paragraphs with no heading.',
            }),
            defineField({
              name: 'body',
              title: 'Text',
              type: 'array',
              of: [{ type: 'block' }],
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'heading', body: 'body' },
            prepare({ title, body }) {
              const firstLine = Array.isArray(body)
                ? body
                    .find((block: { _type?: string }) => block?._type === 'block')
                    ?.children?.map((child: { text?: string }) => child.text)
                    .join('')
                : undefined;
              return {
                title: title || firstLine?.slice(0, 60) || 'Text section',
                subtitle: 'Text',
              };
            },
          },
        }),
        defineArrayMember({
          type: 'object',
          name: 'quoteSection',
          title: 'Pull quote',
          fields: [
            defineField({
              name: 'quote',
              title: 'Quote',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'attribution',
              title: 'Who said it',
              type: 'string',
              description: 'Optional. For example: Ros.',
            }),
          ],
          preview: {
            select: { title: 'quote', subtitle: 'attribution' },
            prepare({ title, subtitle }) {
              return {
                title: title ? `“${String(title).slice(0, 60)}”` : 'Pull quote',
                subtitle: subtitle ? `Quote · ${subtitle}` : 'Quote',
              };
            },
          },
        }),
        defineArrayMember({
          type: 'object',
          name: 'imageSection',
          title: 'Image',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (rule) => rule.required(),
              fields: [
                defineField({ name: 'alt', title: 'Describe the image', type: 'string' }),
              ],
            }),
            defineField({ name: 'caption', title: 'Caption', type: 'string' }),
          ],
          preview: {
            select: { title: 'caption', media: 'image' },
            prepare({ title, media }) {
              return { title: title || 'Image', subtitle: 'Image', media };
            },
          },
        }),
        defineArrayMember({
          type: 'object',
          name: 'valuesSection',
          title: 'List of points',
          description: 'A heading with short bullet-style points underneath.',
          fields: [
            defineField({ name: 'heading', title: 'Section heading', type: 'string' }),
            defineField({
              name: 'items',
              title: 'Points',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'item',
                  fields: [
                    defineField({
                      name: 'title',
                      title: 'Point',
                      type: 'string',
                      validation: (rule) => rule.required(),
                    }),
                    defineField({ name: 'body', title: 'Detail', type: 'text', rows: 3 }),
                  ],
                  preview: { select: { title: 'title', subtitle: 'body' } },
                },
              ],
              validation: (rule) => rule.required().min(1),
            }),
          ],
          preview: {
            select: { title: 'heading', items: 'items' },
            prepare({ title, items }) {
              const count = Array.isArray(items) ? items.length : 0;
              return {
                title: title || 'List of points',
                subtitle: `List · ${count} point${count === 1 ? '' : 's'}`,
              };
            },
          },
        }),
        defineArrayMember({
          type: 'object',
          name: 'ctaSection',
          title: 'Call to action',
          description: 'A short prompt with a button. Good for linking to the community or socials.',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'body', title: 'Supporting text', type: 'text', rows: 3 }),
            defineField({ name: 'buttonLabel', title: 'Button text', type: 'string' }),
            defineField({
              name: 'buttonUrl',
              title: 'Button link',
              type: 'string',
              description:
                'A full web address, or a page on this site such as /contact or /episodes.',
            }),
          ],
          preview: {
            select: { title: 'heading', subtitle: 'buttonLabel' },
            prepare({ title, subtitle }) {
              return {
                title: title || 'Call to action',
                subtitle: subtitle ? `Call to action · ${subtitle}` : 'Call to action',
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'seoTitle',
      title: 'Browser tab title',
      type: 'string',
      group: 'seo',
      description: 'Optional. Defaults to the page heading.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Description when shared',
      type: 'text',
      group: 'seo',
      rows: 3,
      description:
        'Optional. The blurb search engines and social apps show. Defaults to the mission statement.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'About page' };
    },
  },
});
