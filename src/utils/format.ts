/**
 * Format dates into a consistent, locale-aware label for UI rendering.
 */
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

/**
 * Render a human-friendly date string (e.g., "August 1, 2025").
 */
export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}

/**
 * Convert a reading time value (in minutes) into a display label with sensible rounding.
 */
export function formatReadingMinutes(minutes: number): string {
  const rounded = Math.max(1, Math.round(minutes));
  return `${rounded} min read`;
}
