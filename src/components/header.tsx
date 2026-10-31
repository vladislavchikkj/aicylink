"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { appHref } from "@/content/apps";
import { categories, companyLinks, nav } from "@/content/site";
import { AppIcon } from "./app-icon";
import { Logo } from "./logo";
import { StatusBadge } from "./status-badge";
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
          <ul className="-mx-2 mt-4 space-y-1 text-sm">
            {c.products.length > 0 ? (
              c.products.map((p) => (
                <li key={p.name}>
                  <Link href={appHref(p.id)} className="flex items-start gap-3 rounded-md p-2 transition-colors hover:bg-surface">
                    <AppIcon id={p.id} className="size-9" />
                    <span>
                      <span className="flex items-center gap-1.5">
                        <span className="font-semibold">{p.name}</span>
                        {p.status !== "early" && <StatusBadge status={p.status} className="scale-90" />}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted">{p.description}</span>
                    </span>
                  </Link>
                </li>
              ))
            ) : (
              <li className="px-2 text-subtle">Coming soon</li>
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

// "start" lines the panel up with the page container instead of centering it on the button.
function MegaMenu({
  label,
  width,
  align = "center",
  children,
}: {
  label: string;
  width: string;
  align?: "center" | "start";
  children: React.ReactNode;
}) {
  return (
    <div className="group relative">
      <button className="flex h-16 items-center gap-1 text-sm font-medium text-foreground/80 transition-colors group-hover:text-foreground">
        {label}
        <Chevron />
      </button>
      <div className={`invisible absolute top-full pt-1 opacity-0 ${align === "start" ? "-left-[116px]" : "left-1/2 -translate-x-1/2"} transition-all duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100`}>
        <div className={`${width} rounded-xl border border-border bg-white p-6 shadow-[0_24px_60px_-20px_rgba(10,10,10,0.25)]`}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" aria-label="AicyLink home">
          <Logo />
        </Link>

        <nav className="hidden flex-1 items-center gap-7 lg:flex">
          <MegaMenu label="Products" width="w-[880px]" align="start">
            <ProductsPanel />
          </MegaMenu>
          <MegaMenu label="Company" width="w-[520px]">
            <CompanyPanel />
          </MegaMenu>
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-foreground/80 hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ink/80 sm:inline-flex"
          >
            Contact us
          </Link>

          {/* Re-mounted on navigation so the menu closes after a link is followed */}
          <details key={pathname} className="lg:hidden">
            <summary className="flex size-10 cursor-pointer list-none items-center justify-center rounded-lg border border-border [&::-webkit-details-marker]:hidden">
              <span className="sr-only">Menu</span>
              <svg viewBox="0 0 20 20" className="size-5" aria-hidden>
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </summary>
            <div className="absolute inset-x-0 top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-border bg-white px-4 py-6 shadow-lg">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-subtle">Products</p>
              <ul className="mt-4 grid grid-cols-4 gap-x-2 gap-y-4">
                {categories
                  .flatMap((c) => c.products)
                  .map((p) => (
                    <li key={p.id}>
                      <Link href={appHref(p.id)} className="flex flex-col items-center gap-1.5 text-center">
                        <AppIcon id={p.id} className="size-12" />
                        <span className="text-[11px] font-medium leading-tight">{p.name}</span>
                      </Link>
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
                href="/contact"
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
