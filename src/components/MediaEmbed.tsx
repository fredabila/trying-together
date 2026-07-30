import { resolveEmbed, resolveIframeEmbed, type ResolvedEmbed } from '@/lib/embeds';
import { platformLinkLabel } from '@/lib/platforms';
import type { MediaEmbedData } from '@/sanity/lib/types';
import styles from './MediaEmbed.module.css';

type Props = {
  embed: MediaEmbedData;
  /** Used in the iframe title so screen readers get context. */
  contextTitle?: string;
};

/**
 * One embedded player.
 *
 * Both input styles converge on a vetted URL before anything renders — pasted
 * embed code is never injected as HTML, only mined for its src and rebuilt. An
 * embed we can't verify falls back to a link out rather than disappearing.
 */
export default function MediaEmbed({ embed, contextTitle }: Props) {
  const resolved: ResolvedEmbed | null =
    embed.source === 'iframe' ? resolveIframeEmbed(embed.iframeCode) : resolveEmbed(embed.url);

  if (!resolved) {
    // Unverifiable embed code, or a link we couldn't parse. If there's any URL
    // at all, offer it; otherwise stay silent rather than render an error.
    const fallbackUrl = embed.url?.trim();
    if (!fallbackUrl) return null;
    return (
      <div className={styles.wrapper}>
        {embed.label && <h3 className={styles.label}>{embed.label}</h3>}
        <a
          href={fallbackUrl}
          className="btn-secondary"
          target="_blank"
          rel="noopener noreferrer"
        >
          {platformLinkLabel(embed.platform)}
        </a>
      </div>
    );
  }

  const frameTitle = [contextTitle, embed.label ?? resolved.label].filter(Boolean).join(' — ');

  return (
    <div className={styles.wrapper}>
      {embed.label && <h3 className={styles.label}>{embed.label}</h3>}

      {resolved.embedUrl ? (
        resolved.video ? (
          <div className={styles.videoWrapper}>
            <iframe
              src={resolved.embedUrl}
              title={frameTitle || 'Player'}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        ) : (
          <iframe
            className={styles.audioFrame}
            src={resolved.embedUrl}
            title={frameTitle || 'Player'}
            style={{ height: `${embed.height ?? resolved.height ?? 232}px` }}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )
      ) : (
        <a
          href={resolved.originalUrl}
          className="btn-secondary"
          target="_blank"
          rel="noopener noreferrer"
        >
          {`Listen on ${resolved.label}`}
        </a>
      )}
    </div>
  );
}
