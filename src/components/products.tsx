import Link from "next/link";
import { categories, type Product } from "@/content/site";
import { Stagger, StaggerItem } from "./motion/reveal";
import { Spotlight } from "./motion/spotlight";
import { ProductShowcase } from "./showcase";
import { Container, SectionHeading } from "./ui";

const statusStyle: Record<Product["status"], { label: string; className: string }> = {
  live: { label: "Live", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  beta: { label: "Beta", className: "border-sky-200 bg-sky-50 text-sky-700" },
  soon: { label: "Soon", className: "border-border bg-surface text-subtle" },
};

function ProductRow({ product }: { product: Product }) {
  const status = statusStyle[product.status];
  return (
    <li>
      <Link
        href={product.href ?? "/contact?topic=product"}
        className="group/row flex items-start justify-between gap-4 rounded-lg p-3 transition-colors hover:bg-surface"
      >
        <span>
          <span className="font-semibold">
            {product.name}
            <span className="ml-1 inline-block opacity-0 transition-all group-hover/row:translate-x-1 group-hover/row:opacity-100">
              →
            </span>
          </span>
          <span className="mt-0.5 block text-sm text-muted">{product.description}</span>
        </span>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase ${status.className}`}>
          {status.label}
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
            <StaggerItem key={c.id} from="tilt">
              <Spotlight className="flex h-full flex-col rounded-2xl border border-border bg-white p-6 transition-shadow duration-500 hover:shadow-[0_30px_60px_-30px_rgba(14,165,233,0.45)]">
                <div className="absolute inset-x-6 top-0 h-0.5 rounded-full" style={{ background: c.color }} aria-hidden />
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
                    <Link href="/contact?topic=product" className="mt-4 text-sm font-semibold hover:text-ice-1">
                      Get early access →
                    </Link>
                  </div>
                )}
              </Spotlight>
            </StaggerItem>
          ))}
        </Stagger>

        <ProductShowcase />
      </Container>
    </section>
  );
}
