"use client";

import { usePathname } from "next/navigation";
import { ChatSidebar } from "@/components";
import { useWindowSize } from "@/hooks";

type Props = {
  children: React.ReactNode;
};

const HistoryProvider: React.FC<Props> = ({ children }: Props) => {
  const pathname = usePathname();
  const { isDesktop } = useWindowSize();

  if (!isDesktop && pathname === "/history") {
    return <ChatSidebar />;
  }

  if (!isDesktop && pathname === "/history/chat") {
    return children;
  }

  return (
    <>
      <ChatSidebar />
      {children}
    </>
  );
};

export default HistoryProvider;
