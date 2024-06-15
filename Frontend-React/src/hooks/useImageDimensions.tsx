"use client";

import { useState, useEffect } from "react";

const useImageDimensions = (
  aspectRatio: number,
  maxWidthPercent: number,
  maxHeightPercent: number
) => {
  const [imageWidth, setImageWidth] = useState<number>(0);
  const [imageHeight, setImageHeight] = useState<number>(0);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const handleResize = () => {
      const screenWidth: number = window.innerWidth;
      const screenHeight: number = window.innerHeight;

      const maxWidth: number = screenWidth * (maxWidthPercent / 100);
      const maxHeight: number = screenHeight * (maxHeightPercent / 100);

      let calculatedImageWidth: number = maxWidth;
      let calculatedImageHeight: number = calculatedImageWidth / aspectRatio;

      if (calculatedImageHeight > maxHeight) {
        calculatedImageHeight = maxHeight;
        calculatedImageWidth = calculatedImageHeight * aspectRatio;
      }

      setImageWidth(calculatedImageWidth);
      setImageHeight(calculatedImageHeight);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [aspectRatio, maxWidthPercent, maxHeightPercent]);

  return { imageWidth, imageHeight };
};

export default useImageDimensions;
