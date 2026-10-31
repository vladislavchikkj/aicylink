import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses and protects personal data.`,
  path: "/legal/privacy",
});

// DEMO: template text — have it reviewed by a lawyer before launch.
export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="October 31, 2026"
      intro={`This policy explains how ${site.legalName} collects, uses and protects personal data when you visit our website or use our services.`}
      sections={[
        {
          title: "Who we are",
          body: [
            `${site.legalName} ("${site.name}", "we", "us") is the controller of personal data processed through this website. You can reach us at ${site.email}.`,
          ],
        },
        {
          title: "Data we collect",
          body: [
            "Information you provide, such as your name, email address, company and the content of messages you send us.",
            "If you join a waitlist, your email address, the app you signed up for and an approximate country. We use it only to tell you about early access to that app, and you can unsubscribe at any time.",
            "Technical data collected automatically, such as IP address, browser type, device information and pages visited, collected through essential and — with your consent — analytics cookies.",
          ],
        },
        {
          title: "How we use your data",
          body: [
            "To respond to inquiries, provide and improve our services, ensure security, and comply with legal obligations.",
            "We process data on the basis of your consent, our legitimate interests, or where necessary to enter into or perform a contract with you.",
          ],
        },
        {
          title: "Cookies",
          body: [
            "We use essential cookies required for the site to function. Analytics cookies are only set if you accept them in the cookie banner. You can change your choice at any time by clearing your browser storage.",
          ],
        },
        {
          title: "Sharing and transfers",
          body: [
            "We do not sell personal data. We share data only with trusted service providers (such as hosting and communication tools) who process it on our behalf under appropriate safeguards.",
          ],
        },
        {
          title: "Retention",
          body: ["We keep personal data only as long as necessary for the purposes described above or as required by law."],
        },
        {
          title: "Your rights",
          body: [
            `Depending on your location, you may have the right to access, correct, delete or restrict processing of your data, object to processing, and data portability. To exercise these rights, contact ${site.email}.`,
          ],
        },
        {
          title: "Changes",
          body: ["We may update this policy from time to time. The latest version will always be available on this page."],
        },
      ]}
    />
  );
}
