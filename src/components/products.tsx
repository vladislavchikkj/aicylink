import Link from "next/link";
import { categories, type Product } from "@/content/site";
import { Stagger, StaggerItem } from "./motion/reveal";
import { Container, SectionHeading } from "./ui";

const statusLabel: Record<Product["status"], string> = {
  live: "Live",
  beta: "Beta",
  soon: "Coming soon",
};

function ProductRow({ product }: { product: Product }) {
  return (
    <li>
      <Link
        href={product.href ?? "#contact"}
        className="flex items-start justify-between gap-4 rounded-lg p-3 transition-colors hover:bg-surface"
      >
        <span>
          <span className="font-semibold">{product.name}</span>
          <span className="mt-0.5 block text-sm text-muted">{product.description}</span>
        </span>
        <span className="shrink-0 rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase text-subtle">
          {statusLabel[product.status]}
        </span>
      </Link>
    </li>
  );
}

export function Products() {
  return (
    <section id="products" className="scroll-mt-16 bg-surface py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Products"
          title="One platform. A growing family of products."
          text="We design, build and run our own web services. Each one solves a real problem — and they all work better together."
        />

        <Stagger className="mt-12 grid gap-6 lg:grid-cols-3" style={{ perspective: 1200 }} stagger={0.15}>
          {categories.map((c) => (
            <StaggerItem
              key={c.id}
              from="tilt"
              className="flex flex-col rounded-2xl border border-border bg-white p-6 transition-shadow duration-500 hover:shadow-[0_30px_60px_-30px_rgba(14,165,233,0.45)]"
              style={{ borderTop: `3px solid ${c.color}` }}
            >
              <p className="font-mono text-xs font-semibold uppercase tracking-widest" style={{ color: c.color }}>
                {c.name}
              </p>
              <p className="mt-3 text-lg font-semibold tracking-tight text-balance">{c.tagline}</p>

              {c.products.length > 0 ? (
                <ul className="-mx-3 mt-6 space-y-1">
                  {c.products.map((p) => (
                    <ProductRow key={p.name} product={p} />
                  ))}
                </ul>
              ) : (
                <div className="mt-6 flex flex-1 flex-col justify-end rounded-xl border border-dashed border-border p-5">
                  <p className="font-mono text-xs uppercase tracking-widest text-subtle">In development</p>
                  <p className="mt-2 text-sm text-muted">First {c.name.toLowerCase()} products are on the way.</p>
                  <Link href="#contact" className="mt-4 text-sm font-semibold hover:text-ice-1">
                    Get early access →
                  </Link>
                </div>
              )}
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
