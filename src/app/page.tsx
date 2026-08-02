import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { EventSignupSection } from "@/components/home/EventSignupSection";
import { MediaGallery } from "@/components/home/MediaGallery";
import { ReviewBanner } from "@/components/home/ReviewBanner";
import { StarJumpersSection } from "@/components/home/StarJumpersSection";
import {
  eventTypes,
  includes,
  media,
  packages,
  perfectFor,
  site,
  spotSession,
} from "@/lib/site";

export default function HomePage() {
  const mailSubject = encodeURIComponent(`${site.name} booking request`);

  return (
    <>
      <SiteHeader />
      <main>
        <ReviewBanner />

        <StarJumpersSection />

        <section className="relative overflow-hidden border-b border-white/10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(220,38,38,0.25),_transparent_50%),radial-gradient(ellipse_at_bottom_right,_rgba(37,99,235,0.15),_transparent_45%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-600 via-white to-blue-700" />
          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-400">
                We bring the ramp & air bag to you
              </p>
              <h1 className="font-display mt-4 text-5xl leading-none text-white sm:text-6xl lg:text-7xl">
                Learn to jump.
                <span className="block text-red-500">Send it.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-300">
                Mobile BMX & mountain bike jump lessons at your home or event.
                30 years of BMX experience—including racing, freestyle, and the{" "}
                <strong className="text-white">2023 UCI BMX World Championships</strong>.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/book"
                  className="rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-900/50 hover:bg-red-500"
                >
                  Book & sign waiver
                </Link>
                <a
                  href={site.phoneHref}
                  className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Call {site.phone}
                </a>
              </div>
              <p className="mt-4 text-sm text-zinc-500">
                At an event now?{" "}
                <Link href="/sign-pay" className="text-amber-400 hover:text-amber-300">
                  Sign waiver & pay — $30
                </Link>
              </p>
              <p className="mt-6 text-sm text-zinc-500">
                Based in {site.location} · {site.serviceArea}
              </p>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-red-950/30">
                <video
                  className="aspect-[9/16] w-full bg-black object-cover sm:aspect-[4/5] lg:aspect-[3/4]"
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={media.heroPoster}
                >
                  <source src={media.heroVideo} type="video/mp4" />
                </video>
                <div className="border-t border-white/10 bg-zinc-950/90 p-4 sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Session includes
                  </p>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {includes.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-zinc-200">
                        <span className="text-red-500">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <MediaGallery />

        <section id="how-it-works" className="scroll-mt-24 mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl text-white sm:text-4xl">
            How it works
          </h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Book",
                body: "Pick a package, tell us your date and address, and sign the waiver online.",
              },
              {
                step: "2",
                title: "We roll up",
                body: "We bring the portable ramp, air bag, and gear to your driveway or event.",
              },
              {
                step: "3",
                title: "Send it",
                body: "Coached jumps at your pace—first-timers to riders leveling up tricks.",
              },
            ].map((item) => (
              <li
                key={item.step}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <p className="text-sm font-bold text-red-500">Step {item.step}</p>
                <p className="mt-2 font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-sm text-zinc-400">{item.body}</p>
              </li>
            ))}
          </ol>
          <h3 className="font-display mt-14 text-2xl text-white sm:text-3xl">
            Perfect for
          </h3>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {perfectFor.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-zinc-300"
              >
                <span className="mb-2 inline-block text-red-500">✓</span>
                <p className="font-medium text-white">{item}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="pricing" className="scroll-mt-24 border-y border-white/10 bg-white/[0.02]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-3xl text-white sm:text-4xl">Pricing</h2>
              <Link href="/book" className="text-sm font-semibold text-red-400 hover:text-red-300">
                Book online →
              </Link>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {packages.filter((pkg) => pkg.id !== "event-spot").map((pkg) => (
                <article
                  key={pkg.id}
                  className={`rounded-2xl border p-6 ${
                    pkg.highlight
                      ? "border-red-500/50 bg-red-950/20 ring-1 ring-red-500/30"
                      : "border-white/10 bg-black/40"
                  }`}
                >
                  <h3 className="text-lg font-semibold text-white">{pkg.title}</h3>
                  <p className="mt-2 text-3xl font-bold text-red-400">{pkg.price}</p>
                  <p className="mt-2 text-sm text-zinc-400">
                    {pkg.duration} · {pkg.riders}
                  </p>
                </article>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-zinc-500">
              {eventTypes.join(" · ")} — on-site event rides {spotSession.price}.{" "}
              <Link href="#event-signup" className="text-amber-400 hover:text-amber-300">
                Scan QR to sign & pay
              </Link>
            </p>
          </div>
        </section>

        <EventSignupSection />

        <section id="service-area" className="scroll-mt-24 mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-red-950/30 to-blue-950/20 p-8 sm:p-12">
            <h2 className="font-display text-3xl text-white">Ready to get air?</h2>
            <p className="mt-4 max-w-2xl text-zinc-300">
              Birthday parties, team building, or your first jump—we&apos;ll bring the
              experience to your driveway, school, or event.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/book"
                className="rounded-full bg-white px-6 py-3 text-sm font-bold text-black hover:bg-zinc-200"
              >
                Book & sign waiver
              </Link>
              <a
                href={`mailto:${site.email}?subject=${mailSubject}`}
                className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Email {site.email}
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
