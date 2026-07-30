import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import styles from './page.module.css';
import EmailSignup from '@/components/EmailSignup';
import EpisodePlayer from '@/components/EpisodePlayer';
import { getEpisode, getEpisodeSlugs, getSiteSettings } from '@/sanity/lib/content';
import { urlForImage } from '@/sanity/lib/image';
import { formatDuration, formatEpisodeDate } from '@/lib/format';
import { siteUrl } from '@/sanity/env';

export const revalidate = 60;

/** Pre-render the episodes that exist at build time; new ones render on demand. */
export async function generateStaticParams() {
  const slugs = await getEpisodeSlugs();
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<'/episodes/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const [episode, settings] = await Promise.all([getEpisode(slug), getSiteSettings()]);

  if (!episode) return { title: 'Episode not found' };

  const artwork = episode.coverImage ?? settings.showArtwork;
  const imageUrl = urlForImage(artwork)?.width(1200).height(630).fit('crop').url();

  return {
    title: episode.title,
    description: episode.description,
    alternates: { canonical: `/episodes/${episode.slug}` },
    openGraph: {
      type: 'article',
      title: episode.title,
      description: episode.description,
      url: `${siteUrl}/episodes/${episode.slug}`,
      publishedTime: episode.publishedAt,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : undefined,
    },
  };
}

export default async function EpisodePage(props: PageProps<'/episodes/[slug]'>) {
  const { slug } = await props.params;
  const [episode, settings] = await Promise.all([getEpisode(slug), getSiteSettings()]);

  if (!episode) notFound();

  const duration = formatDuration(episode.audio?.durationSeconds);
  const artwork = episode.coverImage ?? settings.showArtwork;
  const artworkUrl = urlForImage(artwork)?.width(320).height(320).fit('crop').url();

  return (
    <div className="container">
      <article>
        <header className={styles.header}>
          {episode.series?.title && (
            <Link href={`/episodes?series=${episode.series.slug}`} className={styles.series}>
              {episode.series.title}
            </Link>
          )}
          <h1>{episode.title}</h1>
          <p className={styles.meta}>
            {typeof episode.episodeNumber === 'number' && <>Episode {episode.episodeNumber} · </>}
            <time dateTime={episode.publishedAt}>{formatEpisodeDate(episode.publishedAt)}</time>
            {duration && <> · {duration}</>}
          </p>
          {episode.description && <p className={styles.summary}>{episode.description}</p>}
        </header>

        <div className={styles.playerRow}>
          {artworkUrl && (
            <Image src={artworkUrl} alt="" width={160} height={160} className={styles.artwork} />
          )}
          <div className={styles.playerCell}>
            <EpisodePlayer audio={episode.audio} title={episode.title} />
          </div>
        </div>

        <div className={styles.content}>
          {episode.showNotes && episode.showNotes.length > 0 && (
            <section className={styles.section}>
              <h2>Show notes</h2>
              <div className={styles.prose}>
                <PortableText value={episode.showNotes} />
              </div>
            </section>
          )}

          {episode.guests && episode.guests.length > 0 && (
            <section className={styles.section}>
              <h2>{episode.guests.length === 1 ? 'Our guest' : 'Our guests'}</h2>
              <ul className={styles.guestList}>
                {episode.guests.map((guest, index) => {
                  const photoUrl = urlForImage(guest.photo)
                    ?.width(160)
                    .height(160)
                    .fit('crop')
                    .url();
                  return (
                    <li key={`${guest.name}-${index}`} className={styles.guest}>
                      {photoUrl && (
                        <Image
                          src={photoUrl}
                          alt=""
                          width={80}
                          height={80}
                          className={styles.guestPhoto}
                        />
                      )}
                      <div>
                        <h3 className={styles.guestName}>{guest.name}</h3>
                        {guest.role && <p className={styles.guestRole}>{guest.role}</p>}
                        {guest.bio && <p className={styles.guestBio}>{guest.bio}</p>}
                        {guest.link && (
                          <a href={guest.link} target="_blank" rel="noopener noreferrer">
                            Find them here →
                          </a>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {episode.transcript && episode.transcript.length > 0 && (
            <section className={styles.section}>
              <details className={styles.transcript}>
                <summary className={styles.transcriptSummary}>Read the transcript</summary>
                <div className={styles.prose}>
                  <PortableText value={episode.transcript} />
                </div>
              </details>
            </section>
          )}

          <section className={styles.section}>
            <h2>Never miss an episode</h2>
            <p>New conversations, straight to your inbox. No algorithm in the way.</p>
            <EmailSignup theme="light" />
          </section>
        </div>

        <p className={styles.backLink}>
          <Link href="/episodes">← All episodes</Link>
        </p>
      </article>
    </div>
  );
}
