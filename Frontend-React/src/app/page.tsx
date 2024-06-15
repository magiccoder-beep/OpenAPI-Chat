"use client";

import { NextPage } from "next";
import { useLayoutEffect, useRef, useState } from "react";
import { ParallaxProvider } from "react-scroll-parallax";
import { useScrollDetector } from "@/hooks";
import {
  Bottom,
  Clients,
  Footer,
  Header,
  Hero,
  Features,
  Scores,
  Slider,
  Tabs,
} from "@/components";

type Props = {};

const Home: NextPage<Props> = (props: Props) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number | string>("100vh");
  const [marginTop, setMarginTop] = useState<number>(0);

  const { scrollPosition } = useScrollDetector(divRef);

  useLayoutEffect(() => {
    if (navbarRef.current) {
      setMarginTop(navbarRef.current.clientHeight);
    }
  }, []);

  useLayoutEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const handleResize = () => {
      setHeight((prev) =>
        marginTop > window.innerHeight ? prev : window.innerHeight - marginTop
      );
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [marginTop]);

  return (
    <ParallaxProvider>
      <div
        ref={divRef}
        className="overflow-y-auto overflow-x-hidden bg-[#ffffff]"
        style={{ height, marginTop }}
      >
        <Header ref={navbarRef} scrollPosition={scrollPosition} />
        <Hero />
        <Slider />
        <Clients />
        <Tabs />
        <Features />
        <Scores />
        <Bottom />
        <Footer />
      </div>
    </ParallaxProvider>
  );
};

export default Home;
