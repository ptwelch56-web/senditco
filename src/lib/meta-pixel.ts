/** Meta (Facebook) Pixel — set NEXT_PUBLIC_META_PIXEL_ID in Vercel / .env.local */

export function getMetaPixelId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  return id || undefined;
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackMetaEvent(
  event: string,
  params?: Record<string, string | number | boolean>,
) {
  if (typeof window === "undefined" || !window.fbq) return;
  if (params) {
    window.fbq("track", event, params);
    return;
  }
  window.fbq("track", event);
}
