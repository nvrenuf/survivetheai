import type { PostEntry } from '../content/config';
import { hasClaimsVerificationForSlug } from '../data/claimsVerification';
import { isKnownCanonicalAuthorName } from '../data/authors';

const CUSTOM_CLAIMS_HEADING_RE = /^\s*##\s+Claims\s*&\s*Verification\s*$/im;

function validateLivePost(post: PostEntry): string[] {
  if (post.data.draft || post.data.internal) {
    return [];
  }

  const issues: string[] = [];

  if (!isKnownCanonicalAuthorName(post.data.author)) {
    issues.push(`public post uses a non-canonical author byline: "${post.data.author}"`);
  }

  if (!hasClaimsVerificationForSlug(post.slug)) {
    issues.push('public post is missing a claimsVerification entry');
  }

  if (CUSTOM_CLAIMS_HEADING_RE.test(post.body ?? '')) {
    issues.push('public post hand-writes a "Claims & Verification" section instead of using the shared layout');
  }

  return issues;
}

export function assertLivePostStandards(posts: PostEntry[]): PostEntry[] {
  const failures = posts.flatMap((post) => validateLivePost(post).map((issue) => `- ${post.slug}: ${issue}`));

  if (failures.length > 0) {
    throw new Error(`[live-post-standards]\n${failures.join('\n')}`);
  }

  return posts;
}
