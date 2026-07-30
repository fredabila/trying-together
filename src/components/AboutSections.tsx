import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { urlForImage } from '@/sanity/lib/image';
import type { AboutSection } from '@/sanity/lib/types';
import styles from './AboutSections.module.css';

/**
 * Renders whatever sections the client has arranged on the About page, in their
 * order. Unknown section types are skipped rather than crashing the page, so
 * adding a new one to the schema can never break production.
 */
export default function AboutSections({ sections }: { sections?: AboutSection[] }) {
  if (!sections?.length) return null;

  return (
    <>
      {sections.map((section) => {
        switch (section._type) {
          case 'textSection':
            return (
              <section key={section._key} className={styles.section}>
                {section.heading && <h2 className={styles.heading}>{section.heading}</h2>}
                {section.body && (
                  <div className={styles.prose}>
                    <PortableText value={section.body} />
                  </div>
                )}
              </section>
            );

          case 'quoteSection':
            return (
              <figure key={section._key} className={styles.quote}>
                <blockquote className={styles.quoteText}>{section.quote}</blockquote>
                {section.attribution && (
                  <figcaption className={styles.attribution}>— {section.attribution}</figcaption>
                )}
              </figure>
            );

          case 'imageSection': {
            const url = urlForImage(section.image)?.width(1200).url();
            if (!url) return null;
            return (
              <figure key={section._key} className={styles.figure}>
                <Image
                  src={url}
                  alt={section.image?.alt ?? section.caption ?? ''}
                  width={1200}
                  height={800}
                  sizes="(max-width: 800px) 100vw, 760px"
                  className={styles.image}
                />
                {section.caption && (
                  <figcaption className={styles.caption}>{section.caption}</figcaption>
                )}
              </figure>
            );
          }

          case 'valuesSection':
            return (
              <section key={section._key} className={styles.section}>
                {section.heading && <h2 className={styles.heading}>{section.heading}</h2>}
                <ul className={styles.valueList}>
                  {section.items?.map((item, index) => (
                    <li key={`${section._key}-${index}`} className={styles.valueItem}>
                      <h3 className={styles.valueTitle}>{item.title}</h3>
                      {item.body && <p className={styles.valueBody}>{item.body}</p>}
                    </li>
                  ))}
                </ul>
              </section>
            );

          case 'ctaSection': {
            const href = section.buttonUrl;
            const isInternal = href?.startsWith('/');
            return (
              <section key={section._key} className={styles.cta}>
                <h2 className={styles.ctaHeading}>{section.heading}</h2>
                {section.body && <p className={styles.ctaBody}>{section.body}</p>}
                {href &&
                  section.buttonLabel &&
                  (isInternal ? (
                    <Link href={href} className="btn-primary">
                      {section.buttonLabel}
                    </Link>
                  ) : (
                    <a
                      href={href}
                      className="btn-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {section.buttonLabel}
                    </a>
                  ))}
              </section>
            );
          }

          default:
            return null;
        }
      })}
    </>
  );
}
