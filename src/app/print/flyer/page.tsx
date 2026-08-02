import { FlyerPrintPage } from "@/components/print/FlyerPrintPage";

export const metadata = {
  title: "Flyer (print)",
  robots: { index: false, follow: false },
};

export default function FlyerPage() {
  return <FlyerPrintPage />;
}
