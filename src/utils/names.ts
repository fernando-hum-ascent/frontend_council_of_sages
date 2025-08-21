/**
 * Generate initials from a display name
 * @param displayName The display name to generate initials from
 * @returns Uppercase initials (1-2 characters)
 */
export function getInitials(displayName: string): string {
  if (!displayName) return '?'

  // Handle both spaces and underscores as word separators
  const normalized = displayName.trim().replace(/[_\s]+/g, ' ')
  const parts = normalized.split(' ').filter((part) => part.length > 0)

  // If nothing remains after normalization/collapse, return fallback
  if (parts.length === 0) return '?'

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }

  const first = parts[0].charAt(0).toUpperCase()
  const last = parts[parts.length - 1].charAt(0).toUpperCase()
  return `${first}${last}`
}
