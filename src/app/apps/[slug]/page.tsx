import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppIcon, appTheme } from "@/components/app-icon";
import { AppScreen, LummieWindow, Phone } from "@/components/app-screens";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Spotlight } from "@/components/motion/spotlight";
import { StatusBadge } from "@/components/status-badge";
import { Button, Container, SectionHeading } from "@/components/ui";
import { WaitlistForm } from "@/components/waitlist-form";
import { allApps, appHref, findApp } from "@/content/apps";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allApps.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const app = findApp((await params).slug);
  if (!app) return {};
  return pageMetadata({ title: `${app.name}: ${app.seoTitle}`, description: app.intro, path: `/apps/${app.slug}` });
}

export default async function AppPage({ params }: Props) {
  const app = findApp((await params).slug);
  if (!app) notFound();

  const live = Boolean(app.href);
  const others = allApps.filter((a) => a.id !== app.id);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: app.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section className="relative overflow-hidden border-b border-border">
        <div className="page-grid absolute inset-0" aria-hidden />
        <div
          className="absolute -right-40 -top-40 size-[560px] rounded-full opacity-25 blur-[120px]"
          style={{ background: appTheme[app.id].accent }}
          aria-hidden
        />
        <Container className={`relative grid items-center gap-12 py-16 sm:py-24 ${live ? "" : "lg:grid-cols-[1.2fr_1fr]"}`}>
          <div className={live ? "mx-auto max-w-3xl text-center" : ""}>
            <Reveal>
              <nav className={`flex items-center gap-2 text-sm text-muted ${live ? "justify-center" : ""}`} aria-label="Breadcrumb">
                <Link href="/#products" className="hover:text-foreground">
                  Products
                </Link>
                <span>/</span>
                <span className="text-foreground">{app.name}</span>
              </nav>
            </Reveal>
            <Reveal delay={0.1} className={`mt-8 flex items-center gap-4 ${live ? "justify-center" : ""}`}>
              <AppIcon id={app.id} className="size-16" />
              <div className="text-left">
                <p className="text-xl font-bold tracking-tight">{app.name}</p>
                <StatusBadge status={app.status} className="mt-1" />
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <h1 className="mt-8 text-4xl font-bold tracking-tighter text-balance sm:text-6xl">{app.headline}</h1>
            </Reveal>
            <Reveal delay={0.3}>
              <p className={`mt-6 max-w-xl text-lg text-muted text-pretty ${live ? "mx-auto" : ""}`}>{app.intro}</p>
            </Reveal>
            <Reveal delay={0.4} className={`mt-10 ${live ? "flex justify-center" : ""}`}>
              {live ? (
                <Button href={app.href!}>Open {app.name} ↗</Button>
              ) : (
                <WaitlistForm app={app.id} appName={app.name} />
              )}
            </Reveal>
          </div>

          {app.id !== "lummie" ? (
            <Reveal from="right" delay={0.2}>
              <div className="relative">
                <div
                  className="absolute inset-x-10 bottom-0 top-16 rounded-full opacity-30 blur-3xl"
                  style={{ background: appTheme[app.id].accent }}
                  aria-hidden
                />
                <Phone>
                  <AppScreen id={app.id} />
                </Phone>
              </div>
            </Reveal>
          ) : (
            <Reveal delay={0.3} duration={1.2}>
              <LummieWindow />
            </Reveal>
          )}
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Features" title={`What ${app.name} does.`} />
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
            {app.features.map((f, i) => (
              <StaggerItem key={f.title}>
                <Spotlight className="h-full rounded-2xl border border-border p-7">
                  <span
                    className="flex size-9 items-center justify-center rounded-lg font-mono text-xs font-bold text-white"
                    style={{ background: appTheme[app.id].accent }}
                  >
                    0{i + 1}
                  </span>
                  <h3 className="mt-6 text-lg font-bold tracking-tight">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted">{f.text}</p>
                </Spotlight>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="border-y border-border bg-surface py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="How it works" title="Three simple steps." />
            <ol className="mt-10 space-y-6">
              {app.steps.map((s, i) => (
                <Reveal key={s} from="left" delay={i * 0.1}>
                  <li className="flex items-start gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="pt-1 text-lg">{s}</span>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
          <div>
            <SectionHeading eyebrow="FAQ" title="Questions & answers." />
            <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-white">
              {app.faq.map((f) => (
                <details key={f.q} className="group p-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="text-xl text-subtle transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {!live && (
        <section className="py-20 sm:py-28">
          <Container>
            <Reveal className="relative overflow-hidden rounded-3xl bg-ink px-6 py-14 text-white sm:px-14">
              <div
                className="absolute -left-20 -top-24 size-[420px] rounded-full opacity-40 blur-[110px]"
                style={{ background: appTheme[app.id].accent }}
                aria-hidden
              />
              <div className="relative grid items-center gap-8 lg:grid-cols-2">
                <div className="flex items-center gap-5">
                  <AppIcon id={app.id} className="size-20" />
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Be first to try {app.name}.</h2>
                    <p className="mt-2 text-white/60">Early access opens to the waitlist first.</p>
                  </div>
                </div>
                <WaitlistForm app={app.id} appName={app.name} dark />
              </div>
            </Reveal>
          </Container>
        </section>
      )}

      <section className={`pb-20 sm:pb-28 ${live ? "pt-20 sm:pt-28" : ""}`}>
        <Container>
          <SectionHeading eyebrow={`More from ${site.name}`} title="Explore other apps." />
          <Stagger className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7" stagger={0.06}>
            {others.map((o) => (
              <StaggerItem key={o.id} from="scale">
                <Link
                  href={appHref(o.id)}
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-border p-5 text-center transition-colors hover:bg-surface"
                >
                  <AppIcon id={o.id} className="size-14 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105" />
                  <span className="text-sm font-semibold">{o.name}</span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>
    </>
  );
}
