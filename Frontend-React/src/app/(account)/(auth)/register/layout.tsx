import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register – Pharmzing",
  description: "Pharmazing Register",
  keywords: ["pharmazing register", "pharmazing"],
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

export default async function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
