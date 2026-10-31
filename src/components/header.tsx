import Link from "next/link";
import { categories, companyLinks } from "@/content/site";
import { Logo } from "./logo";
import { Container } from "./ui";

function Chevron() {
  return (
    <svg viewBox="0 0 12 12" className="size-3 transition-transform group-hover:rotate-180" aria-hidden>
      <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ProductsPanel() {
  return (
    <div className="grid grid-cols-3 gap-8">
      {categories.map((c) => (
        <div key={c.id}>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest" style={{ color: c.color }}>
            {c.name}
          </p>
          <p className="mt-2 text-sm text-muted">{c.tagline}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {c.products.length > 0 ? (
              c.products.map((p) => (
                <li key={p.name}>
                  <Link href={p.href ?? "#products"} className="font-medium hover:text-ice-1">
                    {p.name}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-subtle">Coming soon</li>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}

function CompanyPanel() {
  return (
    <ul className="grid grid-cols-2 gap-2">
      {companyLinks.map((l) => (
        <li key={l.href}>
          <Link href={l.href} className="block rounded-lg p-3 transition-colors hover:bg-surface">
            <span className="text-sm font-semibold">{l.label}</span>
            <span className="mt-0.5 block text-sm text-muted">{l.text}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function MegaMenu({ label, width, children }: { label: string; width: string; children: React.ReactNode }) {
  return (
    <div className="group relative">
      <button className="flex h-16 items-center gap-1 text-sm font-medium text-foreground/80 transition-colors group-hover:text-foreground">
        {label}
        <Chevron />
      </button>
      <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-1 opacity-0 transition-all duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <div className={`${width} rounded-xl border border-border bg-white p-6 shadow-[0_24px_60px_-20px_rgba(10,10,10,0.25)]`}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="#top" aria-label="AicyLink home">
          <Logo />
        </Link>

        <nav className="hidden flex-1 items-center gap-7 lg:flex">
          <MegaMenu label="Products" width="w-[720px]">
            <ProductsPanel />
          </MegaMenu>
          <MegaMenu label="Company" width="w-[520px]">
            <CompanyPanel />
          </MegaMenu>
          <Link href="#partners" className="text-sm font-medium text-foreground/80 hover:text-foreground">
            Partners
          </Link>
          <Link href="#careers" className="text-sm font-medium text-foreground/80 hover:text-foreground">
            Careers
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="#contact"
            className="hidden rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ink/80 sm:inline-flex"
          >
            Contact us
          </Link>

          <details className="group/menu lg:hidden">
            <summary className="flex size-10 cursor-pointer list-none items-center justify-center rounded-lg border border-border [&::-webkit-details-marker]:hidden">
              <span className="sr-only">Menu</span>
              <svg viewBox="0 0 20 20" className="size-5" aria-hidden>
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </summary>
            <div className="absolute inset-x-0 top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-border bg-white px-4 py-6 shadow-lg">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-subtle">Products</p>
              <ul className="mt-3 space-y-3">
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link href="#products" className="font-semibold">
                      {c.name}
                    </Link>
                    <p className="text-sm text-muted">{c.tagline}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-8 font-mono text-xs font-semibold uppercase tracking-widest text-subtle">Company</p>
              <ul className="mt-3 space-y-3">
                {companyLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="font-semibold">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="#contact"
                className="mt-8 flex h-11 items-center justify-center rounded-lg bg-ink text-sm font-semibold text-white"
              >
                Contact us
              </Link>
            </div>
          </details>
        </div>
      </Container>
    </header>
  );
}
