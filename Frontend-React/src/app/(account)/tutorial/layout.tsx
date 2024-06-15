import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tutorial – Pharmzing",
  description: "Pharmazing Tutorial",
  keywords: ["pharmazing tutorial", "pharmazing"],
  creator: "pharmazing.ai",
  publisher: "pharmazing.ai",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://pharmazing.ai",
  },
};

export default async function TutorialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
