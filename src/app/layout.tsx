import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Oswald } from "next/font/google";
import { HashScrollOnLoad } from "@/components/HashScrollOnLoad";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { MobileActionBar } from "@/components/MobileActionBar";
import "./globals.css";
import { site } from "@/lib/site";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | BMX Jump Lessons Mebane NC & Triangle`,
    template: `%s | ${site.name}`,
  },
  description: site.seoDescription,
  keywords: [...site.seoKeywords],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${site.name} | Mobile BMX Jump Lessons`,
    description: site.seoDescription,
    url: site.url,
    siteName: site.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | Mobile BMX Jump Lessons`,
    description: site.seoDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden bg-[#070708] pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] text-zinc-100 md:pb-0">
        <MetaPixel />
        <HashScrollOnLoad />
        {children}
        <MobileActionBar />
      </body>
    </html>
  );
}
