export const site = {
  name: "sendit and sons.co",
  domain: "senditandsons.com",
  url: "https://senditandsons.com",
  tagline: "Mobile BMX & mountain bike jump lessons",
  description:
    "We bring the ramp and air bag to you. Learn to jump safely with 30 years of BMX experience—including 2023 UCI BMX World Championships.",
  seoDescription:
    "Mobile BMX & mountain bike jump lessons in Mebane, NC. Portable ramp and air bag for driveways, birthday parties, schools, and events across the Triangle & Triad. Book online.",
  seoKeywords: [
    "BMX jump lessons",
    "mobile BMX ramp",
    "air bag BMX",
    "mountain bike jump lessons",
    "BMX birthday party",
    "Mebane NC",
    "Triangle NC",
    "Triad NC",
    "BMX lessons near me",
  ],
  location: "Mebane, NC",
  serviceArea: "Mebane and the surrounding Triangle & Triad area",
  phone: "336-437-3825",
  phoneHref: "tel:+13364373825",
  email: "starzndstripesmedia@gmail.com",
  facebook:
    "https://www.facebook.com/share/v/192NoWUCU3/",
  googleReviewUrl: "https://g.page/r/CaKDu2xqIkJfEAE/review",
} as const;

export type PackageId =
  | "private"
  | "two-riders"
  | "small-group"
  | "birthday"
  | "custom-event"
  | "event-spot";

/** On-the-fly event / QR check-in — not shown on advance booking */
export const spotSession = {
  id: "event-spot" as const,
  title: "On-spot ride",
  price: "$30",
  priceAmount: 30,
  duration: "On-site",
  riders: "Riding with instructions and guidance as needed",
};

export const packages: {
  id: PackageId;
  title: string;
  price: string;
  /** USD amount for Venmo / Cash App links; null = custom quote */
  priceAmount: number | null;
  duration: string;
  riders: string;
  highlight?: boolean;
}[] = [
  {
    id: "private",
    title: "Private lesson",
    price: "$99",
    priceAmount: 99,
    duration: "60 minutes",
    riders: "1 rider",
  },
  {
    id: "two-riders",
    title: "Two riders",
    price: "$149",
    priceAmount: 149,
    duration: "60 minutes",
    riders: "2 riders",
  },
  {
    id: "small-group",
    title: "Small group",
    price: "$199",
    priceAmount: 199,
    duration: "60 minutes",
    riders: "3–5 riders",
    highlight: true,
  },
  {
    id: "birthday",
    title: "Birthday party",
    price: "$449",
    priceAmount: 449,
    duration: "2 hours",
    riders: "Up to 8 riders",
  },
  {
    id: "custom-event",
    title: "Events & groups",
    price: "Custom quote",
    priceAmount: null,
    duration: "Flexible",
    riders: "Corporate, school, church, festivals & more",
  },
  {
    id: spotSession.id,
    title: spotSession.title,
    price: spotSession.price,
    priceAmount: spotSession.priceAmount,
    duration: spotSession.duration,
    riders: spotSession.riders,
  },
];

export const includes = [
  "Portable BMX/MTB jump ramp",
  "Professional air bag landing",
  "Bikes available if needed",
  "Helmets available if needed",
  "Safe, encouraging instruction",
];

export const perfectFor = [
  "First-time jumpers",
  "Riders improving jump technique",
  "BMX & mountain bike riders of all levels",
  "Kids (ages 8+) and adults",
];

export const eventTypes = [
  "Corporate events",
  "School events",
  "Church events",
  "Festivals",
  "Adult parties",
  "Community events",
];

export type StarJumper = {
  name: string;
  monthLabel: string;
  imageSrc: string;
  imageAlt: string;
  videoSrc: string;
  poster?: string;
  headline: string;
  progress: string;
  achievement?: string;
};

/** Update monthly — featured rider media lives in /public/media/ */
export const currentStarJumper: StarJumper = {
  name: "Logan Bowes",
  monthLabel: "August 2026",
  imageSrc: "/media/logan-bowes-star-jumper.png",
  imageAlt: "Logan Bowes mid-jump on his BMX bike over the air bag ramp",
  videoSrc: "/media/logan-bowes-star-jumper.mp4",
  poster: "/media/logan-bowes-star-jumper.png",
  headline: "Star Jumper of the Month",
  progress:
    "Logan has been putting in work on the ramp—building confidence, dialing in his technique, and sending it higher every session. His progress on the bike shows what consistent reps and courage look like.",
  achievement: "First race win at Burlington BMX — Friday, July 31, 2026",
};

export const media = {
  heroVideo: "/media/jump-1.mp4",
  heroPoster: "/media/action-1.jpg",
  videos: [
    {
      src: "/media/jump-1.mp4",
      poster: "/media/action-1.jpg",
      label: "Air bag session",
    },
    {
      src: "/media/jump-2.mp4",
      poster: "/media/action-2.jpg",
      label: "Ramp to bag",
    },
    {
      src: "/media/gallery-jump-3.mp4",
      poster: "/media/action-1.jpg",
      label: "Session highlight",
    },
    {
      src: "/media/gallery-jump-4.mp4",
      poster: "/media/youth-jump.jpg",
      label: "Jump progression",
    },
    {
      src: "/media/gallery-jump-5.mp4",
      poster: "/media/evening-jump-line.jpg",
      label: "On the air bag",
    },
  ],
  photos: [
    {
      src: "/media/action-1.jpg",
      alt: "Rider jumping onto the portable air bag landing",
    },
    {
      src: "/media/action-2.jpg",
      alt: "Mountain bike jump session in a backyard setup",
    },
    {
      src: "/media/action-3.png",
      alt: "Mobile ramp and Ninja air bag ready for lessons",
    },
    {
      src: "/media/instructor-dirt-jump.jpg",
      alt: "Instructor catching big air on a dirt jump",
    },
    {
      src: "/media/youth-jump.jpg",
      alt: "Young rider learning to jump with a full-face helmet",
    },
    {
      src: "/media/evening-jump-line.jpg",
      alt: "Jump session at dusk with lights in the trees",
    },
    {
      src: "/media/team-usa-competition.jpg",
      alt: "Team USA BMX rider jumping at a professional competition",
    },
  ],
} as const;
