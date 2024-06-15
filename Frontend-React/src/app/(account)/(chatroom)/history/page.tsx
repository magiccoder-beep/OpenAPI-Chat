"use client";

import { NextPage } from "next";
import { ChatArea } from "@/components";
type Props = {};

const History: NextPage<Props> = (props: Props) => {
  return <ChatArea isHistory={true} />;
};

export default History;
