import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';
import EpisodeCard from '@/components/EpisodeCard';
import { getAllEpisodes, getSeriesList, getSiteSettings } from '@/sanity/lib/content';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Episodes',
  description:
    'Every episode of Trying Together, browsable by series — Trying In Marriage, The Financial Reality, Trying To Communicate and Sticking Together.',
  alternates: { canonical: '/episodes' },
};

/**
 * Filtering runs through the URL (`/episodes?series=…`) rather than client state.
 * Each filtered view is then a real, shareable, indexable page — and the list
 * stays a server component with no JavaScript needed to browse it.
 */
export default async function Episodes({
  searchParams,
}: {
  searchParams: Promise<{ series?: string }>;
}) {
  const [{ series: activeSeries }, episodes, seriesList, settings] = await Promise.all([
    searchParams,
    getAllEpisodes(),
    getSeriesList(),
    getSiteSettings(),
  ]);

  const active = seriesList.find((item) => item.slug === activeSeries);
  const visible = active
    ? episodes.filter((episode) => episode.series?.slug === active.slug)
    : episodes;

  return (
    <div className="container">
      <header className={styles.header}>
        <h1>{active ? active.title : 'All Episodes'}</h1>
        <p>
          {active?.description ?? 'Browse by series, or start with the most recent conversation.'}
        </p>
      </header>

      <nav className={styles.filters} aria-label="Filter episodes by series">
        <Link
          href="/episodes"
          className={`${styles.filterBtn} ${!active ? styles.filterBtnActive : ''}`}
          aria-current={!active ? 'page' : undefined}
        >
          All
        </Link>
        {seriesList.map((item) => (
          <Link
            key={item._id}
            href={`/episodes?series=${item.slug}`}
            className={`${styles.filterBtn} ${
              active?.slug === item.slug ? styles.filterBtnActive : ''
            }`}
            aria-current={active?.slug === item.slug ? 'page' : undefined}
          >
            {item.title}
          </Link>
        ))}
      </nav>

      {visible.length > 0 ? (
        <div className="episode-grid">
          {visible.map((episode) => (
            <EpisodeCard
              key={episode._id}
              episode={episode}
              fallbackArtwork={settings.showArtwork}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <h2>{active ? 'Nothing in this series yet' : 'Episodes are on their way'}</h2>
          <p>
            {active
              ? 'This series has no published episodes yet. Try another one, or check back soon.'
              : 'The first episodes are being finished now. Join the email list and we will let you know.'}
          </p>
          {active && (
            <Link href="/episodes" className="btn-primary">
              See all episodes
            </Link>
          )}
        </div>
      )}

      <p className={styles.count}>
        {visible.length > 0 &&
          `${visible.length} episode${visible.length === 1 ? '' : 's'}${
            active ? ` in ${active.title}` : ''
          }`}
      </p>
    </div>
  );
}
