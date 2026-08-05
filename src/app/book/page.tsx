import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { BookingWizard } from "@/components/book/BookingWizard";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book BMX Jump Lessons | Mebane NC",
  description: `Request a mobile BMX/MTB jump session in ${site.location}. Sign the waiver and we'll confirm your date.`,
  alternates: { canonical: "/book" },
};

export default function BookPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[70vh] pb-8 md:pb-0">
        <BookingWizard />
      </main>
      <SiteFooter />
    </>
  );
}
