"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const ImagesContext = createContext<{
  showImages: boolean;
  setShowImages: (arg: boolean) => void;
}>({ showImages: false, setShowImages: () => {} });

export const useImages = () =>
  useContext<{
    showImages: boolean;
    setShowImages: (arg: boolean) => void;
  }>(ImagesContext);

export const ImagesProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [showImages, setShowImages] = useState<boolean>(false);
  useEffect(() => setShowImages(false), [pathname]);

  return (
    <ImagesContext.Provider value={{ showImages, setShowImages }}>
      {children}
    </ImagesContext.Provider>
  );
};
