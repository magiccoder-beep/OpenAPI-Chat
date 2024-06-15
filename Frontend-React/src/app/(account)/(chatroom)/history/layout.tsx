import type { Metadata } from "next";
import { HistoryProvider } from "@/providers";

export const metadata: Metadata = {
  title: "History – Pharmzing",
  description: "Pharmazing History",
  keywords: ["pharmazing history", "pharmazing"],
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

export default async function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <HistoryProvider>{children}</HistoryProvider>;
}
