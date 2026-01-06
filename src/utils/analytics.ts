type EventPayload = Record<string, unknown>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const debugEnabled = import.meta.env.PUBLIC_ANALYTICS_DEBUG === 'true' || import.meta.env.DEV;

export function trackEvent(name: string, payload: EventPayload = {}) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag === 'function' && import.meta.env.PUBLIC_GA_MEASUREMENT_ID) {
    window.gtag('event', name, payload);
  } else if (debugEnabled) {
    // eslint-disable-next-line no-console
    console.info(`[analytics] ${name}`, payload);
  }
}
