import type { Metadata } from 'next';
import Image from 'next/image';
import styles from './page.module.css';
import AboutSections from '@/components/AboutSections';
import { getAboutPage, getSiteSettings } from '@/sanity/lib/content';
import { urlForImage } from '@/sanity/lib/image';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutPage();
  const title = about.seoTitle || about.heading || 'About';
  const description = about.seoDescription || about.missionStatement;
  return {
    title,
    description,
    openGraph: { title, description },
    alternates: { canonical: '/about' },
  };
}

export default async function About() {
  const [about, settings] = await Promise.all([getAboutPage(), getSiteSettings()]);

  const portrait = about.portrait;
  const portraitUrl = urlForImage(portrait)?.width(900).height(1125).fit('crop').url();
  const hosts = `Mike and Ros, hosts of ${settings.showName ?? 'Trying Together'}`;

  return (
    <div className="container">
      <div className={styles.wrapper}>
        <div className={styles.layout}>
          <div className={styles.content}>
            <h1>{about.heading}</h1>

            {about.missionStatement && <p className={styles.mission}>{about.missionStatement}</p>}

            <div className={styles.sections}>
              <AboutSections sections={about.sections} />
            </div>
          </div>

          <div className={styles.portraitColumn}>
            <div className={styles.portrait}>
              {portraitUrl ? (
                <Image
                  src={portraitUrl}
                  alt={portrait?.alt || hosts}
                  fill
                  className={styles.portraitImage}
                  sizes="(max-width: 900px) 90vw, 480px"
                  priority
                />
              ) : (
                <div className={styles.portraitPlaceholder}>Photo of Mike &amp; Ros</div>
              )}
            </div>
            {portrait?.caption && <p className={styles.portraitCaption}>{portrait.caption}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
