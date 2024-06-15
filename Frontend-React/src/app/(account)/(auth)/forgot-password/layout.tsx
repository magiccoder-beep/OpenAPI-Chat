import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password – Pharmzing",
  description: "Pharmazing Forgot Password",
  keywords: ["pharmazing forgot password", "pharmazing"],
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

export default async function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
