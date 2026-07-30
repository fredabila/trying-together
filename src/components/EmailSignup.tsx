'use client';
import { useState, useRef } from 'react';
import styles from './EmailSignup.module.css';

type State = 'idle' | 'loading' | 'success' | 'error';

export default function EmailSignup({
  theme = 'light',
  source = 'website',
}: {
  theme?: 'light' | 'dark';
  source?: string;
}) {
  const [state, setState] = useState<State>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = inputRef.current?.value.trim() ?? '';
    if (!email) return;

    setState('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });

      if (res.ok) {
        setState('success');
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.');
        setState('error');
      }
    } catch {
      setErrorMsg('Network error — please check your connection.');
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <p className={styles.successMessage}>
        🎉 You&apos;re in! We&apos;ll let you know when new episodes drop.
      </p>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.formRow}>
        <input
          ref={inputRef}
          type="email"
          placeholder="Email address"
          required
          disabled={state === 'loading'}
          className={`${styles.input} ${theme === 'dark' ? styles.inputDark : ''}`}
          aria-label="Email address"
        />
        <button type="submit" className="btn-primary" disabled={state === 'loading'}>
          {state === 'loading' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </div>
      {state === 'error' && <p className={styles.errorMessage}>{errorMsg}</p>}
    </form>
  );
}
