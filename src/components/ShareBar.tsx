import { useCallback, useMemo, useState, type FC } from 'react';

type ShareBarProps = {
  url: string;
  title: string;
  className?: string;
  direction?: 'horizontal' | 'vertical';
};

const iconClasses = 'h-5 w-5';

const ShareBar: FC<ShareBarProps> = ({ url, title, className = '', direction = 'horizontal' }) => {
  const [copied, setCopied] = useState(false);

  const shareLinks = useMemo(
    () => ({
      x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    }),
    [title, url],
  );

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Unable to copy link', error);
    }
  }, [url]);

  return (
    <div className={`flex ${direction === 'vertical' ? 'flex-col gap-2' : 'flex-row gap-3'} ${className}`.trim()}>
      <button
        type="button"
        onClick={handleCopy}
        className="tap-target items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-base text-neutral-800 transition hover:border-neutral-500 hover:text-neutral-900"
      >
        <svg aria-hidden className={iconClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M8 8h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2z" />
          <path d="M16 8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2" />
        </svg>
        <span>{copied ? 'Copied!' : 'Copy link'}</span>
      </button>
      <a
        href={shareLinks.x}
        target="_blank"
        rel="noreferrer noopener"
        className="tap-target items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-base text-neutral-800 transition hover:border-neutral-500 hover:text-neutral-900"
      >
        <svg aria-hidden className={iconClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20 4.5c-.7.3-1.4.5-2.2.6a3.8 3.8 0 0 0 1.7-2.1 7.8 7.8 0 0 1-2.4.9A3.8 3.8 0 0 0 12 7.4c0 .3 0 .6.1.9A10.8 10.8 0 0 1 4.5 3.5a3.8 3.8 0 0 0 1.2 5.1 3.7 3.7 0 0 1-1.7-.5v.1a3.8 3.8 0 0 0 3 3.7 3.9 3.9 0 0 1-1.7.1 3.8 3.8 0 0 0 3.6 2.7A7.7 7.7 0 0 1 3 18c-.6 0-1.1 0-1.7-.1A10.9 10.9 0 0 0 7.6 20a10.8 10.8 0 0 0 11-11v-.5A7.7 7.7 0 0 0 20 4.5z" />
        </svg>
        <span>Share on X</span>
      </a>
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noreferrer noopener"
        className="tap-target items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-base text-neutral-800 transition hover:border-neutral-500 hover:text-neutral-900"
      >
        <svg aria-hidden className={iconClasses} viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.98 3.5a2 2 0 1 1 .02 4 2 2 0 0 1-.02-4zM3 8.75h3.95V21H3zM9.5 8.75H13v1.67h.05c.49-.92 1.69-1.9 3.48-1.9 3.72 0 4.4 2.25 4.4 5.18V21H16.9v-5.6c0-1.33-.03-3.04-1.86-3.04-1.86 0-2.15 1.45-2.15 2.95V21H9.5z" />
        </svg>
        <span>Share on LinkedIn</span>
      </a>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </div>
  );
};

export default ShareBar;
