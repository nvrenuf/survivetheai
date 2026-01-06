type SubscribeMode = 'disabled' | 'log-only' | 'provider';

type SubscribeConfig = {
  mode: SubscribeMode;
  buttondownKey?: string;
  publicationId?: string;
  enabled: boolean;
  hasCredentials: boolean;
};

let hasWarnedSubscribe = false;

export function getSubscribeConfig(): SubscribeConfig {
  const enabled = import.meta.env.PUBLIC_ENABLE_SUBSCRIBE_API === 'true';
  const logOnly = import.meta.env.SUBSCRIBE_LOG_ONLY === 'true';
  const buttondownKey = import.meta.env.BUTTONDOWN_API_KEY;
  const publicationId = import.meta.env.BUTTONDOWN_PUBLICATION_ID;
  const hasCredentials = Boolean(buttondownKey);

  let mode: SubscribeMode = 'disabled';
  if (enabled && logOnly) {
    mode = 'log-only';
  } else if (enabled) {
    mode = 'provider';
  }

  if (!hasWarnedSubscribe) {
    if (enabled && !buttondownKey && !logOnly) {
      console.warn(
        '[config][subscribe] PUBLIC_ENABLE_SUBSCRIBE_API is true but BUTTONDOWN_API_KEY is missing. Endpoint will return 500 until credentials are set.',
      );
    }
    if (!enabled && logOnly) {
      console.warn('[config][subscribe] SUBSCRIBE_LOG_ONLY is true but subscribe API is disabled. Requests will be rejected.');
    }
    hasWarnedSubscribe = true;
  }

  return { mode, buttondownKey, publicationId, enabled, hasCredentials };
}

let hasWarnedAnalytics = false;

export function warnIfAnalyticsMissing() {
  const hasGa = Boolean(import.meta.env.PUBLIC_GA_MEASUREMENT_ID);
  if (!hasGa && !hasWarnedAnalytics) {
    console.warn('[config][analytics] PUBLIC_GA_MEASUREMENT_ID is not set. Analytics events will log to the console only in debug mode.');
    hasWarnedAnalytics = true;
  }
}
