export type AuthorProfile = {
  id: string;
  canonicalName: string;
  displayName: string;
  role: string;
  shortBio: string;
  aliases?: string[];
};

export const AUTHOR_PROFILES: AuthorProfile[] = [
  {
    id: 'lee-cuevas',
    canonicalName: 'Lee Cuevas',
    displayName: 'Lee Cuevas',
    role: 'Author',
    shortBio: 'Writes SurviveTheAI reporting focused on practical AI disruption, household stakes, and what readers should do next.',
  },
  {
    id: 'justin-cuevas',
    canonicalName: 'Justin Cuevas',
    displayName: 'Justin Cuevas',
    role: 'Author',
    shortBio: 'Contributes SurviveTheAI coverage centered on adaptation, resilience, and actionable response to AI pressure.',
  },
  {
    id: 'alex-morgan',
    canonicalName: 'Alex Morgan',
    displayName: 'Alex Morgan',
    role: 'Contributor',
    shortBio: 'Contributor to SurviveTheAI reporting and explainer coverage.',
  },
  {
    id: 'sta-editorial-team',
    canonicalName: 'SurviveTheAI Editorial Team',
    displayName: 'SurviveTheAI Editorial Team',
    role: 'Editorial Team',
    shortBio: 'Maintains team-authored and legacy SurviveTheAI pieces, applies editorial review, and keeps updates and corrections in sync.',
    aliases: ['Admin'],
  },
];

export const SITE_CREDIBILITY = {
  publisherName: 'SurviveTheAI',
  publisherLabel: 'SurviveTheAI editorial team',
  summary:
    'SurviveTheAI is an independent editorial publication focused on how AI changes work, family life, attention, relationships, and institutional trust.',
  standardsHref: '/how-we-research',
  aboutHref: '/about',
  contactHref: 'mailto:editor@survivetheai.com',
};

const authorLookup = new Map<string, AuthorProfile>();

for (const profile of AUTHOR_PROFILES) {
  authorLookup.set(profile.canonicalName.toLowerCase(), profile);
  for (const alias of profile.aliases ?? []) {
    authorLookup.set(alias.toLowerCase(), profile);
  }
}

export function getAuthorProfile(authorName: string): AuthorProfile {
  return authorLookup.get(authorName.trim().toLowerCase()) ?? {
    id: 'sta-contributor',
    canonicalName: authorName,
    displayName: authorName,
    role: 'Contributor',
    shortBio: 'Contributor to SurviveTheAI reporting.',
  };
}
