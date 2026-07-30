'use client';
import styles from './page.module.css';
import EmailSignup from '@/components/EmailSignup';

export default function Contact() {
  return (
    <div className="container">
      <div className={styles.layout}>
        <div className={styles.formColumn}>
          <h1>Get in Touch</h1>
          <p style={{ marginBottom: '2rem' }}>Want to share your story or apply as a guest? Fill out the form below and we&apos;ll get back to you.</p>
          
          <form onSubmit={(e) => e.preventDefault()}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Name</label>
              <input type="text" className={styles.input} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input type="email" className={styles.input} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Subject</label>
              <select className={styles.input}>
                <option>General Enquiry</option>
                <option>Guest Application</option>
                <option>Sponsorship/Partnership</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Message</label>
              <textarea className={styles.textarea} required></textarea>
            </div>
            <button type="submit" className="btn-primary">Send Message</button>
          </form>
        </div>
        
        <div className={styles.infoColumn}>
          <div style={{ marginBottom: '3rem' }}>
            <h2>Join the Waitlist</h2>
            <p style={{ marginBottom: '1rem' }}>We are building a private community for listeners. Sign up to be the first to know when doors open.</p>
            <EmailSignup />
          </div>
          
          <div>
            <h2>Social Media</h2>
            <p>You can also reach us directly through our social channels:</p>
            <ul style={{ marginTop: '1rem', listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}><a href="#">Instagram @trying_together</a></li>
              <li style={{ marginBottom: '0.5rem' }}><a href="#">TikTok @tryingtogetherpod</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
