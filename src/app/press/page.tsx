import type { Metadata } from "next";
import { ColorSwatch } from "@/components/color-swatch";
import { LogoMark } from "@/components/logo";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Container, PageHero, SectionHeading } from "@/components/ui";
import { brandColors, news, site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Press & brand",
  description: `News, logos and brand assets from ${site.name}.`,
  path: "/press",
});

const dateFormat = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long" });

const logos = [
  { label: "Logo — dark", file: "/logo-dark.svg", dark: false },
  { label: "Logo — light", file: "/logo-light.svg", dark: true },
];

export default function PressPage() {
  return (
    <>
      <PageHero
        eyebrow="Press & brand"
        title="News and brand resources."
        text={`The latest from ${site.name}, plus everything you need to write about us. For press inquiries contact ${site.pressEmail}.`}
      />

      {news.length > 0 && (
        <section className="py-20 sm:py-28">
          <Container>
            <SectionHeading eyebrow="Newsroom" title="Latest announcements." />
            <Stagger className="mt-12 border-t border-border" stagger={0.1}>
              {news.map((n) => (
                <StaggerItem key={n.title} from="left">
                  <div className="group grid gap-2 border-b border-border py-8 sm:grid-cols-[200px_1fr_auto] sm:items-center sm:gap-8">
                    <time dateTime={n.date} className="font-mono text-sm text-subtle">
                      {dateFormat.format(new Date(n.date))}
                    </time>
                    <h3 className="text-xl font-bold tracking-tight transition-colors group-hover:text-ice-1">{n.title}</h3>
                    <span className="font-mono text-xs uppercase tracking-widest text-subtle">{n.source}</span>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </section>
      )}

      <section className="border-t border-border bg-surface py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Brand kit"
            title="Logos and colors."
            text="Please use our logo as provided. Don't stretch, recolor or add effects to it."
          />
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2" stagger={0.12}>
            {logos.map((l) => (
              <StaggerItem key={l.file} from="scale">
                <div className="overflow-hidden rounded-2xl border border-border">
                  <div className={`flex h-56 items-center justify-center ${l.dark ? "bg-ink text-white" : "bg-white text-ink"}`}>
                    <LogoMark className="h-20 w-auto" />
                  </div>
                  <div className="flex items-center justify-between border-t border-border bg-white p-4">
                    <span className="text-sm font-semibold">{l.label}</span>
                    <a href={l.file} download className="text-sm font-semibold text-ice-1 hover:underline">
                      Download SVG ↓
                    </a>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Stagger className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5" stagger={0.06}>
            {brandColors.map((c) => (
              <StaggerItem key={c.value}>
                <ColorSwatch name={c.name} value={c.value} />
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-12">
            <p className="text-muted">
              Typeface: <span className="font-semibold text-foreground">Geist</span> and{" "}
              <span className="font-mono font-semibold text-foreground">Geist Mono</span>.
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
