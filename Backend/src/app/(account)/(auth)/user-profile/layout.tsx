import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Setup – Pharmzing",
  description: "Pharmazing Profile Setup",
  keywords: ["pharmazing profile setup", "pharmazing profile", "pharmazing"],
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

export default async function ProfileSetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
