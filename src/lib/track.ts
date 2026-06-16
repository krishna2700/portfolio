/**
 * Fire-and-forget link click tracker.
 * Call this from onClick handlers on any link you want to track.
 */
export function trackClick(label: string, url?: string) {
  fetch("/api/track/click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ label, url }),
  }).catch(() => {});
}
