import Image from "next/image";
import { media } from "@/lib/site";

export function MediaGallery() {
  return (
    <section id="gallery" className="border-b border-white/10 bg-black/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl text-white sm:text-4xl">
          See it in action
        </h2>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Real sessions at home—portable ramp, professional air bag, and coached
          jumps. Plus decades of racing and freestyle experience, including Team
          USA and the UCI BMX World Championships.
        </p>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {media.videos.map((video) => (
            <figure
              key={video.src}
              className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950"
            >
              <video
                className="aspect-[9/16] max-h-[520px] w-full bg-black object-cover sm:aspect-video sm:max-h-none"
                controls
                playsInline
                preload="metadata"
                poster={video.poster}
              >
                <source src={video.src} type="video/mp4" />
              </video>
              <figcaption className="px-4 py-3 text-sm font-medium text-zinc-300">
                {video.label}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {media.photos.map((photo, index) => (
            <figure
              key={photo.src}
              className="relative overflow-hidden rounded-2xl border border-white/10"
            >
              <div className="relative aspect-[3/4] sm:aspect-[4/5]">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={index < 2}
                />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
