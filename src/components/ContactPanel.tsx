import { useEffect, useState } from 'react';

type Props = { email: string; linkedinUrl: string };

export default function ContactPanel({ email, linkedinUrl }: Props) {
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle');

  useEffect(() => {
    if (copyState !== 'copied') return;
    const timeout = window.setTimeout(() => setCopyState('idle'), 3000);
    return () => window.clearTimeout(timeout);
  }, [copyState]);

  async function copyEmail() {
    setCopyState('copying');
    try {
      await navigator.clipboard.writeText(email);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
  }

  return (
    <article className="story-content contact-content">
      <p className="eyebrow">Samarinda, Indonesia</p>
      <h2 id="panel-title">Let's build<br />something useful.</h2>
      <p className="contact-intro">Have a project in mind, a role to discuss, or a question about my work? Get in touch.</p>
      <div className="contact-email-row">
        <a href={`mailto:${email}`} className="contact-email">{email}</a>
        <button type="button" className="copy-email" disabled={copyState === 'copying'} onClick={copyEmail}>{copyState === 'copied' ? 'Email copied ✓' : copyState === 'copying' ? 'Copying…' : 'Copy email'}</button>
      </div>
      <p className="copy-feedback" role="status">{copyState === 'copied' ? 'Email address copied to your clipboard.' : copyState === 'error' ? 'Could not copy automatically. Select the email address above to copy it.' : ''}</p>
      <div className="contact-links">
        <a className="editorial-link" href={`mailto:${email}`}>Write an email <span aria-hidden="true">↗</span></a>
        <a className="editorial-link" href={linkedinUrl} target="_blank" rel="noopener noreferrer">Connect on LinkedIn <span aria-hidden="true">↗</span></a>
      </div>
    </article>
  );
}
