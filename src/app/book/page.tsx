import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { BookingWizard } from "@/components/book/BookingWizard";

export const metadata = {
  title: "Book & waiver",
  description: "Request a mobile BMX/MTB jump session and sign the liability waiver.",
};

export default function BookPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[70vh]">
        <BookingWizard />
      </main>
      <SiteFooter />
    </>
  );
}
