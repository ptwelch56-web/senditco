export const sectionNavLinks = [
  { href: "/#gallery", label: "Gallery" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#event-signup", label: "Event sign-up" },
  { href: "/#service-area", label: "Service area" },
] as const;

export const mobileNavLinks = [
  { href: "/", label: "Home" },
  ...sectionNavLinks,
  { href: "/book", label: "Book & waiver" },
  { href: "/sign-pay", label: "Sign & pay" },
] as const;
