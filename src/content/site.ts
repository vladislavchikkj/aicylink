// All editable site content lives here. Add products, partners and roles
// to the arrays below — sections, pages and menus update automatically.
//
// ⚠️ DEMO CONTENT: everything marked `DEMO` is placeholder data so the site
// looks complete. Replace it with real data, then set `demo: false` —
// while `demo` is true the site asks search engines not to index it.

export const site = {
  demo: true,
  name: "AicyLink",
  legalName: "AicyLink Ltd.", // DEMO
  founded: 2024, // DEMO
  location: "Remote-first · Europe", // DEMO
  url: "https://aicylink.com", // TODO: confirm production domain
  email: "hello@aicylink.com", // TODO: confirm contact email
  pressEmail: "press@aicylink.com", // TODO
  careersEmail: "careers@aicylink.com", // TODO
  linkedin: "https://www.linkedin.com/company/aicylink",
  eyebrow: "AicyLink platform",
  title: "Web services for the",
  titleAccent: "connected world.",
  description:
    "AicyLink builds and runs a family of fast, intelligent web services — so businesses can launch, grow and scale on a single trusted platform.",
};

export type Product = {
  name: string;
  description: string;
  status: "live" | "beta" | "soon";
  href?: string;
};

export type Category = {
  id: string;
  name: string;
  tagline: string;
  color: string;
  products: Product[];
};

// DEMO products
export const categories: Category[] = [
  {
    id: "build",
    name: "Build",
    tagline: "Tools that help teams create and ship web products faster.",
    color: "var(--ice-1)",
    products: [
      { name: "Aicy Forge", description: "Spin up production-ready web apps in minutes.", status: "beta" },
      { name: "Aicy Pages", description: "Lightning-fast sites with a visual editor.", status: "soon" },
    ],
  },
  {
    id: "grow",
    name: "Grow",
    tagline: "Business services that turn visitors into loyal customers.",
    color: "var(--ice-2)",
    products: [
      { name: "Aicy Pulse", description: "Real-time product analytics with AI insights.", status: "live" },
      { name: "Aicy Flow", description: "Onboarding and paywall funnels that convert.", status: "beta" },
    ],
  },
  {
    id: "scale",
    name: "Scale",
    tagline: "Infrastructure and AI that keep everything fast and reliable.",
    color: "var(--ice-3)",
    products: [
      { name: "Aicy Edge", description: "Global edge hosting with zero-config scaling.", status: "live" },
      { name: "Aicy Mind", description: "Plug-and-play AI agents for your product.", status: "soon" },
    ],
  },
];

