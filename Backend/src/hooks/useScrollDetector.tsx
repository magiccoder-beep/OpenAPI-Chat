"use client";

import { useState, useEffect, MutableRefObject } from "react";

const useScrollDetector = (
  scrollRef: MutableRefObject<HTMLDivElement | null>
) => {
  const [scrollData, setScrollData] = useState<{
    isScrolling: boolean;
    scrollPosition: number;
  }>({
    isScrolling: false,
    scrollPosition: 0,
  });

  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const handleScroll = () => {
      if (scrollRef && scrollRef.current) {
        setScrollData((prev) => ({
          ...prev,
          isScrolling: true,
          scrollPosition:
            scrollRef && scrollRef.current
              ? scrollRef.current.scrollTop
              : prev.scrollPosition,
        }));
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }
        setScrollTimeout(
          setTimeout(() => {
            setScrollData((prev) => ({
              ...prev,
              isScrolling: false,
            }));
          }, 1000)
        );
      }
    };
    if (scrollRef && scrollRef.current) {
      scrollRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (scrollRef && scrollRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        scrollRef.current.removeEventListener("scroll", handleScroll);
      }
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [scrollRef, scrollTimeout]);

  return scrollData;
};

export default useScrollDetector;
