import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password – Pharmzing",
  description: "Pharmazing Reset Password",
  keywords: ["pharmazing reset password", "pharmazing"],
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

export default async function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
