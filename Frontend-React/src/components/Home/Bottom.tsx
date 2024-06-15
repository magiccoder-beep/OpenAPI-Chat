"use client";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

type Props = {};

const Bottom: React.FC<Props> = (props: Props) => {
  return (<div></div>)
  return (
    <div className="flex flex-col justify-center items-center px-4 lg:px-12 pt-20 lg:pt-32">
      <div className="text-center">
        <h1 className="text-[#534ba2] mx-10 text-[40px] md:text-[50px] lg:text-[60px] font-fontBold">
          Get started for free
        </h1>
        <p className="text-primary text-xl lg:text-[26px] font-fontBold mt-6 lg:mt-0">
          Play around with it first. Pay and add your team later.
        </p>
      </div>
      <div className="mt-8 lg:mt-6">
        <div className="flex justify-center items-center gap-x-3">
          <Link href="/auth">
            <button
              type="button"
              className="cursor-pointer no-underline text-lg bg-secondary hover:bg-[#158c78] text-white ml-2 py-1 px-4 rounded-lg"
            >
              <span className="font-fontBold text-base">
                Try Pharmazing
              </span>
            </button>
          </Link>
          {/* <Link href="/auth">
            <button
              type="button"
              className="text-white bg-transparent hover:bg-blue-100 bg-opacity-50 rounded-md px-3 py-[6px]"
            >
              <span className="font-fontBold text-lg text-[#0081F2]">
                <span>Request a demo</span>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  size="sm"
                  color="#0081F2"
                  className="ml-2 -mb-[2px]"
                />
              </span>
            </button>
          </Link> */}
        </div>
      </div>
      <div className="w-3/4 md:w-2/3 lg:w-[40%] mt-8">
        <Image
          src="/assets/img/icons/parade.png"
          width={1340}
          height={660}
          alt="parade"
        />
      </div>
    </div>
  );
};

export default Bottom;
