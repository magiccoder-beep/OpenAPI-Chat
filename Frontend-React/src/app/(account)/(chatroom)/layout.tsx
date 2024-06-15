import { ChatProvider } from "@/providers";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatProvider>{children}</ChatProvider>;
}
