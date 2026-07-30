import { platformLinkLabel } from '@/lib/platforms';
import type { PlatformLinkData } from '@/sanity/lib/types';
import styles from './ListenLinks.module.css';

type Props = {
  links?: PlatformLinkData[];
  /** Hides the heading where the surrounding section already says it. */
  bare?: boolean;
};

export default function ListenLinks({ links, bare = false }: Props) {
  if (!links?.length) return null;

  return (
    <div className={styles.wrapper}>
      {!bare && <h2 className={styles.title}>Listen wherever you are</h2>}
      <ul className={styles.list}>
        {links.map((link, index) => (
          <li key={link._key ?? `${link.platform}-${index}`}>
            <a href={link.url} className={styles.link} target="_blank" rel="noopener noreferrer">
              {platformLinkLabel(link.platform, link.customLabel)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
