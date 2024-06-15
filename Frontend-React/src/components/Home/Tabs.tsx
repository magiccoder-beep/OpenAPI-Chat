"use client";

import Image from "next/image";
import { useState } from "react";
import { Fade } from "react-awesome-reveal";

type Props = {};

const Tabs: React.FC<Props> = (props: Props) => {
  const [index, setIndex] = useState<number>(0);

  const items: string[] = [
    "board",
    "table",
    "timeline",
    "calender",
    "gallery",
    "list",
  ];
  return (<div></div>)
  return (
    <>
      <div className="relative flex flex-col justify-center items-center w-full mt-10 lg:mt-24">
        <div className="flex flex-col justify-center items-center mt-4 w-4/5 lg:w-[55%]">
          <h1 className="text-[#158c78] text-center text-2xl md:text-3xl lg:text-[44px] font-fontBold">
            Powerful building blocks
          </h1>
        </div>
        <div className="flex justify-start items-end mt-4 w-[80%] md:w-3/4 lg:w-[65%] -mb-1 md:-mb-2 xl:-mb-4 z-10">
          <div className="w-1/2">
            <Image
              src="/assets/img/icons/topPeek.png"
              width={442}
              height={300}
              alt="topPeek"
              className="w-1/2 lg:w-3/5"
            />
          </div>
        </div>
        <div className="relative bg-[#F6F5F4] mt-0 rounded-md md:rounded-lg lg:rounded-2xl w-[80%] md:w-3/4 lg:w-[65%] p-5 md:p-10">
          <div className="w-full">
            <Image
              src="/assets/img/icons/arrows.png"
              width={64}
              height={64}
              alt="arrows"
              className="w-6 md:w-8"
            />
          </div>
          <div className="mt-4">
            <h2 className="text-start text-xl font-fontBold text-[#534ba2]">
              Visualize, filter & sort any way you want
            </h2>
            <p className="text-start text-lg font-fontRegular w-full text-primary lg:w-2/3">
              Show only tasks assigned to you, or items marked as urgent. Break
              down any project in the way that’s most helpful to you.
            </p>
          </div>
          <div className="mt-8">
            <Fade
              key={index}
              triggerOnce={true}
              duration={600}
              delay={100}
              fraction={0.9}
            >
              <Image
                src={`/assets/img/banners/${items[index]}.png`}
                width={1920}
                height={1200}
                alt={items[index]}
                className="shadow-md rounded-lg"
              />
            </Fade>
          </div>
          <div className="flex justify-center items-center flex-wrap gap-4 lg:gap-x-2 mt-10">
            <button
              type="button"
              className={`border border-gray-300 px-1 md:px-3 rounded-md font-fontRegular text-sm md:text-base ${
                index === 0
                  ? "bg-gray-200 bg-opacity-70"
                  : "hover:bg-gray-200 hover:bg-opacity-50"
              }`}
              onClick={() => setIndex(0)}
            >
              Borad
            </button>
            <button
              type="button"
              className={`border border-gray-300 px-1 md:px-3 rounded-md font-fontRegular text-sm md:text-base ${
                index === 1
                  ? "bg-gray-200 bg-opacity-70"
                  : "hover:bg-gray-200 hover:bg-opacity-50"
              }`}
              onClick={() => setIndex(1)}
            >
              Table
            </button>
            <button
              type="button"
              className={`border border-gray-300 px-1 md:px-3 rounded-md font-fontRegular text-sm md:text-base ${
                index === 2
                  ? "bg-gray-200 bg-opacity-70"
                  : "hover:bg-gray-200 hover:bg-opacity-50"
              }`}
              onClick={() => setIndex(2)}
            >
              Timeline
            </button>
            <button
              type="button"
              className={`border border-gray-300 px-1 md:px-3 rounded-md font-fontRegular text-sm md:text-base ${
                index === 3
                  ? "bg-gray-200 bg-opacity-70"
                  : "hover:bg-gray-200 hover:bg-opacity-50"
              }`}
              onClick={() => setIndex(3)}
            >
              Calender
            </button>
            <button
              type="button"
              className={`border border-gray-300 px-1 md:px-3 rounded-md font-fontRegular text-sm md:text-base ${
                index === 4
                  ? "bg-gray-200 bg-opacity-70"
                  : "hover:bg-gray-200 hover:bg-opacity-50"
              }`}
              onClick={() => setIndex(4)}
            >
              Gallery
            </button>
            <button
              type="button"
              className={`border border-gray-300 px-1 md:px-3 rounded-md font-fontRegular text-sm md:text-base ${
                index === 5
                  ? "bg-gray-200 bg-opacity-70"
                  : "hover:bg-gray-200 hover:bg-opacity-50"
              }`}
              onClick={() => setIndex(5)}
            >
              List
            </button>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-start w-[80%] md:w-3/4 lg:w-[65%] mt-4 gap-y-4 lg:gap-y-0 gap-x-4">
          <div className="bg-[#F6F5F4] rounded-2xl">
            <div className="p-5 md:p-10">
              <div className="w-full">
                <Image
                  src="/assets/img/icons/eye.png"
                  width={30}
                  height={20}
                  alt="eye"
                  className="w-6 md:w-8"
                />
              </div>
              <div className="mt-4">
                <h2 className="text-start text-xl font-fontBold text-[#534ba2]">
                  Customize the info you track
                </h2>
                <p className="text-start text-lg font-fontRegular w-full text-primary">
                  Create your own labels, tags, owners, and more, so everyone
                  has context and everything stays organized.
                </p>
              </div>
            </div>
            <div className="flex justify-end items-end">
              <Image
                src="/assets/img/banners/tab-1.png"
                width={976}
                height={758}
                alt="tab-1"
                className="rounded-lg w-[90%]"
              />
            </div>
          </div>
          <div className="bg-[#F6F5F4] rounded-2xl">
            <div className="p-5 md:p-10">
              <div className="w-full">
                <Image
                  src="/assets/img/icons/art.png"
                  width={31}
                  height={27}
                  alt="art"
                  className="w-6 md:w-8"
                />
              </div>
              <div className="mt-4">
                <h2 className="text-start text-xl font-fontBold text-[#534ba2]">
                  Build any page, communicate any idea
                </h2>
                <p className="text-start text-lg font-fontRegular w-full text-primary">
                  Everything is drag and drop in Notion — images, toggles,
                  to-do’s, even embedded databases.
                </p>
              </div>
            </div>
            <div className="flex justify-end items-end">
              <Image
                src="/assets/img/banners/tab-2.png"
                width={976}
                height={758}
                alt="tab-2"
                className="rounded-lg w-[90%]"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center w-[80%] md:w-3/4 lg:w-[65%] mt-10">
          <h1 className="text-center text-[#158c78] font-fontRegular text-xl md:text-2xl w-[90%] lg:w-3/5">
            “Pharmazing adapts to your needs. It’s as <br /> minimal or as
            powerful as you need it to be.‶
          </h1>
          <div className="flex flex-col md:flex-row justify-center items-center mt-4 gap-x-3">
            <Image
              src="/assets/img/icons/rahim.png"
              width={66}
              height={75}
              alt="rahim"
              className="w-8"
            />
            <div className="flex flex-col justify-center items-center md:items-start">
              <h2 className="text-sm font-fontBold text-[#158c78]">
                Rahim Makani
              </h2>
              <p className="text-sm font-fontRegular text-secondary">
                Director of Product, Matchgroup
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tabs;
