// All editable site content lives here. Add products, partners and roles
// to the arrays below — sections and menus update automatically.

export const site = {
  name: "AicyLink",
  url: "https://aicylink.com", // TODO: confirm production domain
  email: "hello@aicylink.com", // TODO: confirm contact email
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

export const categories: Category[] = [
  {
    id: "build",
    name: "Build",
    tagline: "Tools that help teams create and ship web products faster.",
    color: "var(--ice-1)",
    products: [],
  },
  {
    id: "grow",
    name: "Grow",
    tagline: "Business services that turn visitors into loyal customers.",
    color: "var(--ice-2)",
    products: [],
  },
  {
    id: "scale",
    name: "Scale",
    tagline: "Infrastructure and AI that keep everything fast and reliable.",
    color: "var(--ice-3)",
    products: [],
  },
];

export const companyLinks = [
  { label: "About AicyLink", text: "Who we are and how we build", href: "#company" },
  { label: "Clients & partners", text: "Grow with us from day one", href: "#partners" },
  { label: "Careers", text: "Join the team", href: "#careers" },
  { label: "Contact", text: "Investors, clients, press", href: "#contact" },
];

export const principles = [
  { label: "Product-first", text: "We build and run our own services end to end." },
  { label: "AI-native", text: "Intelligence designed in from day one." },
  { label: "Built to scale", text: "Modern infrastructure, ready for growth." },
  { label: "Global by default", text: "Made for customers everywhere." },
];

export const audiences = [
  {
    tag: "For investors",
    title: "Back a growing portfolio of products.",
    text: "One company, many products, one shared platform. Let's talk about building it together.",
    cta: { label: "Investor relations", href: "#contact" },
    color: "var(--ice-1)",
  },
  {
    tag: "For businesses",
    title: "Services built for your growth.",
    text: "Use our products or partner with us to bring a new web service to your customers.",
    cta: { label: "Talk to our team", href: "#contact" },
    color: "var(--ice-2)",
  },
  {
    tag: "For talent",
    title: "Build what's next with us.",
    text: "Work on products from zero to launch, with real ownership and modern tools.",
    cta: { label: "See careers", href: "#careers" },
    color: "var(--ice-3)",
  },
];

export type Partner = { name: string; logo: string; href?: string };

export const partners: Partner[] = [];

export type Role = { title: string; location: string; href: string };

export const roles: Role[] = [];
