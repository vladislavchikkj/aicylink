import Link from "next/link";
import { categories, companyLinks, legalLinks, site } from "@/content/site";
import { Logo } from "./logo";
import { Reveal } from "./motion/reveal";
import { Container } from "./ui";

export function Footer() {
  const columns = [
    {
      title: "Products",
      links: categories.flatMap((c) => c.products).map((p) => ({ label: p.name, href: p.href ?? "/#products" })),
    },
    { title: "Company", links: companyLinks.map((l) => ({ label: l.label, href: l.href })) },
    {
      title: "Connect",
      links: [
        { label: "Contact us", href: "/contact" },
        { label: "LinkedIn", href: site.linkedin },
        { label: site.email, href: `mailto:${site.email}` },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-surface">
      <Reveal duration={0.8}>
        <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted">{site.description}</p>
            {/* DEMO status — link to a real status page once one exists */}
            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative size-2 rounded-full bg-emerald-500" />
              </span>
              All systems operational
            </span>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-subtle">{col.title}</p>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-foreground/80 transition-colors hover:text-foreground">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Container>
        <Container className="flex flex-col gap-3 border-t border-border py-6 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved. · {site.location}
          </p>
          <div className="flex flex-wrap gap-5">
            {legalLinks.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-foreground">
                {l.label}
              </Link>
            ))}
          </div>
        </Container>
      </Reveal>
    </footer>
  );
}
