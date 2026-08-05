/** How customers heard about sendit and sons.co — used on /book */
export const referralSourceValues = [
  "google-search",
  "google-ad",
  "social-media",
  "bmx-track",
  "friend-family",
  "flyer-card",
  "event",
  "other",
] as const;

export type ReferralSource = (typeof referralSourceValues)[number];

export const referralSourceLabels: Record<ReferralSource, string> = {
  "google-search": "Google search",
  "google-ad": "Google ad",
  "social-media": "Facebook / Instagram",
  "bmx-track": "BMX track or race",
  "friend-family": "Friend or family",
  "flyer-card": "Flyer or business card",
  event: "Event or festival",
  other: "Other",
};

export function formatReferralSource(
  source: ReferralSource,
  detail?: string,
): string {
  const label = referralSourceLabels[source];
  if (source === "other" && detail?.trim()) {
    return `${label}: ${detail.trim()}`;
  }
  return label;
}
