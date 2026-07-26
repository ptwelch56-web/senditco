import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { EventBoothHub } from "@/components/event/EventBoothHub";

export const metadata = {
  title: "Event booth",
  description: "QR check-in for event waiver and Venmo / Cash App payment.",
};

export default function EventBoothPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[70vh] pb-8 md:pb-0">
        <EventBoothHub />
      </main>
      <SiteFooter />
    </>
  );
}
