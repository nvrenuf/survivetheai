type EventPayload = Record<string, unknown>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const debugEnabled = import.meta.env.PUBLIC_ANALYTICS_DEBUG === 'true' || import.meta.env.DEV;

export function trackEvent(name: string, payload: EventPayload = {}) {
  if (typeof window === 'undefined') return;
  const pagePath = window.location?.pathname;
  const enrichedPayload = pagePath && !payload.page_path ? { ...payload, page_path: pagePath } : payload;
  if (typeof window.gtag === 'function' && import.meta.env.PUBLIC_GA_MEASUREMENT_ID) {
    window.gtag('event', name, enrichedPayload);
  } else if (debugEnabled) {
    // eslint-disable-next-line no-console
    console.info(`[analytics] ${name}`, enrichedPayload);
  }
}

type SignupAttribution = {
  page_path?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

export function getSignupAttribution(): SignupAttribution {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  let referrer = '';

  if (document.referrer) {
    try {
      const refUrl = new URL(document.referrer);
      referrer = refUrl.origin === window.location.origin ? `${refUrl.pathname}${refUrl.search}` : refUrl.hostname;
    } catch {
      referrer = document.referrer.slice(0, 200);
    }
  }

  return {
    page_path: `${window.location.pathname}${window.location.search}`.slice(0, 200),
    referrer: referrer.slice(0, 200) || undefined,
    utm_source: params.get('utm_source')?.slice(0, 120) || undefined,
    utm_medium: params.get('utm_medium')?.slice(0, 120) || undefined,
    utm_campaign: params.get('utm_campaign')?.slice(0, 120) || undefined,
  };
}
