import Link from "next/link";
import { SpotCheckInQr } from "@/components/onsite/SpotCheckInQr";
import { paymentDisplay } from "@/lib/payments";
import { spotSession } from "@/lib/site";

export function EventSignupSection() {
  return (
    <section
      id="event-signup"
      className="scroll-mt-24 border-y border-white/10 bg-gradient-to-br from-amber-950/25 to-black"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-500">
            At an event
          </p>
          <h2 className="font-display mt-3 text-3xl text-white sm:text-4xl">
            Scan, sign & pay on the spot
          </h2>
          <p className="mt-4 text-zinc-300">
            <strong className="text-white">{spotSession.price}</strong> — {spotSession.riders}. Scan
            the QR code with your phone, complete the waiver, then pay with Venmo or Cash App. Add
            an optional tip at checkout.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-zinc-400">
            <li>
              Venmo: <span className="font-medium text-[#3D95CE]">{paymentDisplay.venmo}</span>
            </li>
            <li>
              Cash App: <span className="font-medium text-[#00D632]">{paymentDisplay.cashApp}</span>
            </li>
          </ul>
          <Link
            href="/sign-pay"
            className="mt-8 inline-block rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-black hover:bg-amber-400"
          >
            Open sign & pay page
          </Link>
        </div>
        <SpotCheckInQr size="lg" className="lg:justify-self-end" />
      </div>
    </section>
  );
}
