import { LogoMark } from "@/components/logo";
import { Reveal } from "@/components/motion/reveal";
import { Button, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div className="page-grid absolute inset-0" aria-hidden />
      <div className="ice-glow absolute left-1/2 top-10 size-[520px] -translate-x-1/2 rounded-full" aria-hidden />
      <Container className="relative flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <Reveal from="scale">
          <LogoMark className="h-14 w-auto text-ink" sparkleClassName="sparkle-glow" />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-10 font-mono text-sm font-semibold text-ice-1">Error 404</p>
        </Reveal>
        <Reveal delay={0.2}>
          <h1 className="mt-3 text-5xl font-bold tracking-tighter sm:text-6xl">Lost in the cloud.</h1>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="mt-4 max-w-md text-lg text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        </Reveal>
        <Reveal delay={0.4} className="mt-10 flex gap-3">
          <Button href="/">Back to home</Button>
          <Button href="/contact" variant="secondary">
            Contact us
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
