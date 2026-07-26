import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { OnsiteWizard } from "@/components/onsite/OnsiteWizard";

export const metadata = {
  title: "Event check-in",
  description: "Sign waiver and pay at a sendit and sons.co event booth.",
};

type Props = {
  searchParams: Promise<{ event?: string }>;
};

export default async function EventCheckInPage({ searchParams }: Props) {
  const { event } = await searchParams;

  return (
    <>
      <SiteHeader />
      <main className="min-h-[70vh] pb-8 md:pb-0">
        <OnsiteWizard defaultEventName={event ?? ""} />
      </main>
      <SiteFooter />
    </>
  );
}
