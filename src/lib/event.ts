import { site } from "./site";

/** Live site URL for QR codes and share links */
export const publicSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://senditandsons.com";

export const spotCheckInPath = "/sign-pay";

export function spotCheckInUrl() {
  return `${publicSiteUrl}${spotCheckInPath}`;
}

/** @deprecated Use spotCheckInUrl — kept for older links */
export const eventCheckInPath = spotCheckInPath;

export function eventCheckInUrl(eventName?: string) {
  const base = `${publicSiteUrl}${spotCheckInPath}`;
  if (!eventName?.trim()) return base;
  return `${base}?event=${encodeURIComponent(eventName.trim())}`;
}

export function formatSpotPaymentNote(
  referenceId: string,
  options?: { tipAmount?: number; eventName?: string },
) {
  const parts = ["Sendit", referenceId, "$30 ride"];
  if (options?.tipAmount && options.tipAmount > 0) {
    parts.push(`tip $${options.tipAmount.toFixed(2)}`);
  }
  if (options?.eventName?.trim()) parts.push(options.eventName.trim());
  return parts.join(" — ").slice(0, 200);
}
