// All editable site content lives here. Add products, partners and roles
// to the arrays below — sections, pages and menus update automatically.
//
// Keep everything here true: the site is indexed by search engines and read by
// investors. Lists like clients, testimonials or metrics can stay empty — their
// sections hide themselves until there is real data to show.
// `demo: true` hides the whole site from search engines.

const email = "aicylink@gmail.com";

export const site = {
  demo: false,
  name: "AicyLink",
  legalName: "AicyLink", // no legal entity yet — update once registered
  founded: 2025,
  location: "Remote-first",
  // Canonical address used in SEO tags, sitemap and social previews.
  // Change it here (or via NEXT_PUBLIC_SITE_URL in Vercel) when the domain is bought.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://aicylink.vercel.app",
  // Google Search Console → "HTML tag" verification code (content="…" value).
  googleVerification: "51LKYNL0VFbaDpj0jciRmgSLJRSCDnKKVKQTlq1gsXQ",
  email,
  pressEmail: email,
  careersEmail: email,
  linkedin: "https://www.linkedin.com/company/aicylink",
  eyebrow: "AI product studio",
  title: "AI apps for",
  titleAccent: "everyday life.",
  description:
    "AicyLink is a product studio building simple, AI-powered apps that people use every day — for creating, feeling better and discovering more about themselves.",
};

export type Product = {
  /** Matches an icon in components/app-icon.tsx */
  id: AppId;
  name: string;
  description: string;
  /** flagship: our main live product · beta: public beta · next: launching next · early: in development, early access */
  status: "flagship" | "beta" | "next" | "early";
  href?: string;
};

export type AppId = "lummie" | "cv" | "snap" | "glow" | "move" | "learn" | "stars" | "dreams";

export type Category = {
  id: string;
  name: string;
  tagline: string;
  color: string;
  products: Product[];
};

export const categories: Category[] = [
  {
    id: "create",
    name: "Create",
    tagline: "AI tools that turn ideas into something real.",
    color: "var(--ice-1)",
    products: [
      { id: "lummie", name: "Lummie", description: "An AI companion to chat, talk and create with.", status: "flagship", href: "https://lummie.app" },
      { id: "cv", name: "Tailra", description: "Tailor your resume to any job post in seconds.", status: "early" },
    ],
  },
  {
    id: "thrive",
    name: "Thrive",
    tagline: "Personal apps for health, fitness and confidence.",
    color: "var(--ice-2)",
    products: [
      { id: "snap", name: "Platey", description: "Snap your meal — get calories and macros instantly.", status: "next" },
      { id: "glow", name: "Glowie", description: "A personal AI glow-up plan for skin, style and hair.", status: "early" },
      { id: "move", name: "Wallie", description: "Wall pilates and somatic workouts made for you.", status: "early" },
    ],
  },
  {
    id: "explore",
    name: "Explore",
    tagline: "Learning and self-discovery, a few minutes a day.",
    color: "var(--ice-3)",
    products: [
      { id: "learn", name: "Nibble", description: "Five-minute daily lessons on AI, money and focus.", status: "early" },
      { id: "stars", name: "Lunara", description: "AI astrology, birth charts and tarot readings.", status: "next" },
      { id: "dreams", name: "Dreamie", description: "A dream journal with AI interpretations.", status: "early" },
    ],
  },
];

export const companyLinks = [
  { label: "About AicyLink", text: "Our mission, story and team", href: "/about" },
  { label: "Careers", text: "Open roles and how we work", href: "/careers" },
  { label: "Press & brand", text: "News, logos and brand assets", href: "/press" },
  { label: "Contact", text: "Investors, clients, press", href: "/contact" },
];

export const legalLinks = [
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Service", href: "/legal/terms" },
];

export const principles = [
  { label: "Product-first", text: "We build and run our own services end to end." },
  { label: "AI-native", text: "Intelligence designed in from day one." },
  { label: "Built to scale", text: "Modern infrastructure, ready for growth." },
  { label: "Global by default", text: "Made for customers everywhere." },
];

