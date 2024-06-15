"use client";

import Image from "next/image";
import Link from "next/link";
import { Fade } from "react-awesome-reveal";
import { useParallax } from "react-scroll-parallax";
import Lottie from "lottie-react";
import animation from "@/assets/animations/bigLoading.json";

type Props = {};

const Hero: React.FC<Props> = (props: Props) => {
  const leftParallax = useParallax<HTMLDivElement>({
    translateX: [-10, 0],
    rotate: [30, -40],
    translateY: [0, -10],
  });

  const rightParallax = useParallax<HTMLDivElement>({
    translateX: [-10, 0],
    rotate: [-15, 15],
    translateY: [0, -100],
  });

  return (
    <div className="relative flex flex-col justify-center items-center px-4 lg:px-12 pt-20 lg:pt-32 pb-20">
      <div className="text-center z-10">
        <h1 className="text-[#534ba2] mx-10 text-[40px] md:text-[50px] lg:text-[60px] font-fontBold flex justify-center items-center flex-wrap lg:flex-nowrap space-y-0 space-x-2 lg:space-x-4 leading-[45px] lg:leading-relaxed">
          <Fade direction="up" duration={600} triggerOnce={true}>
            pharmazing
          </Fade>
          <Fade direction="up" duration={800} triggerOnce={true}>
            App
          </Fade>
        </h1>
        <Fade direction="up" duration={800} delay={500} triggerOnce={true}>
          <p className="text-primary text-[24px] lg:text-[26px] font-fontBold mt-6 lg:mt-0">
          #1 AI App für Medizin u. Pharmazie
          </p>
        </Fade>
      </div>
      <div className="mt-8 lg:mt-6 z-10">
        <Fade direction="up" duration={800} delay={600} triggerOnce={true}>
          <div className="flex justify-center items-center gap-x-3">
            <Link href="/auth">
              <button
                type="button"
                className="text-white bg-secondary hover:bg-[#158c78] rounded-md px-3 py-[6px]"
              >
                <span className="font-fontBold text-base">Anfangen</span>
              </button>
            </Link>
          </div>
        </Fade>
      </div>
      <div className="relative w-[56%] mt-9 hidden xl:block z-10">
        <Fade direction="up" duration={800} delay={600} triggerOnce={true}>
          <div className="w-[800px]">
            <Image
              src="/assets/img/banners/screen.gif"
              width={800}
              height={450}
              alt="screen"
              className="shadow-2xl rounded-3xl"
            />
            <div className="w-64 fixed top-[12vh] left-[43vw]">
              <Image
                src="/assets/img/banners/phone.png"
                width={271}
                height={469}
                alt="screen"
              />
            </div>
          </div>
        </Fade>
      </div>
      <div
        ref={leftParallax.ref}
        className="w-1/4 md:w-1/6 opacity-50 absolute -bottom-[50%] xl:bottom-[22%] -left-[1%]"
      >
        <Lottie animationData={animation} loop={true} autoPlay={true} />
      </div>
      <div
        ref={rightParallax.ref}
        className="w-1/2 md:w-1/4 opacity-50 absolute top-[80%] xl:top-[30%] -right-[8%] md:-right-[5%]"
      >
        <Lottie animationData={animation} loop={true} autoPlay={true} />
      </div>
    </div>
  );
};

export default Hero;
