export const site = {
  name: "sendit and sons.co",
  domain: "senditandsons.co",
  tagline: "Mobile BMX & mountain bike jump lessons",
  description:
    "We bring the ramp and air bag to you. Learn to jump safely with 30 years of BMX experience—including 2023 UCI BMX World Championships.",
  location: "Mebane, NC",
  serviceArea: "Mebane and the surrounding Triangle & Triad area",
  phone: "336-437-3825",
  phoneHref: "tel:+13364373825",
  email: "starzndstripesmedia@gmail.com",
  facebook:
    "https://www.facebook.com/share/v/192NoWUCU3/",
} as const;

export type PackageId =
  | "private"
  | "two-riders"
  | "small-group"
  | "birthday"
  | "custom-event";

export const packages: {
  id: PackageId;
  title: string;
  price: string;
  duration: string;
  riders: string;
  highlight?: boolean;
}[] = [
  {
    id: "private",
    title: "Private lesson",
    price: "$99",
    duration: "60 minutes",
    riders: "1 rider",
  },
  {
    id: "two-riders",
    title: "Two riders",
    price: "$149",
    duration: "60 minutes",
    riders: "2 riders",
  },
  {
    id: "small-group",
    title: "Small group",
    price: "$199",
    duration: "60 minutes",
    riders: "3–5 riders",
    highlight: true,
  },
  {
    id: "birthday",
    title: "Birthday party",
    price: "$449",
    duration: "2 hours",
    riders: "Up to 8 riders",
  },
  {
    id: "custom-event",
    title: "Events & groups",
    price: "Custom quote",
    duration: "Flexible",
    riders: "Corporate, school, church, festivals & more",
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
