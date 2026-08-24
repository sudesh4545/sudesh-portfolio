/** Tiny class-name joiner — keeps conditional Tailwind lists readable. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
