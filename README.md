# sendit and sons.co

Marketing site + **book & sign waiver** flow for mobile BMX/MTB jump lessons (Mebane, NC).

## Run locally

```bash
cd sendit-co
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Booking emails (required for online submissions)

Submissions are sent with [Resend](https://resend.com):

1. Create a Resend account and API key.
2. Verify your sending domain (recommended: your live domain) or use Resend’s sandbox for testing.
3. Copy `.env.example` to `.env.local` and set:

```env
RESEND_API_KEY=re_...
BOOKING_NOTIFY_EMAIL=starzndstripesmedia@gmail.com
BOOKING_FROM_EMAIL=Sendit <bookings@your-verified-domain.com>
```

Without `RESEND_API_KEY`, the booking form will show an error after submit.

## Deploy (Vercel)

1. Push this folder to GitHub.
2. Import the repo in [Vercel](https://vercel.com).
3. Add the same environment variables in Project Settings → Environment Variables.
4. Point your domain DNS to Vercel.

## Legal

The included waiver is a **starter template**. Have a North Carolina attorney review it before you rely on it in production.

## Project structure

- `src/app/page.tsx` — homepage
- `src/app/book/` — multi-step booking + waiver
- `src/app/api/book/route.ts` — validates payload, emails you + customer confirmation
