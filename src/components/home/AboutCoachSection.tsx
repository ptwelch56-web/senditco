import { coach, site } from "@/lib/site";

export function AboutCoachSection() {
  return (
    <section
      id="about"
      className="scroll-mt-24 border-b border-white/10 bg-zinc-950/60"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-400">
            Your coach
          </p>
          <h2 className="font-display mt-2 text-3xl text-white sm:text-4xl">
            {coach.name}
          </h2>
          <p className="mt-2 text-sm font-medium text-zinc-400">{coach.role}</p>
          <p className="mt-6 text-base leading-relaxed text-zinc-300">
            {coach.bio}
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-300">
            {coach.why}
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {coach.highlights.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200"
              >
                <span className="mr-2 text-red-500">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <aside className="rounded-3xl border border-white/10 bg-gradient-to-br from-red-950/40 to-blue-950/20 p-7 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Why a controlled setup
          </p>
          <p className="mt-4 text-lg leading-relaxed text-white">
            “I&apos;ve seen too many people get hurt and never go after their
            passion. We use a ramp and air bag so riders can progress—kids and
            adults—without that fear taking over.”
          </p>
          <p className="mt-6 text-sm text-zinc-400">
            Based in {site.location}. We come to you across the Triangle &amp;
            Triad.
          </p>
        </aside>
      </div>
    </section>
  );
}
