"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  faArrowLeft,
  faArrowRight,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import Colors from "@/constants/colors";
import { useImageDimensions, useWindowSize } from "@/hooks";
import Image from "next/image";
import ImageMagnifier from "./ImageMagnifier";
import { useImages } from "@/context/imagesContext";

type Props = {
  index: number;
};

const PreviewImage: React.FC<Props> = ({ index }: Props) => {
  const aspectRatio = 1080 / 1920;
  const maxWidthPercent = 80;
  const maxHeightPercent = 80;
  const { imageWidth, imageHeight } = useImageDimensions(
    aspectRatio,
    maxWidthPercent,
    maxHeightPercent
  );
  const { height, isDesktop } = useWindowSize();
  const { showImages, setShowImages } = useImages();
  const imageDivRef = useRef<HTMLDivElement>(null);
  const [paddingTop, setPaddingTop] = useState<number>(0);
  const [paddingBottom, setPaddingBottom] = useState<number>(0);
  const [paddingRight, setPaddingRight] = useState<number>(0);
  const [images, setImages] = useState<{ src: string; caption?: string }[]>([]);
  const [elements, setElements] = useState<
    | {
        type: "image" | "cid";
        cid?: number;
        idx?: number;
      }[]
    | null
  >(null);
  const [elementIdx, setElementIdx] = useState<number>(0);
  const [isScroll, setIsScroll] = useState<boolean>(false);
  const [showText, setShowText] = useState<boolean>(false);
  const [showTextAnimation, setShowTextAnimation] = useState<boolean>(false);
  const [hideTextAnimation, setHideTextAnimation] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isMouseEnter, setIsMouseEnter] = useState<boolean>(false);
  const [textAnimDirection, setTextAnimDirection] = useState<
    "visible" | "hidden"
  >("hidden");
  const [textDuration, setTextDuration] = useState<{ duration: number }>({
    duration: 0.8,
  });
  const [divAnimDirection, setDivAnimDirection] = useState<
    "fadeIn" | "fadeOut"
  >("fadeOut");
  const [divDuration, setDivDuration] = useState<{ duration: number }>({
    duration: 0.8,
  });
  const [iconAnimDirection, setIconAnimDirection] = useState<
    "fadeIn" | "fadeOut"
  >("fadeOut");
  const [iconDuration, setIconDuration] = useState<{ duration: number }>({
    duration: 0.8,
  });

  useEffect(() => {
    if (!showImages) {
      return;
    }
    const initElements = (
      images: { src: string }[] | undefined,
      cid: number | undefined
    ):
      | {
          type: "image" | "cid";
          cid?: number;
          idx?: number;
        }[]
      | null => {
      let tempElements: {
        type: "image" | "cid";
        cid?: number;
        idx?: number;
      }[] = [];
      if (images && cid) {
        for (let i = 0; i < images.length; i++) {
          tempElements.push({ type: "image", idx: i });
        }
        if (cid > -1) {
          tempElements.push({ type: "cid", cid: cid });
        }
        return tempElements;
      }
      return null;
    };
    const imageData = sessionStorage.getItem("imageData");
    if (imageData) {
      const parse: {
        images: { src: string; caption?: string }[];
        cid: number;
      } = JSON.parse(imageData);
      setImages(parse.images);
      const el = initElements(parse.images, parse.cid);
      setElements(el);
      setDivDuration({ duration: 0.8 });
      setIconDuration({ duration: 0.8 });
      setTimeout(() => {
        setDivAnimDirection("fadeIn");
        setIconAnimDirection("fadeIn");
      }, 500);
      if (imageDivRef && imageDivRef.current) {
        const imageDivHeight: number = imageDivRef.current.clientHeight;
        const calc: number = isDesktop
          ? (height - imageDivHeight - 100) / 2
          : (height - imageDivHeight - 50) / 2;
        setPaddingTop(calc);
        setPaddingBottom(calc);
        setPaddingRight(imageWidth * 1.5);
      }
    } else {
      setShowImages(false);
    }
  }, [showImages, setShowImages]);

  const calcPaddingTop = useCallback(() => {
    if (imageDivRef && imageDivRef.current) {
      const imageDivHeight: number = imageDivRef.current.offsetHeight;
      const calc: number = isDesktop
        ? (height - imageDivHeight - 100) / 2
        : (height - imageDivHeight - 50) / 2;
      setPaddingTop(calc);
      setPaddingBottom(calc);
      setPaddingRight(imageWidth * 1.5);
    }
  }, [height, isDesktop]);

  const resetAnimation = () => {
    setTextDuration({ duration: 0 });
    setDivDuration({ duration: 0 });
    setIconDuration({ duration: 0 });
    setTextAnimDirection("hidden");
    setDivAnimDirection("fadeOut");
    setIconAnimDirection("fadeOut");
    setShowText(false);
    setShowTextAnimation(false);
    setHideTextAnimation(false);
    setIsScroll(false);
  };

  useEffect(() => {
    if (!showImages) {
      resetAnimation();
      setDivDuration({ duration: 0.5 });
      setDivAnimDirection("fadeOut");
      setTimeout(() => {
        resetAnimation();
        sessionStorage.removeItem("imageData");
        setElements(null);
        setElementIdx(0);
        setImages([]);
      }, 500);
    }else{
      calcPaddingTop();
    }
  }, [index, showImages, calcPaddingTop, elementIdx]);

  const textVariants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 30 },
  };

  const divVariants = {
    fadeOut: { opacity: 0 },
    fadeIn: { opacity: 1 },
  };

  const toggleTextAnimDirection = () => {
    setTextAnimDirection((prev) => (prev === "visible" ? "hidden" : "visible"));
  };

  const toggleText = () => {
    if (showTextAnimation || hideTextAnimation) {
      return;
    }
    setTextDuration({ duration: 0.8 });
    setTimeout(() => {
      toggleTextAnimDirection();
    }, 800);
    if (!showText) {

      setShowTextAnimation(true);
      setShowText(true);
      setTimeout(() => {
        setShowTextAnimation(false);
        setTimeout(() => setIsScroll(true), 100);
      }, 1000);
    } else {
      console.log("hiding");
      setHideTextAnimation(true);
      setTimeout(() => {
        setShowText(false);
        setHideTextAnimation(false);
        setIsScroll(false);
      }, 1000);
    }
  };

  const onMouseEnter = () => {
    // if (showText) {
    //   toggleText();
    // }
    setIconDuration({ duration: 0 });
    setIconAnimDirection("fadeOut");
    setIsMouseEnter(true);
  };

  const onMouseLeave = () => {
    setIconDuration({ duration: 500 });
    setIconAnimDirection("fadeIn");
    setIsMouseEnter(false);
  };

  const isChemicalCompound = (url: string): boolean => {
    return /\/inorganic\//.test(url) || /\/organic\//.test(url);
  };

  const goNext = () => {
    if (elements && elementIdx < elements.length - 1) {
      setElementIdx((prev) => prev + 1);
      resetAnimation();
      setTimeout(() => {
        setDivDuration({ duration: 0.8 });
        setDivAnimDirection("fadeIn");
        setIconDuration({ duration: 0.8 });
        setIconAnimDirection("fadeIn");
      }, 800);
    }
    
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  };

  const goBack = () => {
    if (elementIdx > 0) {
      resetAnimation();
      setElementIdx((prev) => prev - 1);
      setTimeout(() => {
        setDivDuration({ duration: 0.8 });
        setDivAnimDirection("fadeIn");
        setIconDuration({ duration: 0.8 });
        setIconAnimDirection("fadeIn");
      }, 800);
    }
  };

  const onClose = () => {
    setDivDuration({ duration: 0.5 });
    setDivAnimDirection("fadeOut");
    setTimeout(() => {
      resetAnimation();
      sessionStorage.removeItem("imageData");
      setElements(null);
      setElementIdx(0);
      setImages([]);
      setShowImages(false);
    }, 500);
  };

  return (
    <div
      className={`${
        showImages ? "block" : "hidden"
      } absolute inset-0 h-full w-full bg-transparent before:content-empty before:bg-white before:absolute before:h-full before:top-0 before:left-0 
      ${isMouseEnter ? 'before:w-[100%]' : 'before:w-[40%]'}`}
    >
      <div className="relative h-full w-full">
        {elementIdx > 0 && (
          <div className="absolute z-10 arrow-position left-arrow-position">
            <FontAwesomeIcon
              className="w-5 md:w-6 h-5 md:h-6 cursor-pointer rounded-full bg-white p-1 lg:p-2"
              icon={faArrowLeft}
              color={Colors.secondaryColor}
              onClick={goBack}
              style={{zIndex: 100}}
            />
          </div>
        )}
        {elements &&
          elements.length > 0 &&
          elementIdx < elements.length - 1 && (
            <div className="absolute z-10 arrow-position close-button-position">
              <FontAwesomeIcon
                className="w-5 md:w-6 h-5 md:h-6 cursor-pointer rounded-full bg-white p-1 lg:p-2"
                icon={faArrowRight}
                color={Colors.secondaryColor}
                onClick={goNext}
              />
            </div>
          )}
        {elements &&
          elements[elementIdx].type === "cid" &&
          elements[elementIdx].cid !== undefined && (
            <div className="absolute z-10 bottom-0 lg:bottom-0 left-0 lg:left-0 bg-white" style={{ display: isVisible ? 'block' : 'none', height: 150, width: 300 }}/>
        )}
        <div className="absolute z-10 right-5 lg:right-10 close-button-position">
          <FontAwesomeIcon
            className="w-5 md:w-6 h-5 md:h-6 cursor-pointer rounded-full bg-white p-1 lg:p-2"
            icon={faClose}
            color={Colors.secondaryColor}
            onClick={onClose}
          />
        </div>
        <div className="flex justify-center items-center w-full h-full overflow-hidden">
          <motion.div
            initial="fadeOut"
            animate={divAnimDirection}
            variants={divVariants}
            transition={divDuration}
            className="w-full h-full"
            onLoad={calcPaddingTop}
          >
            {elements && elements[elementIdx].type === "image" && images && (
              <div
                className={`flex flex-col justify-between items-center w-full h-[98%] transparent-scrollbar ${
                  isScroll && "overflow-y-scroll"
                }`}
                style={{ paddingTop, paddingBottom }}
              >
                <div
                  ref={imageDivRef}
                  className="flex flex-col relative w-[97%]"
                >
                  {isChemicalCompound(
                    images[elements[elementIdx]?.idx ?? 0].src
                  ) ? (
                    <div className="w-[40%]">
                      <Image
                        src={images[elements[elementIdx]?.idx ?? 0].src}
                        width={imageWidth * 1.5}
                        height={imageHeight * 1.5}
                        alt={`image${elementIdx}`}
                      />
                      <motion.p
                        initial="hidden"
                        animate={textAnimDirection}
                        variants={textVariants}
                        transition={textDuration}
                        className="flex justify-center items-center w-[31%]"
                        style={{marginLeft: "3.5%"}}
                      >
                        {images[elements[elementIdx]?.idx ?? 0].caption &&
                        showText ? (
                          <span
                            className={`mt-4 text-base font-MathJaxRegular text-left border-2 border-black px-2`}
                          >
                            {images[elements[elementIdx]?.idx ?? 0].caption}
                          </span>
                        ) : (
                          ""
                        )}
                      </motion.p>
                    </div>
                  ) : (
                    <>
                      <ImageMagnifier
                        src={images[elements[elementIdx]?.idx ?? 0].src}
                        width={imageWidth}
                        height={imageHeight}
                        alt={`image-${
                          images[elements[elementIdx]?.idx ?? 0].src
                        }`}
                        zoomLevel={2}
                        caption={
                          images[elements[elementIdx]?.idx ?? 0].caption ?? ""
                        }
                        showText={showText}
                        toggleText={toggleText}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        iconAnimDirection={iconAnimDirection}
                        iconDuration={iconDuration}
                        showTextAnimation={showTextAnimation}
                        hideTextAnimation={hideTextAnimation}
                      />
                      <motion.p
                        initial="hidden"
                        animate={textAnimDirection}
                        variants={textVariants}
                        transition={textDuration}
                        style={{marginLeft: "3.5%"}}
                        className="flex justify-center items-center w-[31%]"
                      >
                        {images[elements[elementIdx]?.idx ?? 0].caption &&
                        showText ? (
                          <span
                            className={`mt-4 text-base font-MathJaxRegular text-left border-2 border-black px-2`}
                          >
                            {images[elements[elementIdx]?.idx ?? 0].caption}
                          </span>
                        ) : (
                          ""
                        )}
                      </motion.p>
                    </>
                  )}
                </div>
              </div>
            )}
            {elements &&
              elements[elementIdx].type === "cid" &&
              elements[elementIdx].cid !== undefined && (
                <iframe
                  src={`https://embed.molview.org/v1/?cid=${
                    elements[elementIdx].cid ?? 0
                  }&bg=white`}
                  className="w-[40%] h-full"
                ></iframe>
              )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PreviewImage;
