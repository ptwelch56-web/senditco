import Image from "next/image";
import { currentStarJumper } from "@/lib/site";

export function StarJumpersSection() {
  const jumper = currentStarJumper;

  return (
    <section
      id="star-jumpers"
      className="scroll-mt-24 border-b border-white/10 bg-gradient-to-b from-amber-950/20 to-black pt-6"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-400">
              Star Jumpers of the Month
            </p>
            <h2 className="font-display mt-2 text-3xl text-white sm:text-4xl">
              Riders sending it
            </h2>
            <p className="mt-3 max-w-2xl text-zinc-400">
              Each month we spotlight a rider who&apos;s putting in the work—progress on the ramp,
              confidence in the air, and heart on the track. Want your shot here? Keep showing up
              and send it.
            </p>
          </div>
          <p className="rounded-full border border-amber-500/40 bg-amber-950/30 px-4 py-2 text-sm font-semibold text-amber-200">
            {jumper.monthLabel}
          </p>
        </div>

        <article className="mt-10 overflow-hidden rounded-3xl border border-amber-500/30 bg-zinc-950/80 shadow-xl shadow-amber-950/20 lg:grid lg:grid-cols-2">
          <div className="flex flex-col justify-center p-6 sm:p-10 lg:order-1">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500">
              {jumper.headline}
            </p>
            <h3 className="font-display mt-3 text-4xl text-white sm:text-5xl">{jumper.name}</h3>

            {jumper.achievement ? (
              <div className="mt-6 rounded-2xl border border-amber-500/40 bg-amber-950/40 px-5 py-4">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Latest win
                </p>
                <p className="mt-2 text-lg font-semibold text-white">{jumper.achievement}</p>
              </div>
            ) : null}

            <p className="mt-6 text-base leading-relaxed text-zinc-300">{jumper.progress}</p>

            <p className="mt-8 text-sm text-zinc-500">
              Know a rider leveling up? Book a session and keep stacking progress—we pick a new
              Star Jumper every month.
            </p>
          </div>

          <div className="flex flex-col bg-black lg:order-2">
            <figure className="relative aspect-[9/16] w-full max-h-[520px] sm:max-h-[560px] lg:max-h-none lg:flex-1">
              <Image
                src={jumper.imageSrc}
                alt={jumper.imageAlt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </figure>
            <figure className="border-t border-white/10">
              <video
                className="aspect-[9/16] w-full max-h-[480px] object-cover lg:max-h-[520px]"
                controls
                playsInline
                preload="metadata"
                poster={jumper.poster}
              >
                <source src={jumper.videoSrc} type="video/mp4" />
              </video>
              <figcaption className="px-4 py-2 text-center text-xs text-zinc-500">
                Session clip — {jumper.name}
              </figcaption>
            </figure>
          </div>
        </article>
      </div>
    </section>
  );
}
