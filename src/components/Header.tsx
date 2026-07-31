import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';

const NAV = [
  { href: '/episodes', label: 'Episodes' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

/**
 * The mobile menu is a checkbox-and-label disclosure rather than a client
 * component, so the header stays a server component and the menu works before
 * (and without) JavaScript. The checkbox is visually hidden but focusable, and
 * the label carries the button role and state for screen readers.
 */
export default function Header() {
  return (
    <header className={styles.header}>
      <input
        type="checkbox"
        id="nav-toggle"
        className={styles.toggleInput}
        aria-label="Show navigation menu"
      />
      <div className={`container ${styles.nav}`}>
        <Link href="/" className={styles.logo} aria-label="Trying Together Podcast, home">
          <Image
            src="/tt-logo.svg"
            alt=""
            width={859}
            height={538}
            className={styles.logoMark}
            priority
          />
        </Link>

        <label htmlFor="nav-toggle" className={styles.toggle}>
          <span className={styles.toggleBars} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="sr-only">Menu</span>
        </label>

        <nav className={styles.links} aria-label="Main">
          <div className={styles.linksInner}>
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className={styles.link}>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
