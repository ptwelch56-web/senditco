/** Public payment handles — override with NEXT_PUBLIC_* on Vercel if needed */
export const paymentHandles = {
  venmo:
    process.env.NEXT_PUBLIC_VENMO_HANDLE?.replace(/^@/, "") ?? "Starzandstripes",
  cashApp:
    process.env.NEXT_PUBLIC_CASHAPP_CASHTAG?.replace(/^\$/, "") ?? "ptwelch89",
};

export const paymentDisplay = {
  venmo: `@${paymentHandles.venmo}`,
  cashApp: `$${paymentHandles.cashApp}`,
} as const;

export function venmoPayUrl(options: {
  amount: number | null;
  note: string;
  handle?: string;
}) {
  const user = (options.handle ?? paymentHandles.venmo).trim();
  if (!user) return null;
  const params = new URLSearchParams({
    txn: "pay",
    recipients: user,
    note: options.note.slice(0, 200),
  });
  if (options.amount != null && options.amount > 0) {
    params.set("amount", options.amount.toFixed(2));
  }
  return `https://account.venmo.com/pay?${params.toString()}`;
}

export function cashAppPayUrl(options: {
  amount: number | null;
  note: string;
  cashtag?: string;
}) {
  const tag = (options.cashtag ?? paymentHandles.cashApp).trim();
  if (!tag) return null;
  if (options.amount != null && options.amount > 0) {
    const dollars = options.amount;
    const pathAmount =
      Number.isInteger(dollars) || dollars % 1 === 0
        ? dollars.toFixed(0)
        : dollars.toFixed(2);
    return `https://cash.app/$${encodeURIComponent(tag)}/${pathAmount}`;
  }
  return `https://cash.app/$${encodeURIComponent(tag)}`;
}

export function venmoProfileUrl(handle?: string) {
  const user = (handle ?? paymentHandles.venmo).trim();
  return user ? `https://venmo.com/u/${encodeURIComponent(user)}` : null;
}

export function cashAppProfileUrl(cashtag?: string) {
  const tag = (cashtag ?? paymentHandles.cashApp).trim();
  return tag ? `https://cash.app/$${encodeURIComponent(tag)}` : null;
}
