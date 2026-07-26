import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { OnsiteWizard } from "@/components/onsite/OnsiteWizard";

export const metadata = {
  title: "Sign waiver & pay",
  description:
    "On-site waiver and payment with Venmo or Cash App for sendit and sons.co jump sessions.",
};

export default function SignPayPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[70vh] pb-8 md:pb-0">
        <OnsiteWizard />
      </main>
      <SiteFooter />
    </>
  );
}
