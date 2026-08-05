import { site } from "@/lib/site";

export function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: site.name,
    description: site.seoDescription,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    areaServed: [
      { "@type": "City", name: "Mebane", addressRegion: "NC" },
      { "@type": "AdministrativeArea", name: "Research Triangle" },
      { "@type": "AdministrativeArea", name: "Piedmont Triad" },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mebane",
      addressRegion: "NC",
      addressCountry: "US",
    },
    priceRange: "$$",
    sameAs: [site.facebook, site.googleReviewUrl],
    knowsAbout: [
      "BMX jump lessons",
      "Mountain bike jump lessons",
      "Mobile BMX ramp",
      "Air bag landing",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
