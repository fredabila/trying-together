'use client';
import styles from './EmailSignup.module.css';

export default function EmailSignup({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  return (
    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
      <input 
        type="email" 
        placeholder="Email address" 
        required 
        className={`${styles.input} ${theme === 'dark' ? styles.inputDark : ''}`}
      />
      <button type="submit" className="btn-primary">Subscribe</button>
    </form>
  );
}
