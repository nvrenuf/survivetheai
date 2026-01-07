/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly BUTTONDOWN_API_KEY?: string;
  readonly BUTTONDOWN_PUBLICATION_ID?: string;
  readonly PUBLIC_GA_MEASUREMENT_ID?: string;
  readonly PUBLIC_ANALYTICS_DEBUG?: string;
  readonly PUBLIC_SHOW_PLAYBOOK_OFFER?: string;
  readonly PUBLIC_ENABLE_SUBSCRIBE_API?: string;
  readonly SUBSCRIBE_LOG_ONLY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
