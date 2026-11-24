import type { Metadata } from "next";
import { Lightbox } from "@/components/lightbox";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Our certificates" };

const CERTIFICATES = [
  { src: "/image/companyreg.jpg", alt: "Company registration", title: "Company registration" },
  { src: "/image/foriegnemp.jpg", alt: "Foreign employment licence", title: "Foreign employment licence" },
  { src: "/image/pan.jpg", alt: "PAN registration", title: "PAN registration" },
];

export default function OurCertificatesPage() {
  return (
    <div>
      <PageHeader title="Our certificates" eyebrow="Who we are">
        Fully licensed and registered with the Government of Nepal.
      </PageHeader>
      <section className="container py-20">
        <Lightbox items={CERTIFICATES} variant="certificates" />
      </section>
    </div>
  );
}
