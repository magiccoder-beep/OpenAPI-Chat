"use client";

import { NextPage } from "next";
import { ChatArea } from "@/components";
import { useWindowSize } from "@/hooks";

type Props = {};

const Chat: NextPage<Props> = (props: Props) => {
  const { isDesktop } = useWindowSize();

  if (isDesktop) {
    return;
  }

  return <ChatArea isHistory={true} />;
};

export default Chat;
