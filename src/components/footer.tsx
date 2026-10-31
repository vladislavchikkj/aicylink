import Link from "next/link";
import { categories, companyLinks, site } from "@/content/site";
import { Logo } from "./logo";
import { Reveal } from "./motion/reveal";
import { Container } from "./ui";

export function Footer() {
  const columns = [
    { title: "Products", links: categories.map((c) => ({ label: c.name, href: "#products" })) },
    { title: "Company", links: companyLinks.map((l) => ({ label: l.label, href: l.href })) },
    {
      title: "Connect",
      links: [
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
        <Container className="flex flex-col gap-2 border-t border-border py-6 text-xs text-subtle sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="font-mono">Made with ✦ by the AicyLink team</p>
        </Container>
      </Reveal>
    </footer>
  );
}
