/**
 * Convert an ISO date string to a relative time string
 * @param isoString - ISO date string
 * @returns Relative time string (e.g., "2 minutes ago", "just now")
 */
export function timeAgo(isoString: string): string {
  const now = Date.now()
  const past = new Date(isoString).getTime()
  const diffMs = now - past

  // Handle invalid dates
  if (isNaN(past)) {
    return 'unknown'
  }

  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 30) {
    return 'just now'
  } else if (diffSeconds < 60) {
    return `${diffSeconds}s ago`
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`
  } else if (diffHours < 24) {
    return `${diffHours}h ago`
  } else if (diffDays < 7) {
    return `${diffDays}d ago`
  } else {
    return new Date(isoString).toLocaleDateString()
  }
}
