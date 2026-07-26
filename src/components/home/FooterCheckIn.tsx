import Link from "next/link";
import { SpotCheckInQr } from "@/components/onsite/SpotCheckInQr";
import { spotSession } from "@/lib/site";

export function FooterCheckIn() {
  return (
    <div className="border-t border-white/10 bg-white/[0.02]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-10 sm:flex-row sm:justify-between sm:px-6">
        <div className="text-center sm:text-left">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-500">
            On the spot
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            {spotSession.price} — sign waiver & pay
          </p>
          <p className="mt-1 max-w-md text-sm text-zinc-400">{spotSession.riders}</p>
          <Link
            href="/sign-pay"
            className="mt-4 inline-block text-sm font-semibold text-amber-400 hover:text-amber-300"
          >
            Open on your phone →
          </Link>
        </div>
        <SpotCheckInQr size="md" showUrl={false} />
      </div>
    </div>
  );
}
