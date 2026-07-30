import Image from 'next/image';
import Link from 'next/link';
import { urlForImage } from '@/sanity/lib/image';
import type { Episode, SanityImage } from '@/sanity/lib/types';
import { formatEpisodeDate } from '@/lib/format';
import styles from './EpisodeCard.module.css';

type Props = {
  episode: Episode;
  /** Falls back to the show artwork when an episode has none of its own. */
  fallbackArtwork?: SanityImage;
};

export default function EpisodeCard({ episode, fallbackArtwork }: Props) {
  const artwork = episode.coverImage ?? fallbackArtwork;
  const artworkUrl = urlForImage(artwork)?.width(600).height(600).fit('crop').url();
  const href = `/episodes/${episode.slug}`;

  return (
    <article className={styles.card}>
      <Link href={href} className={styles.imageLink} tabIndex={-1} aria-hidden="true">
        <div className={styles.image}>
          {artworkUrl ? (
            <Image
              src={artworkUrl}
              alt=""
              fill
              className={styles.artwork}
              sizes="(max-width: 700px) 100vw, 380px"
            />
          ) : (
            <span className={styles.imageFallback}>
              {typeof episode.episodeNumber === 'number' ? `Ep ${episode.episodeNumber}` : 'TT'}
            </span>
          )}
        </div>
      </Link>

      <div className={styles.content}>
        {episode.series?.title && <span className={styles.series}>{episode.series.title}</span>}

        <h3 className={styles.title}>
          <Link href={href}>{episode.title}</Link>
        </h3>

        <p className={styles.meta}>
          {typeof episode.episodeNumber === 'number' && (
            <span>Episode {episode.episodeNumber} · </span>
          )}
          <time dateTime={episode.publishedAt}>{formatEpisodeDate(episode.publishedAt)}</time>
        </p>

        {episode.description && <p className={styles.description}>{episode.description}</p>}

        <Link href={href} className={styles.link}>
          Listen now <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
