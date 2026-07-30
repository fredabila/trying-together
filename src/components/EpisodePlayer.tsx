import AudioPlayer from './AudioPlayer';
import MediaEmbed from './MediaEmbed';
import { resolveEmbed } from '@/lib/embeds';
import { platformLinkLabel } from '@/lib/platforms';
import type { EpisodeAudioData } from '@/sanity/lib/types';
import styles from './EpisodePlayer.module.css';

export type EpisodeAudio = EpisodeAudioData;

type Props = {
  audio?: EpisodeAudio | null;
  title?: string;
  /** The homepage card shows only the main player; detail pages show everything. */
  compact?: boolean;
};

/**
 * Everything you can do with one episode.
 *
 * Main player first (uploaded file, or the platform embed built from a link),
 * then any extra players the client added, then buttons out to every other
 * platform the episode lives on.
 */
export default function EpisodePlayer({ audio, title, compact = false }: Props) {
  if (!audio) return <NoAudio />;

  const extraEmbeds = audio.embeds ?? [];
  const platformLinks = audio.platformLinks ?? [];

  return (
    <>
      <MainPlayer audio={audio} title={title} />

      {!compact && extraEmbeds.length > 0 && (
        <div className={styles.extras}>
          {extraEmbeds.map((embed, index) => (
            <MediaEmbed key={embed._key ?? index} embed={embed} contextTitle={title} />
          ))}
        </div>
      )}

      {!compact && platformLinks.length > 0 && (
        <div className={styles.alsoOn}>
          <h3 className={styles.alsoOnTitle}>Also available on</h3>
          <ul className={styles.alsoOnList}>
            {platformLinks.map((link, index) => (
              <li key={link._key ?? `${link.platform}-${index}`}>
                <a
                  href={link.url}
                  className={styles.alsoOnLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {platformLinkLabel(link.platform, link.customLabel)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

/**
 * The player that leads the episode.
 *
 * Uploaded file  -> our own branded player.
 * Pasted link    -> the platform's embed, built from the link.
 * Unembeddable   -> a clear button out to the platform.
 */
function MainPlayer({ audio, title }: { audio: EpisodeAudio; title?: string }) {
  // An uploaded file always wins — it's ours and it keeps people on the site.
  if (audio.mode === 'self' || (!audio.url && audio.fileUrl)) {
    if (!audio.fileUrl) {
      // No file yet, but an extra embed may still be able to carry the episode.
      return audio.embeds?.length ? null : <NoAudio />;
    }
    return <AudioPlayer src={audio.fileUrl} title={title} durationHint={audio.durationSeconds} />;
  }

  const embed = resolveEmbed(audio.url);
  if (!embed) return audio.embeds?.length ? null : <NoAudio />;

  // A pasted direct link to an audio file still gets our own player.
  if (embed.platform === 'audio') {
    return (
      <AudioPlayer src={embed.originalUrl} title={title} durationHint={audio.durationSeconds} />
    );
  }

  if (embed.embedUrl) {
    if (embed.video) {
      return (
        <div className={styles.videoWrapper}>
          <iframe
            src={embed.embedUrl}
            title={title ? `${title} — ${embed.label}` : `${embed.label} player`}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      );
    }

    return (
      <iframe
        className={styles.audioFrame}
        src={embed.embedUrl}
        title={title ? `${title} — ${embed.label}` : `${embed.label} player`}
        style={{ height: `${embed.height ?? 232}px` }}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }

  // Recognised platform with no embed available (Amazon Music), or a link we
  // don't know. Either way, send people to it clearly rather than failing.
  return (
    <div className={styles.fallback}>
      <p className={styles.fallbackText}>
        {embed.platform === 'unknown'
          ? 'This episode is hosted elsewhere.'
          : `This episode plays on ${embed.label}.`}
      </p>
      <a href={embed.originalUrl} className="btn-primary" target="_blank" rel="noopener noreferrer">
        Listen on {embed.label}
      </a>
    </div>
  );
}

function NoAudio() {
  return (
    <div className={styles.fallback}>
      <p className={styles.fallbackText}>This episode is coming soon.</p>
    </div>
  );
}
