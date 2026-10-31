import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description: `The terms that govern your use of the ${site.name} website.`,
  path: "/legal/terms",
});

// DEMO: template text — have it reviewed by a lawyer before launch.
export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="October 31, 2026"
      intro={`These terms govern your use of the ${site.name} website. By accessing the site you agree to them.`}
      sections={[
        {
          title: "About these terms",
          body: [
            `This website is operated by ${site.legalName}. Individual ${site.name} products may be subject to their own terms, which take precedence for those products.`,
          ],
        },
        {
          title: "Use of the website",
          body: [
            "You may use this website for lawful purposes only. You must not attempt to disrupt, damage or gain unauthorized access to the website or related systems.",
          ],
        },
        {
          title: "Intellectual property",
          body: [
            `All content on this website, including the ${site.name} name, logo, text and graphics, is owned by or licensed to ${site.legalName}. Brand assets may be used as described on our Press page.`,
          ],
        },
        {
          title: "Disclaimer",
          body: [
            'The website is provided "as is". While we work to keep information accurate and up to date, we make no warranties about its completeness or availability.',
          ],
        },
        {
          title: "Limitation of liability",
          body: [
            `To the fullest extent permitted by law, ${site.legalName} is not liable for any indirect or consequential loss arising from your use of the website.`,
          ],
        },
        {
          title: "Changes and contact",
          body: [`We may update these terms at any time. Questions? Contact us at ${site.email}.`],
        },
      ]}
    />
  );
}
