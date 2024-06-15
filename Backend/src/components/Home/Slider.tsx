"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide, SwiperRef, SwiperClass } from "swiper/react";
import { Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBook,
  faCalculator,
  faAngleLeft,
  faAngleRight,
  faComments,
  faCube,
} from "@fortawesome/free-solid-svg-icons";
import { Fade } from "react-awesome-reveal";

type Props = {};

const Slider: React.FC<Props> = (props: Props) => {
  const swiperRef = useRef<SwiperRef>(null);
  const [index, setIndex] = useState(0);
  const [isBeginning, setIsBeginning] = useState<boolean>(false);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [showPrev, setShowPrev] = useState<boolean>(false);
  const [showNext, setShowNext] = useState<boolean>(false);

  const onSlideChange = () => {
    if (swiperRef && swiperRef.current) {
      setShowPrev(!swiperRef.current.swiper.isBeginning);
      setIsBeginning(swiperRef.current.swiper.isBeginning);
      setShowNext(!swiperRef.current.swiper.isEnd);
      setIsEnd(swiperRef.current.swiper.isEnd);
    }
  };

  const goToNextSlide = () => {
    if (swiperRef && swiperRef.current) {
      swiperRef.current.swiper.slideNext();
      onSlideChange();
      setIndex((prev) => (prev + 1 < 4 ? prev + 1 : 0));
    }
  };

  const goToPrevSlide = () => {
    if (swiperRef && swiperRef.current) {
      swiperRef.current.swiper.slidePrev();
      onSlideChange();
      setIndex((prev) => (prev > 0 ? prev - 1 : 3));
    }
  };

  const caption: string[] = [
    "Ask anything. Pharmazing will answer.",
    "Simple, powerful, beautiful. Next-gen notes & docs.",
    "Centralize your knowledge. No more hunting for answers.",
    "Connected and flexible, to tackle any project.",
    "Manage your time and projects, together.",
  ];

  const slides: string[] = ["4.jpg", "5.jpg", "6.jpg", "8.jpg"];

  return (<div></div>)
  return (
    <>
      <Fade direction="up" duration={800} delay={600} triggerOnce={true}>
        <div className="text-center mt-4 lg:mt-20 lg:mx-0">
          <h1 className="text-[#158c78] text-3xl md:text-4xl lg:text-[44px] font-fontRegular">
            “Your AI everything app.‶
          </h1>
          <p className="text-2xl font-fontBold text-secondary">Forbes</p>
        </div>
      </Fade>
      <div className="mt-16 lg:mt-36 flex justify-center items-center gap-x-10">
        <div
          className={`hidden lg:flex flex-col gap-y-1 justify-center items-center cursor-pointer ${
            index === 0
              ? "opacity-100 grayscale-0"
              : "opacity-50 hover:opacity-100 grayscale hover:grayscale-0"
          }`}
          onClick={() => {
            if (swiperRef && swiperRef.current) {
              swiperRef.current.swiper.slideTo(0);
              setIndex(0);
              onSlideChange();
            }
          }}
        >
          <FontAwesomeIcon icon={faCube} color="brown" size="lg" />
          <h1 className="font-fontBold text-2xl">3D</h1>
        </div>
        <div
          className={`hidden lg:flex flex-col gap-y-1 justify-center items-center cursor-pointer ${
            index === 1
              ? "opacity-100 grayscale-0"
              : "opacity-50 hover:opacity-100 grayscale hover:grayscale-0"
          }`}
          onClick={() => {
            if (swiperRef && swiperRef.current) {
              swiperRef.current.swiper.slideTo(1);
              setIndex(1);
              onSlideChange();
            }
          }}
        >
          <FontAwesomeIcon icon={faCalculator} color="gold" size="lg" />
          <h1 className="font-fontBold text-2xl">Calculation</h1>
        </div>
        <div
          className={`hidden lg:flex flex-col gap-y-1 justify-center items-center cursor-pointer ${
            index === 2
              ? "opacity-100 grayscale-0"
              : "opacity-50 hover:opacity-100 grayscale hover:grayscale-0"
          }`}
          onClick={() => {
            if (swiperRef && swiperRef.current) {
              swiperRef.current.swiper.slideTo(2);
              setIndex(2);
              onSlideChange();
            }
          }}
        >
          <FontAwesomeIcon icon={faComments} color="purple" size="lg" />
          <h1 className="font-fontBold text-2xl">Feedback</h1>
        </div>
        <div
          className={`hidden lg:flex flex-col gap-y-1 justify-center items-center cursor-pointer ${
            index === 3
              ? "opacity-100 grayscale-0"
              : "opacity-50 hover:opacity-100 grayscale hover:grayscale-0"
          }`}
          onClick={() => {
            if (swiperRef && swiperRef.current) {
              swiperRef.current.swiper.slideTo(3);
              setIndex(3);
              onSlideChange();
            }
          }}
        >
          <FontAwesomeIcon icon={faBook} color="teal" size="lg" />
          <h1 className="font-fontBold text-2xl">Exercises</h1>
        </div>
        <div className="flex lg:hidden justify-center items-center gap-x-2">
          {index === 0 ? (
            <>
              <h1 className="font-fontBold text-2xl">3D</h1>
              <FontAwesomeIcon icon={faCube} color="brown" size="lg" />
            </>
          ) : index === 1 ? (
            <>
              <h1 className="font-fontBold text-2xl">Calculation</h1>
              <FontAwesomeIcon icon={faCalculator} color="gold" size="lg" />
            </>
          ) : index === 2 ? (
            <>
              <h1 className="font-fontBold text-2xl">Feedback</h1>
              <FontAwesomeIcon icon={faComments} color="purple" size="lg" />
            </>
          ) : index === 3 ? (
            <>
              <h1 className="font-fontBold text-2xl">Exercies</h1>
              <FontAwesomeIcon icon={faBook} color="teal" size="lg" />
            </>
          ) : (
            ""
          )}
        </div>
      </div>
      <h1 className="text-secondary font-fontRegular text-lg text-center mt-6 mb-4 flex flex-col lg:flex-row gap-y-6 lg:gap-y-0 justify-center items-center">
        <span>{caption[index]} </span>
        <span className="ml-2 cursor-pointer text-primary hover:text-[#534ba2] hover:border-b-[#534ba2] hover:border-b-[1.2px] leading-3">
          <span className="font-fontRegular text-lg">Learn more</span>
          <FontAwesomeIcon
            icon={faArrowRight}
            size="xs"
            color="#6056BF"
            className="ml-2 -mb-[2px]"
          />
        </span>
      </h1>
      <div className="flex justify-center items-center w-full">
        <div className="relative bg-black bg-opacity-30 shadow-2xl mt-4 rounded-xl w-4/5 lg:w-[55%]">
          <Swiper
            ref={swiperRef}
            loop={true}
            spaceBetween={0}
            slidesPerView={1}
            effect="fade"
            navigation
            modules={[EffectFade, Navigation]}
            onInit={(swiper: SwiperClass) => {
              if (swiperRef && swiperRef.current) {
                setShowPrev(!swiperRef.current.swiper.isBeginning);
                setIsBeginning(swiperRef.current.swiper.isBeginning);
                setShowNext(!swiperRef.current.swiper.isEnd);
                setIsEnd(swiperRef.current.swiper.isEnd);
                setIndex(0);
              }
            }}
          >
            {slides.map((s: string, i: number) => (
              <SwiperSlide key={i}>
                <div className=" w-full py-4 flex justify-center items-center rounded-xl bg-transparent">
                  <div className="w-64">
                    <Image
                      src={`/assets/img/banners/${s}`}
                      width={1179}
                      height={2556}
                      alt="1"
                      className="rounded-lg"
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="absolute top-0 left-0 z-10 bg-transparent w-full h-full">
            <div className="relative w-full h-full">
              <div className="absolute left-0 w-1/2 h-full">
                <div
                  className="relative w-full h-full"
                  onMouseEnter={() => {
                    if (isBeginning) {
                      setShowPrev(true);
                    }
                  }}
                  onMouseLeave={() => {
                    if (isBeginning) {
                      setShowPrev(false);
                    }
                  }}
                >
                  {showPrev && (
                    <div
                      className="cursor-pointer absolute z-10 top-1/2 left-2 lg:left-5 w-6 lg:w-8 h-6 lg:h-8 rounded-full bg-white flex justify-center items-center"
                      onClick={goToPrevSlide}
                    >
                      <FontAwesomeIcon
                        icon={faAngleLeft}
                        size="lg"
                        className="w-2 lg:w-3"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute right-0 w-1/2 h-full">
                <div
                  className="relative w-full h-full"
                  onMouseEnter={() => {
                    if (isEnd) {
                      setShowNext(true);
                    }
                  }}
                  onMouseLeave={() => {
                    if (isEnd) {
                      setShowNext(false);
                    }
                  }}
                >
                  {showNext && (
                    <div
                      className="cursor-pointer absolute z-10 top-1/2 right-2 lg:right-5 w-6 lg:w-8 h-6 lg:h-8 rounded-full bg-white flex justify-center items-center"
                      onClick={goToNextSlide}
                    >
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        size="lg"
                        className="w-2 lg:w-3"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Slider;
