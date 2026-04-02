export type SignupIntent = 'briefing' | 'playbook';

export type LeadSegment =
  | 'general-briefing'
  | 'new-reader'
  | 'action-seeker'
  | 'article-deep-dive'
  | 'hub-specific';

export type SubscriberLifecycleProfile = {
  signupIntent: SignupIntent;
  leadSegment: LeadSegment;
  interestArea: string | null;
};

const HUB_PREFIX = 'hub-';

export function deriveSubscriberLifecycleProfile(sourcePage?: string | null): SubscriberLifecycleProfile {
  const normalized = (sourcePage ?? '').trim().toLowerCase();

  if (normalized === 'playbook') {
    return {
      signupIntent: 'playbook',
      leadSegment: 'action-seeker',
      interestArea: null,
    };
  }

  if (normalized === 'start-here') {
    return {
      signupIntent: 'briefing',
      leadSegment: 'new-reader',
      interestArea: null,
    };
  }

  if (normalized === 'post') {
    return {
      signupIntent: 'briefing',
      leadSegment: 'article-deep-dive',
      interestArea: null,
    };
  }

  if (normalized.startsWith(HUB_PREFIX)) {
    return {
      signupIntent: 'briefing',
      leadSegment: 'hub-specific',
      interestArea: normalized.slice(HUB_PREFIX.length) || null,
    };
  }

  return {
    signupIntent: 'briefing',
    leadSegment: 'general-briefing',
    interestArea: null,
  };
}

export function buildWelcomeEmailText(profile: SubscriberLifecycleProfile, baseUrl: string, unsubscribeUrl: string) {
  const intro =
    "Welcome to Survive the AI.\n\n" +
    "You'll receive weekly survival intel: early signals, what they mean, and what to do next.\n\n";

  let nextStep = `Start here: ${baseUrl}/start-here\nOpen the full library: ${baseUrl}/posts`;

  if (profile.signupIntent === 'playbook') {
    nextStep =
      `Open the playbook path: ${baseUrl}/playbook\n` +
      `Then use Start Here: ${baseUrl}/start-here`;
  } else if (profile.leadSegment === 'hub-specific' && profile.interestArea) {
    nextStep =
      `Return to your pressure area: ${baseUrl}/survival-areas/${profile.interestArea}\n` +
      `Browse the full library: ${baseUrl}/posts`;
  } else if (profile.leadSegment === 'article-deep-dive') {
    nextStep =
      `Use Start Here: ${baseUrl}/start-here\n` +
      `Browse the full library: ${baseUrl}/posts`;
  }

  return `${intro}Next step:\n${nextStep}\n\nUnsubscribe: ${unsubscribeUrl}`;
}
