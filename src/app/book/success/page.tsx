import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/lib/site";

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export default async function BookSuccessPage({ searchParams }: Props) {
  const { id } = await searchParams;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-red-500">
          You&apos;re in the queue
        </p>
        <h1 className="font-display mt-3 text-4xl text-white">Request received</h1>
        {id ? (
          <p className="mt-4 font-mono text-sm text-zinc-400">Reference: {id}</p>
        ) : null}
        <p className="mt-6 text-zinc-300">
          Your booking request and signed waiver were submitted. We&apos;ll confirm
          your date by phone or email—usually within 24 hours.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={site.phoneHref}
            className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Call {site.phone}
          </a>
          <Link
            href="/"
            className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Back to home
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
