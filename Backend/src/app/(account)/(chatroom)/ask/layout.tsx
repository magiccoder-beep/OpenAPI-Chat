import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ask Questions – Pharmzing",
  description: "Pharmazing Ask Questions",
  keywords: ["pharmazing ask questions", "pharmazing"],
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

export default async function AskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
