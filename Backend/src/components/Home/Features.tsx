"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {};

const Features: React.FC<Props> = (props: Props) => {
  const [index, setIndex] = useState<number>(0);

  const items: string[] = [
    "engineering",
    "design",
    "product",
    "marketing",
    "operations",
    "hr",
  ];
  return (<div></div>)
  return (
    <>
      <div className="flex flex-col justify-center items-center w-full mt-10 lg:mt-24">
        <div className="flex flex-col justify-center items-center mt-4 w-4/5 lg:w-[55%]">
          <h1 className="text-[#534ba2] text-center text-2xl md:text-4xl lg:text-[48px] font-fontBold">
            Every team, side-by-side
          </h1>
        </div>
        <div className="w-[80%] md:w-3/4 lg:w-[65%] mt-6 lg:mt-10">
          <div className="hidden xl:flex justify-center items-center flex-wrap gap-4 lg:gap-x-2">
            <button
              type="button"
              className={`flex flex-col justify-center items-center border border-gray-300 p-1 md:px-9 md:py-2 rounded-xl ${
                index === 0 ? "bg-white" : "bg-gray-200 bg-opacity-70"
              }`}
              onClick={() => setIndex(0)}
            >
              <Image
                src="/assets/img/icons/engineering.png"
                width={140}
                height={140}
                alt="engineering"
                className="w-20"
              />
              <p className="font-fontBold text-sm md:text-base text-secondary">Engineering</p>
            </button>
            <button
              type="button"
              className={`flex flex-col justify-center items-center border border-gray-300 p-1 md:px-9 md:py-2 rounded-xl ${
                index === 1 ? "bg-white" : "bg-gray-200 bg-opacity-70"
              }`}
              onClick={() => setIndex(1)}
            >
              <Image
                src="/assets/img/icons/design.png"
                width={140}
                height={140}
                alt="design"
                className="w-20"
              />
              <p className="font-fontBold text-sm md:text-base text-secondary">Design</p>
            </button>
            <button
              type="button"
              className={`flex flex-col justify-center items-center border border-gray-300 p-1 md:px-9 md:py-2 rounded-xl ${
                index === 2 ? "bg-white" : "bg-gray-200 bg-opacity-70"
              }`}
              onClick={() => setIndex(2)}
            >
              <Image
                src="/assets/img/icons/product.png"
                width={140}
                height={140}
                alt="product"
                className="w-20"
              />
              <p className="font-fontBold text-sm md:text-base text-secondary">Product</p>
            </button>
            <button
              type="button"
              className={`flex flex-col justify-center items-center border border-gray-300 p-1 md:px-9 md:py-2 rounded-xl ${
                index === 3 ? "bg-white" : "bg-gray-200 bg-opacity-70"
              }`}
              onClick={() => setIndex(3)}
            >
              <Image
                src="/assets/img/icons/marketing.png"
                width={140}
                height={140}
                alt="marketing"
                className="w-20"
              />
              <p className="font-fontBold text-sm md:text-base text-secondary">Marketing</p>
            </button>
            <button
              type="button"
              className={`flex flex-col justify-center items-center border border-gray-300 p-1 md:px-9 md:py-2 rounded-xl ${
                index === 4 ? "bg-white" : "bg-gray-200 bg-opacity-70"
              }`}
              onClick={() => setIndex(4)}
            >
              <Image
                src="/assets/img/icons/operations.png"
                width={140}
                height={140}
                alt="operations"
                className="w-20"
              />
              <p className="font-fontBold text-sm md:text-base text-secondary">Operations</p>
            </button>
            <button
              type="button"
              className={`flex flex-col justify-center items-center border border-gray-300 p-1 md:px-9 md:py-2 rounded-xl ${
                index === 5 ? "bg-white" : "bg-gray-200 bg-opacity-70"
              }`}
              onClick={() => setIndex(5)}
            >
              <Image
                src="/assets/img/icons/hr.png"
                width={140}
                height={140}
                alt="hr"
                className="w-20"
              />
              <p className="font-fontBold text-sm md:text-base text-secondary">Hr</p>
            </button>
          </div>
          <div className="flex xl:hidden justify-center items-center flex-wrap gap-2 lg:gap-x-2 mt-10">
            <button
              type="button"
              className={`border border-gray-300 px-1 md:px-3 rounded-md font-fontRegular text-sm md:text-base text-secondary ${
                index === 0
                  ? "bg-gray-200 bg-opacity-70"
                  : "hover:bg-gray-200 hover:bg-opacity-50"
              }`}
              onClick={() => setIndex(0)}
            >
              Engineering
            </button>
            <button
              type="button"
              className={`border border-gray-300 px-1 md:px-3 rounded-md font-fontRegular text-sm md:text-base text-secondary ${
                index === 1
                  ? "bg-gray-200 bg-opacity-70"
                  : "hover:bg-gray-200 hover:bg-opacity-50"
              }`}
              onClick={() => setIndex(1)}
            >
              Design
            </button>
            <button
              type="button"
              className={`border border-gray-300 px-1 md:px-3 rounded-md font-fontRegular text-sm md:text-base text-secondary ${
                index === 2
                  ? "bg-gray-200 bg-opacity-70"
                  : "hover:bg-gray-200 hover:bg-opacity-50"
              }`}
              onClick={() => setIndex(2)}
            >
              Product
            </button>
            <button
              type="button"
              className={`border border-gray-300 px-1 md:px-3 rounded-md font-fontRegular text-sm md:text-base text-secondary ${
                index === 3
                  ? "bg-gray-200 bg-opacity-70"
                  : "hover:bg-gray-200 hover:bg-opacity-50"
              }`}
              onClick={() => setIndex(3)}
            >
              Marketing
            </button>
            <button
              type="button"
              className={`border border-gray-300 px-1 md:px-3 rounded-md font-fontRegular text-sm md:text-base text-secondary ${
                index === 4
                  ? "bg-gray-200 bg-opacity-70"
                  : "hover:bg-gray-200 hover:bg-opacity-50"
              }`}
              onClick={() => setIndex(4)}
            >
              Operations
            </button>
            <button
              type="button"
              className={`border border-gray-300 px-1 md:px-3 rounded-md font-fontRegular text-sm md:text-base text-secondary ${
                index === 5
                  ? "bg-gray-200 bg-opacity-70"
                  : "hover:bg-gray-200 hover:bg-opacity-50"
              }`}
              onClick={() => setIndex(5)}
            >
              HR
            </button>
          </div>
          <div className="mt-8">
            <Image
              src={`/assets/img/banners/${items[index]}.png`}
              width={1920}
              height={1200}
              alt={items[index]}
              className="shadow-xl rounded-lg"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Features;
