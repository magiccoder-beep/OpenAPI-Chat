import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile – Pharmzing",
  description: "Pharmazing Profile",
  keywords: ["pharmazing profile", "pharmazing"],
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

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
