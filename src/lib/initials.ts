/**
 * Initials for the logo mark and the placeholder monogram, derived from the name
 * itself.
 *
 * Deriving beats storing: there is no second field to keep in sync, and the mark
 * can never show a pair of letters belonging to somebody else. Set
 * `personal.name` and the logo follows.
 *
 * Punctuation is stripped so the bracketed placeholder name still yields sensible
 * letters rather than a stray '['.
 *
 *   'Sudesh Mehar' -> 'SM'   |   'Aarav' -> 'AA'   |   '[Your Name]' -> 'YN'
 */
export function initialsOf(name: string): string {
  const words = name
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}\p{N}]/gu, ''))
    .filter(Boolean);

  if (words.length === 0) return '';

  const letters =
    words.length === 1
      ? words[0].slice(0, 2)
      : `${words[0][0]}${words[words.length - 1][0]}`;

  return letters.toUpperCase();
}
