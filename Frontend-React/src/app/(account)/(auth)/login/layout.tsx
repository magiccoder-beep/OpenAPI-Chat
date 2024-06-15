import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login – Pharmzing",
  description: "Pharmazing Login",
  keywords: ["pharmazing login", "pharmazing"],
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

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
