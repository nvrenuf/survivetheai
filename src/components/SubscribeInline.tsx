import { useMemo, useState } from 'react';
import { trackEvent } from '../utils/analytics';

type Status = 'idle' | 'loading' | 'success' | 'error';

type SubscribeInlineProps = {
  heading?: string;
  helperText?: string;
  privacyText?: string;
  location?: string;
};

export default function SubscribeInline({
  heading = 'Stay ahead of the AI flood',
  helperText = 'Weekly signal, no hype: practical moves to protect your work, family, and focus.',
  privacyText = 'No spam. Unsubscribe anytime.',
  location = 'inline',
}: SubscribeInlineProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string>('');
  const enableApi = import.meta.env.PUBLIC_ENABLE_SUBSCRIBE_API === 'true';

  const statusMessage = useMemo(() => {
    if (status === 'success') return message || 'You are in. Watch your inbox for the next drop.';
    if (status === 'error') return message || 'Something went wrong. Try again or come back later.';
    return '';
  }, [status, message]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = (formData.get('email') as string | null)?.trim();

    if (!email) {
      setStatus('error');
      setMessage('Enter an email to join the list.');
      return;
    }

    setStatus('loading');
    setMessage('');
    trackEvent('newsletter_submit', { location });

    if (!enableApi) {
      form.reset();
      setStatus('success');
      setMessage('Newsletter coming soon. You are on the early-access list.');
      trackEvent('newsletter_success', { location, mode: 'log-only' });
      return;
    }

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: location }),
      });
      const data = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        throw new Error(data?.message || 'Unable to subscribe right now.');
      }

      setStatus('success');
      setMessage(data?.message ?? 'You are subscribed. Welcome aboard.');
      form.reset();
      trackEvent('newsletter_success', { location });
    } catch (error) {
      const fallbackMessage = error instanceof Error ? error.message : 'Unable to subscribe right now.';
      setStatus('error');
      setMessage(fallbackMessage);
      trackEvent('newsletter_error', { location, message: fallbackMessage });
    }
  };

  return (
    <section
      className="rounded-3xl border border-neutral-200 bg-gradient-to-br from-white via-neutral-50 to-white p-6 shadow-[0_12px_40px_-28px_rgba(0,0,0,0.35)] sm:p-8"
      aria-live="polite"
    >
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-500">Newsletter</p>
        <h2 className="text-2xl font-black text-neutral-900 sm:text-3xl">{heading}</h2>
        <p className="text-neutral-700">{helperText}</p>
      </div>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1 space-y-2">
            <label htmlFor={`email-${location}`} className="text-sm font-semibold text-neutral-800">
              Email address
            </label>
            <input
              id={`email-${location}`}
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 shadow-sm transition focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500/30"
              placeholder="you@example.com"
              autoComplete="email"
              disabled={status === 'loading'}
              aria-describedby={`subscribe-helper-${location}`}
            />
          </div>
          <div className="flex-none space-y-2 sm:pt-8">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-700 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
            </button>
            <p id={`subscribe-helper-${location}`} className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
              {privacyText}
            </p>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
              status === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}
            role="status"
          >
            {statusMessage}
          </div>
        )}
      </form>
    </section>
  );
}
