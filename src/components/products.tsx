import Link from "next/link";
import { appHref } from "@/content/apps";
import { categories, type Product } from "@/content/site";
import { AppIcon } from "./app-icon";
import { StatusBadge } from "./status-badge";
import { Stagger, StaggerItem } from "./motion/reveal";
import { Spotlight } from "./motion/spotlight";
import { ProductShowcase } from "./showcase";
import { Container, SectionHeading } from "./ui";

function ProductRow({ product }: { product: Product }) {
  return (
    <li>
      <Link
        href={appHref(product.id)}
        className="group/row flex items-start gap-3.5 rounded-lg p-3 transition-colors hover:bg-surface"
      >
        <AppIcon id={product.id} className="size-11 transition-transform duration-300 group-hover/row:-rotate-6 group-hover/row:scale-105" />
        <span className="min-w-0 flex-1">
          <span className="font-semibold">
            {product.name}
            <span className="ml-1 inline-block opacity-0 transition-all group-hover/row:translate-x-1 group-hover/row:opacity-100">
              →
            </span>
          </span>
          <span className="mt-0.5 block text-sm text-muted">{product.description}</span>
        </span>
        <StatusBadge status={product.status} />
      </Link>
    </li>
  );
}

export function Products() {
  return (
    <section id="products" className="section-y scroll-mt-16 bg-surface">
      <Container>
        <SectionHeading
          index="01"
          eyebrow="Products"
          title="A growing family of AI apps."
          text="We design, build and run every app ourselves. Each one solves one everyday problem — simply and beautifully."
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
                  <ul className="-mx-3 mt-6 space-y-1 md:grid md:grid-cols-2 md:gap-x-2 md:space-y-0 lg:block lg:space-y-1">
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
