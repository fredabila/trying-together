import type { StructureResolver } from 'sanity/structure';

const SINGLETONS = ['aboutPage', 'siteSettings'] as const;

/**
 * Studio sidebar, arranged around what the client actually does day to day:
 * add an episode, edit the About page, update links.
 *
 * The two singletons open straight into their editor instead of showing a
 * pointless one-item list, and episodes are browsable both as a flat list and
 * grouped by series.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Trying Together')
    .items([
      S.listItem()
        .title('Episodes')
        .icon(() => '🎧')
        .child(
          S.list()
            .title('Episodes')
            .items([
              S.listItem()
                .title('All episodes')
                .icon(() => '📚')
                .child(
                  S.documentTypeList('episode')
                    .title('All episodes')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
                ),
              S.listItem()
                .title('By series')
                .icon(() => '🗂')
                .child(
                  S.documentTypeList('series')
                    .title('By series')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                    .child((seriesId) =>
                      S.documentList()
                        .title('Episodes')
                        .filter('_type == "episode" && series._ref == $seriesId')
                        .params({ seriesId })
                        .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
                    ),
                ),
              S.divider(),
              S.listItem()
                .title('Pinned on homepage')
                .icon(() => '📌')
                .child(
                  S.documentList()
                    .title('Pinned on homepage')
                    .filter('_type == "episode" && featured == true')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
                ),
              S.listItem()
                .title('Scheduled for later')
                .icon(() => '🕓')
                .child(
                  S.documentList()
                    .title('Scheduled for later')
                    .filter('_type == "episode" && publishedAt > now()')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'asc' }]),
                ),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title('About page')
        .icon(() => '📝')
        .child(S.document().schemaType('aboutPage').documentId('aboutPage').title('About page')),

      S.listItem()
        .title('Series')
        .icon(() => '🏷')
        .child(
          S.documentTypeList('series')
            .title('Series')
            .defaultOrdering([{ field: 'order', direction: 'asc' }]),
        ),

      S.divider(),

      S.listItem()
        .title('Site settings')
        .icon(() => '⚙️')
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings').title('Site settings'),
        ),

      S.divider(),

      S.listItem()
        .title('Subscribers')
        .icon(() => '📬')
        .child(
          S.documentTypeList('subscriber')
            .title('Subscribers')
            .defaultOrdering([{ field: 'subscribedAt', direction: 'desc' }]),
        ),

      // Anything added to the schema later still shows up, minus the items
      // already placed above by hand.
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId();
        return id ? !['episode', 'series', 'subscriber', ...SINGLETONS].includes(id) : false;
      }),
    ]);

export const singletonTypes = new Set<string>(SINGLETONS);
