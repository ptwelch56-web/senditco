export function resendErrorMessage(
  error: { message?: string; name?: string },
  ctx: { fromEmail: string; notifyEmail: string },
) {
  const message = error.message ?? "";

  if (message.includes("only send testing emails to your own email")) {
    return (
      "Email setup: with onboarding@resend.dev you can only send to the email on your Resend account. " +
      "Either set BOOKING_NOTIFY_EMAIL to that same address for testing, or verify senditandsons.com in Resend " +
      "and set BOOKING_FROM_EMAIL to bookings@senditandsons.com (then redeploy)."
    );
  }

  if (message.includes("domain is not verified") || message.includes("not verified")) {
    return (
      "Email setup: your From address must use a domain verified in Resend. " +
      "Verify senditandsons.com at resend.com/domains, then set BOOKING_FROM_EMAIL to " +
      "Sendit and Sons <bookings@senditandsons.com> in Vercel and redeploy."
    );
  }

  if (message.includes("Invalid `from`")) {
    return (
      `Email setup: BOOKING_FROM_EMAIL is invalid (${ctx.fromEmail}). Use the format ` +
      `Sendit and Sons <bookings@senditandsons.com>.`
    );
  }

  if (message) {
    return `Email could not be sent: ${message}`;
  }

  return "Could not send waiver email. Check Resend logs or call/text us.";
}