export const metrics: { value: number; suffix: string; decimals: number; label: string }[] = [];

export const audiences = [
  {
    tag: "For investors",
    title: "Back a growing portfolio of apps.",
    text: "One studio, many products, one shared playbook for building and growing them. Let's talk.",
    cta: { label: "Investor relations", href: "/contact?topic=investors" },
    color: "var(--ice-1)",
  },
  {
    tag: "For partners",
    title: "Grow together with our apps.",
    text: "Advertising, distribution and co-development — let's find a way to work together.",
    cta: { label: "Talk to our team", href: "/contact?topic=partnership" },
    color: "var(--ice-2)",
  },
  {
    tag: "For talent",
    title: "Build what's next with us.",
    text: "Take products from zero to launch, with real ownership and a modern AI stack.",
    cta: { label: "See careers", href: "/careers" },
    color: "var(--ice-3)",
  },
];

// Real clients and partners only — the section hides while the list is empty.
export const clients: string[] = [];

export const nav = [
  ...(clients.length ? [{ label: "Partners", href: "/#partners" }] : []),
  { label: "Careers", href: "/careers" },
];

// Real customer quotes only (with their permission).
export const testimonials: { quote: string; name: string; role: string }[] = [];

export const timeline = [
  { year: "2025", title: "AicyLink is founded", text: "A product studio set up to build a portfolio of simple, AI-powered apps." },
  { year: "Jan 2026", title: "Lummie goes live", text: "Our first product launches: an AI companion for chatting and creating." },
  { year: "Next", title: "Building the portfolio", text: "Seven new apps in development across creativity, wellbeing and self-discovery." },
];

export const values = [
  { title: "Simple wins", text: "Every app does one thing — and does it really well." },
  { title: "Own the outcome", text: "Every person owns their work from the first idea to the last metric." },
  { title: "Move with clarity", text: "Small teams, written thinking, fast decisions." },
  { title: "Earn trust daily", text: "Reliability, security and honesty are part of the product." },
];

export const team = [{ name: "Vladislav Kosevich", role: "Founder" }];

export type Partner = { name: string; logo: string; href?: string };

export const partners: Partner[] = [];

export type Role = { title: string; team: string; location: string; type: string; href: string };

// Add real openings here; while empty, the careers pages invite open applications.
export const roles: Role[] = [];

export const perks = [
  { title: "Remote-first", text: "Work from wherever you do your best work." },
  { title: "Real ownership", text: "Own a product end to end — from idea to growth." },
  { title: "Ship fast", text: "Small team, short loops: ideas reach real users in weeks." },
  { title: "AI-native stack", text: "Build with the latest models, tools and frameworks." },
];

export const hiringSteps = [
  { step: "01", title: "Intro call", text: "30 minutes to get to know each other." },
  { step: "02", title: "Skills deep-dive", text: "A practical conversation about real problems." },
  { step: "03", title: "Team day", text: "Meet the people you'll work with." },
  { step: "04", title: "Offer", text: "A clear offer within a few days." },
];

export const news = [
  { date: "2026-01", source: "Product launch", title: "AicyLink launches Lummie, its first AI product" },
];

export const brandColors = [
  { name: "Ink", value: "#0A0A0A" },
  { name: "Ice Blue", value: "#0EA5E9" },
  { name: "Ice Cyan", value: "#06B6D4" },
  { name: "Ice Violet", value: "#7C5CFF" },
  { name: "Frost", value: "#F6F7F9" },
];

export const contactTopics = [
  { id: "investors", label: "Investment" },
  { id: "partnership", label: "Partnership" },
  { id: "product", label: "Product inquiry" },
  { id: "careers", label: "Careers" },
  { id: "press", label: "Press" },
  { id: "other", label: "Other" },
] as const;

export type ContactTopic = (typeof contactTopics)[number]["id"];
