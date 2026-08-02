import type { Metadata } from "next";
import { BusinessCardPrintPage } from "@/components/print/BusinessCardPrintPage";

export const metadata: Metadata = {
  title: "Business card (print)",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <BusinessCardPrintPage />;
}
