"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

type Props = {};

const Scores: React.FC<Props> = (props: Props) => {
  return (<div></div>)
  return (
    <>
      <div className="flex justify-center items-center w-full mt-24">
        <div className="flex flex-col justify-center items-center mt-4 w-4/5 lg:w-[70%]">
          <h1 className="text-[#158c78] text-center text-3xl md:text-4xl lg:text-[44px] font-fontBold w-2/3">
            Join a global movement. Unleash your creativity.
          </h1>
          <p className="text-secondary text-center font-fontRegular text-lg w-full lg:w-3/4 mt-4 leading-6">
            Our vibrant community produces content, teaches courses, and leads
            events all over the world.
          </p>
          <span className="mt-4 font-fontRegular cursor-pointer text-primary hover:text-[#534ba2] hover:border-b-[#534ba2] hover:border-b-[1.2px] leading-3">
            <span className="font-fontRegular text-lg">Lesrn more</span>
            <FontAwesomeIcon
              icon={faArrowRight}
              size="xs"
              color="#0081F2"
              className="ml-2 -mb-[2px]"
            />
          </span>
          <div className="mt-8">
            <Image
              src="/assets/img/icons/faces.png"
              alt="faces"
              width={2050}
              height={320}
            />
          </div>
          <div className="flex flex-col lg:flex-row justify-center items-center w-full gap-y-3 lg:gap-x-8">
            <div className="p-6 flex flex-col justify-center items-start bg-[#F6F5F4] rounded-2xl h-36 w-full lg:w-1/3">
              <h1 className="font-fontBold text-secondary text-[30px] md:text-[40px] lg:text-[60px]">
                1M+
              </h1>
              <p className="font-fontRegular text-sm lg:text-base text-primary">community members</p>
            </div>
            <div className="p-6 flex flex-col justify-center items-start bg-[#F6F5F4] rounded-2xl h-36 w-full lg:w-1/3">
              <h1 className="font-fontBold text-secondary text-[30px] md:text-[40px] lg:text-[60px]">
                150+
              </h1>
              <p className="font-fontRegular text-sm lg:text-base text-primary">community groups</p>
            </div>
            <div className="p-6 flex flex-col justify-center items-start bg-[#F6F5F4] rounded-2xl h-36 w-full lg:w-1/3">
              <h1 className="font-fontBold text-secondary text-[30px] md:text-[40px] lg:text-[60px]">
                50+
              </h1>
              <p className="font-fontRegular text-sm lg:text-base text-primary">
                countries represented
              </p>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row justify-between items-start w-full mt-4 gap-y-4 lg:gap-y-0 gap-x-4">
            <div className="bg-[#F6F5F4] rounded-2xl w-full lg:w-1/2">
              <div className="p-5 md:p-10">
                <div className="mt-4">
                  <h2 className="text-start text-xl font-fontBold text-[#534ba2]">
                    An always-on support network
                  </h2>
                  <p className="text-start text-lg font-fontRegular w-full text-primary">
                    Swap setups and share tips in over 149 online communities.
                  </p>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <Image
                  src="/assets/img/icons/community-icons.png"
                  width={568}
                  height={546}
                  alt="community-icons.png"
                  className="rounded-lg w-[50%]"
                />
              </div>
            </div>
            <div className="bg-[#F6F5F4] rounded-2xl w-full lg:w-1/2">
              <div className="p-5 md:p-10">
                <div className="mt-4">
                  <h2 className="text-start text-xl font-fontBold text-[#534ba2]">
                    Choose your language
                  </h2>
                  <p className="text-start text-lg font-fontRegular w-full text-primary">
                    Pharmazing currently supports English, Korean, Japanese,
                    French, German, Spanish, and Portuguese. With more to come!
                  </p>
                </div>
              </div>
              <div className="flex justify-end items-end">
                <Image
                  src="/assets/img/icons/welcome.png"
                  width={934}
                  height={472}
                  alt="welcome.png"
                  className="rounded-lg w-[90%]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Scores;
