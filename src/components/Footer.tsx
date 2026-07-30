import Link from 'next/link';
import styles from './Footer.module.css';
import EmailSignup from './EmailSignup';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.content}`}>
        <div className={styles.column}>
          <h3 className={styles.title}>Trying Together</h3>
          <p className={styles.text}>
            A fertility podcast for anyone on the journey. Both voices. No shame. One conversation that should have started years ago.
          </p>
          <div className={styles.socials}>
            <a href="#" className={styles.socialLink}>Instagram</a>
            <a href="#" className={styles.socialLink}>TikTok</a>
            <a href="#" className={styles.socialLink}>YouTube</a>
          </div>
        </div>
        <div className={styles.column}>
          <h3 className={styles.title}>Quick Links</h3>
          <p className={styles.text}><Link href="/episodes" className={styles.socialLink}>All Episodes</Link></p>
          <p className={styles.text}><Link href="/about" className={styles.socialLink}>Our Story</Link></p>
          <p className={styles.text}><Link href="/contact" className={styles.socialLink}>Contact Us</Link></p>
        </div>
        <div className={styles.column}>
          <h3 className={styles.title}>Stay Updated</h3>
          <p className={styles.text}>Join our community to hear about new episodes and resources.</p>
          <EmailSignup theme="dark" />
        </div>
      </div>
      <div className={`container ${styles.bottom}`}>
        &copy; {new Date().getFullYear()} Trying Together. All rights reserved.
      </div>
    </footer>
  );
}
