"use client";

import { useState, useEffect } from "react";

type DeviceType = "0" | "1" | "3";
// enum DeviceType {
//   Mobile = 0,
//   Tablet = 1,
//   Desktop = 3
// }
type OSType =
  | "Windows"
  | "macOS"
  | "Linux"
  | "ios"
  | "android"
  | "BlackBerry"
  | "unknown";

const useDeviceDetection = () => {
  const [device, setDevice] = useState<string>("");
  const [os, setOS] = useState<OSType>("unknown");
  const [country, setCountry] = useState<string>("");
  const [language, setLanguage] = useState<"de" | "en" | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const handleDeviceDetection = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile =
        /iphone|ipad|ipod|android|blackberry|windows phone/g.test(userAgent);
      const isTablet =
        /(ipad|tablet|playbook|silk)|(android(?!.*mobile))/g.test(userAgent);

      if (isMobile) {
        setDevice("0");
      } else if (isTablet) {
        setDevice("1");
      } else {
        setDevice("3");
      }

      const osRegexMap: Record<OSType, RegExp> = {
        Windows: /Windows/i,
        macOS: /Macintosh|Mac OS X/i,
        Linux: /Linux/i,
        ios: /iPhone|iPad|iPod/i,
        android: /Android/i,
        BlackBerry: /BlackBerry/i,
        unknown: /.*/,
      };
      
      let detectedOS: OSType = "unknown";
      for (const [osName, osRegex] of Object.entries(osRegexMap)) {
        if (osRegex.test(userAgent)) {
          detectedOS = osName as OSType;
          break;
        }
      }
      setOS(detectedOS);

      const deviceCountry: string = navigator.language;
      setCountry(deviceCountry);

      const deviceLanguage: string = navigator.language.split("-")[0];
      if (deviceLanguage === "de") {
        setLanguage("de");
      } else {
        setLanguage("en");
      }
    };

    handleDeviceDetection();
    window.addEventListener("resize", handleDeviceDetection);

    return () => {
      window.removeEventListener("resize", handleDeviceDetection);
    };
  }, []);

  return { device, os, country, language };
};

export default useDeviceDetection;
