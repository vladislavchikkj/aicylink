import { Container, PageHero } from "./ui";

export type LegalSection = { title: string; body: string[] };

export function LegalPage({ title, updated, intro, sections }: { title: string; updated: string; intro: string; sections: LegalSection[] }) {
  return (
    <>
      <PageHero eyebrow={`Legal · Last updated ${updated}`} title={title} text={intro} />
      <section className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[220px_1fr]">
          <nav className="hidden lg:block">
            <ol className="sticky top-24 space-y-2 text-sm text-muted">
              {sections.map((s, i) => (
                <li key={s.title}>
                  <a href={`#section-${i + 1}`} className="transition-colors hover:text-foreground">
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="max-w-3xl space-y-12">
            {sections.map((s, i) => (
              <section key={s.title} id={`section-${i + 1}`} className="scroll-mt-24">
                <h2 className="text-xl font-bold tracking-tight">
                  {i + 1}. {s.title}
                </h2>
                {s.body.map((p) => (
                  <p key={p} className="mt-4 leading-relaxed text-muted">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
