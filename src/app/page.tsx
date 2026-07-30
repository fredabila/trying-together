import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import EmailSignup from '@/components/EmailSignup';
import EpisodeCard from '@/components/EpisodeCard';
import EpisodePlayer from '@/components/EpisodePlayer';
import ListenLinks from '@/components/ListenLinks';
import { getAllEpisodes, getHomeEpisode, getSeriesList, getSiteSettings } from '@/sanity/lib/content';
import { urlForImage } from '@/sanity/lib/image';
import { formatDuration, formatEpisodeDate } from '@/lib/format';

export const revalidate = 60;

export default async function Home() {
  const [settings, featured, episodes, series] = await Promise.all([
    getSiteSettings(),
    getHomeEpisode(),
    getAllEpisodes(),
    getSeriesList(),
  ]);

  // The featured episode already leads the page, so don't repeat it below.
  const recent = episodes.filter((episode) => episode._id !== featured?._id).slice(0, 3);
  const duration = formatDuration(featured?.audio?.durationSeconds);
  const artwork = settings.showArtwork ? urlForImage(settings.showArtwork)?.width(600).url() : null;

  return (
    <>
      <section className={styles.hero}>
        {artwork && (
          // Decorative only — sits at low opacity behind the copy for warmth.
          <Image src={artwork} alt="" aria-hidden="true" className={styles.heroArtwork} fill priority />
        )}
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            {settings.tagline && <p className={styles.heroTagline}>{settings.tagline}</p>}
            <h1 className={styles.heroTitle}>{settings.heroHeading}</h1>
            {settings.heroSubheading && (
              <p className={styles.heroSubtitle}>{settings.heroSubheading}</p>
            )}
            <div className={styles.listenSection}>
              <ListenLinks links={settings.listenLinks} bare />
            </div>
          </div>

          <div className={styles.playerCard}>
            {featured ? (
              <>
                <p className={styles.playerLabel}>Latest episode</p>
                <h2 className={styles.playerTitle}>
                  <Link href={`/episodes/${featured.slug}`}>{featured.title}</Link>
                </h2>
                {featured.description && (
                  <p className={styles.playerDescription}>{featured.description}</p>
                )}

                <EpisodePlayer audio={featured.audio} title={featured.title} compact />

                <div className={styles.playerMeta}>
                  <p className={styles.playerMetaText}>
                    {featured.series?.title && <>{featured.series.title} · </>}
                    <time dateTime={featured.publishedAt}>
                      {formatEpisodeDate(featured.publishedAt)}
                    </time>
                    {duration && <> · {duration}</>}
                  </p>
                  <Link href={`/episodes/${featured.slug}`} className={styles.playerMetaText}>
                    Show notes <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </>
            ) : (
              <div className={styles.emptyPlayer}>
                <p>The first episode is on its way.</p>
                <p>Join the email list below and we&apos;ll tell you the moment it lands.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {series.length > 0 && (
        <section className={styles.series}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>What we talk about</h2>
              <p>Four threads running through the whole conversation.</p>
            </div>
            <ul className={styles.seriesGrid}>
              {series.map((entry, index) => (
                <li
                  key={entry._id}
                  className={styles.seriesItem}
                  style={{ '--stagger': `${index * 70}ms` } as React.CSSProperties}
                >
                  <Link href={`/episodes?series=${entry.slug}`} className={styles.seriesLink}>
                    <span className={styles.seriesNumber} aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className={styles.seriesTitle}>{entry.title}</h3>
                    {entry.description && (
                      <p className={styles.seriesDescription}>{entry.description}</p>
                    )}
                    <span className={styles.seriesCount}>
                      {entry.episodeCount > 0
                        ? `${entry.episodeCount} episode${entry.episodeCount === 1 ? '' : 's'}`
                        : 'Coming soon'}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section className={styles.recent}>
          <div className="container">
            <div className={styles.recentHeader}>
              <h2>More episodes</h2>
              <Link href="/episodes">All episodes →</Link>
            </div>
            <div className={`episode-grid ${styles.recentGrid}`}>
              {recent.map((episode, index) => (
                <div
                  key={episode._id}
                  className={styles.recentItem}
                  style={{ '--stagger': `${index * 90}ms` } as React.CSSProperties}
                >
                  <EpisodeCard episode={episode} fallbackArtwork={settings.showArtwork} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={styles.newsletter}>
        <div className="container">
          <div className={styles.newsletterInner}>
            <h2>{settings.newsletterHeading}</h2>
            {settings.newsletterBody && <p>{settings.newsletterBody}</p>}
            <EmailSignup theme="dark" />
          </div>
        </div>
      </section>
    </>
  );
}
