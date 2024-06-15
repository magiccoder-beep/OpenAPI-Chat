import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify – Pharmzing",
  description: "Pharmazing Verify",
  keywords: ["pharmazing verify", "pharmazing"],
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

export default async function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
