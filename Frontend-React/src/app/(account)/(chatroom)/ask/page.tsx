"use client";

import { NextPage } from "next";
import { ChatArea } from "@/components";

type Props = {};

const Ask: NextPage<Props> = (props: Props) => {
  return <ChatArea isHistory={false} />;
};

export default Ask;