export const nav = [
  { label: "Partners", href: "/#partners" },
  { label: "Careers", href: "/careers" },
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

// DEMO metrics
export const metrics = [
  { value: 2.4, suffix: "M+", decimals: 1, label: "Monthly active users" },
  { value: 40, suffix: "+", decimals: 0, label: "Countries served" },
  { value: 99.99, suffix: "%", decimals: 2, label: "Platform uptime" },
  { value: 6, suffix: "", decimals: 0, label: "Products in the portfolio" },
];

export const audiences = [
  {
    tag: "For investors",
    title: "Back a growing portfolio of products.",
    text: "One company, many products, one shared platform. Let's talk about building it together.",
    cta: { label: "Investor relations", href: "/contact?topic=investors" },
    color: "var(--ice-1)",
  },
  {
    tag: "For businesses",
    title: "Services built for your growth.",
    text: "Use our products or partner with us to bring a new web service to your customers.",
    cta: { label: "Talk to our team", href: "/contact?topic=partnership" },
    color: "var(--ice-2)",
  },
  {
    tag: "For talent",
    title: "Build what's next with us.",
    text: "Work on products from zero to launch, with real ownership and modern tools.",
    cta: { label: "See careers", href: "/careers" },
    color: "var(--ice-3)",
  },
];

// DEMO clients — fictional brands rendered as wordmarks
export const clients = ["Northbeam", "Lumora", "Arcfield", "Quantive", "Hollow Pine", "Brightwave", "Corvex", "Meridia"];

// DEMO testimonials
export const testimonials = [
  {
    quote:
      "AicyLink shipped in weeks what our team had planned for two quarters. The quality bar is genuinely world-class.",
    name: "Elena Marsh",
    role: "VP Product, Lumora",
  },
  {
    quote: "Aicy Pulse became the first dashboard our leadership opens every morning. It just tells us what matters.",
    name: "David Okafor",
    role: "COO, Arcfield",
  },
  {
    quote: "Reliable, fast and thoughtful. Working with the AicyLink team feels like having a senior product studio in-house.",
    name: "Sofia Lindqvist",
    role: "Founder, Brightwave",
  },
];

// DEMO company story
export const timeline = [
  { year: "2024", title: "AicyLink is founded", text: "A small team of engineers sets out to build a portfolio of web services." },
  { year: "2025", title: "First products launch", text: "Aicy Pulse and Aicy Edge go live with early customers in Europe." },
  { year: "2026", title: "Going global", text: "Six products, customers in 40+ countries and a growing remote team." },
];

export const values = [
  { title: "Craft over volume", text: "We'd rather ship one excellent product than five average ones." },
  { title: "Own the outcome", text: "Every person owns their work from the first idea to the last metric." },
  { title: "Move with clarity", text: "Small teams, written thinking, fast decisions." },
  { title: "Earn trust daily", text: "Reliability, security and honesty are part of the product." },
];

// DEMO team
export const team = [
  { name: "Alex Rowan", role: "Co-founder & CEO" },
  { name: "Mira Volkova", role: "Co-founder & CTO" },
  { name: "Jonas Becker", role: "Head of Product" },
  { name: "Lea Fontaine", role: "Head of Design" },
  { name: "Marcus Hale", role: "Head of Engineering" },
  { name: "Nadia Petrova", role: "Head of Growth" },
];

export type Partner = { name: string; logo: string; href?: string };

export const partners: Partner[] = [];

export type Role = { title: string; team: string; location: string; type: string; href: string };

// DEMO roles
export const roles: Role[] = [
  { title: "Senior Frontend Engineer", team: "Engineering", location: "Remote · Europe", type: "Full-time", href: "/contact?topic=careers" },
  { title: "Backend Engineer (Node.js)", team: "Engineering", location: "Remote · Europe", type: "Full-time", href: "/contact?topic=careers" },
  { title: "Product Designer", team: "Design", location: "Remote", type: "Full-time", href: "/contact?topic=careers" },
  { title: "Growth Marketing Manager", team: "Growth", location: "Remote", type: "Full-time", href: "/contact?topic=careers" },
];

export const perks = [
  { title: "Remote-first", text: "Work from anywhere in Europe-friendly time zones." },
  { title: "Real ownership", text: "Own products end to end, with equity for early team members." },
  { title: "Top-tier tools", text: "Latest hardware, AI tools and any software you need." },
  { title: "Learning budget", text: "Annual budget for courses, books and conferences." },
  { title: "Team offsites", text: "We meet in person a few times a year somewhere beautiful." },
  { title: "Flexible time off", text: "Rest when you need it — we care about results, not hours." },
];

export const hiringSteps = [
  { step: "01", title: "Intro call", text: "30 minutes to get to know each other." },
  { step: "02", title: "Skills deep-dive", text: "A practical conversation about real problems." },
  { step: "03", title: "Team day", text: "Meet the people you'll work with." },
  { step: "04", title: "Offer", text: "A clear offer within a few days." },
];

// DEMO press
export const news = [
  { date: "2026-09-12", source: "Company news", title: "AicyLink expands its portfolio to six web services" },
  { date: "2026-05-03", source: "Company news", title: "Aicy Edge reaches 99.99% uptime across 40+ countries" },
  { date: "2025-11-20", source: "Company news", title: "AicyLink launches Aicy Pulse, AI-powered product analytics" },
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
