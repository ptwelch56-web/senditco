const DEFAULT_HOME = "https://senditandsons.com";

/** Homepage origin only — use for QR codes (no /sign-pay or other paths). */
function normalizeSiteHome(raw?: string) {
  if (!raw?.trim()) return DEFAULT_HOME;
  try {
    const withProto = raw.startsWith("http") ? raw : `https://${raw}`;
    const u = new URL(withProto);
    return `${u.protocol}//${u.host}`;
  } catch {
    return DEFAULT_HOME;
  }
}

/** Live site homepage URL for QR codes */
export const publicSiteUrl = normalizeSiteHome(process.env.NEXT_PUBLIC_SITE_URL);

export function siteHomeUrl() {
  return publicSiteUrl;
}

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
