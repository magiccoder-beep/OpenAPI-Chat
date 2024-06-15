"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

type Props = {};

const Clients: React.FC<Props> = (props: Props) => {
  const allClients: {
    img: string;
    with: number;
    height: number;
    alt: string;
  }[] = [
    {
      img: "/assets/img/clients/figma.png",
      with: 730,
      height: 228,
      alt: "figma",
    },
    {
      img: "/assets/img/clients/pixar.png",
      with: 668,
      height: 176,
      alt: "pixar",
    },
    {
      img: "/assets/img/clients/doordash.png",
      with: 777,
      height: 176,
      alt: "doordash",
    },
    {
      img: "/assets/img/clients/nike.png",
      with: 444,
      height: 232,
      alt: "nike",
    },
    {
      img: "/assets/img/clients/amazon.png",
      with: 828,
      height: 324,
      alt: "amazon",
    },
    {
      img: "/assets/img/clients/pinterest_logo.png",
      with: 532,
      height: 131,
      alt: "pinterest_logo",
    },
    {
      img: "/assets/img/clients/General_Electric_logo.png",
      with: 248,
      height: 282,
      alt: "General_Electric_logo",
    },
    {
      img: "/assets/img/clients/uber.png",
      with: 339,
      height: 166,
      alt: "uber",
    },
    {
      img: "/assets/img/clients/plaid.png",
      with: 339,
      height: 166,
      alt: "plaid",
    },
    {
      img: "/assets/img/clients/toyota.png",
      with: 837,
      height: 268,
      alt: "toyota",
    },
    {
      img: "/assets/img/clients/snowflake_logo.png",
      with: 562,
      height: 136,
      alt: "snowflake_logo",
    },
    {
      img: "/assets/img/clients/headspace_logo.png",
      with: 530,
      height: 115,
      alt: "headspace_logo",
    },
    {
      img: "/assets/img/clients/angel-list.png",
      with: 229,
      height: 60,
      alt: "angel-list",
    },
    {
      img: "/assets/img/clients/robinhood.png",
      with: 928,
      height: 182,
      alt: "robinhood",
    },
  ];
  return (<div></div>)
  return (
    <>
      <div className="flex justify-center items-center w-full mt-24">
        <div className="flex flex-col justify-center items-center mt-4 w-4/5 lg:w-[55%]">
          <h1 className="text-[#158c78] text-center text-3xl md:text-4xl lg:text-[44px] font-fontBold">
            Millions run on Pharmazing every day
          </h1>
          <p className="text-secondary text-center font-fontRegular text-lg w-full lg:w-3/5 mt-4 leading-6">
            Powering the world’s best teams, from next-generation startups to
            established enterprises.
          </p>
          <span className="font-fontRegular cursor-pointer text-primary hover:text-[#534ba2] hover:border-b-[#534ba2] hover:border-b-[1.2px] leading-3">
            <span className="font-fontRegular text-lg">
              Read customer stories
            </span>
            <FontAwesomeIcon
              icon={faArrowRight}
              size="xs"
              color="#6056BF"
              className="ml-2 -mb-[2px]"
            />
          </span>
          <div className="mt-8 flex justify-center items-center flex-wrap gap-3 md:gap-6 lg:gap-9">
            {allClients.map(
              (
                c: {
                  img: string;
                  with: number;
                  height: number;
                  alt: string;
                },
                i: number
              ) => (
                <div
                  key={i}
                  className={`${
                    c.alt === "General_Electric_logo"
                      ? "w-[29px] md:w-[58px]"
                      : c.alt === "uber" ||
                        c.alt === "nike" ||
                        c.alt === "amazon"
                      ? "w-[38px] md:w-[76px]"
                      : "w-[53px] md:w-[106px]"
                  }`}
                >
                  <Image
                    src={c.img}
                    width={c.with}
                    height={c.height}
                    alt={c.alt}
                  />
                </div>
              )
            )}
          </div>
          <div
            className="hidden lg:flex mt-28 flex-col justify-center items-center bg-cover bg-no-repeat bg-center h-64 w-[90%]"
            style={{ backgroundImage: 'url("/assets/img/icons/tools.png")' }}
          >
            <h1 className="text-[#534ba2] text-center font-fontBold text-3xl md:text-4xl lg:text-[44px] w-1/2 mb-20">
              Consolidate tools. Cut costs.
            </h1>
          </div>
          <div className="mt-16 flex lg:hidden flex-col justify-center items-center w-[90%]">
            <h1 className="text-[#534ba2] text-center font-fontBold text-3xl md:text-4xl lg:text-[44px] w-full lg:w-1/2">
              Consolidate tools. Cut costs.
            </h1>
          </div>
          <div className="flex flex-col justify-center items-center mt-14 lg:mt-20">
            <h1 className="text-secondary text-center font-fontRegular text-xl md:text-2xl w-[90%] lg:w-3/5">
              “We got rid of nearly a dozen different tools because of what
              Notion does for us.‶
            </h1>
            <div className="flex flex-col md:flex-row justify-center items-center mt-4 gap-x-3">
              <Image
                src="/assets/img/icons/metalab.png"
                width={128}
                height={35}
                alt="metalab"
                className="w-32"
              />
              <div className="flex flex-col justify-center items-center md:items-start">
                <h2 className="text-sm font-fontBold text-[#534ba2]">
                  Justin Watt
                </h2>
                <p className="text-sm font-fontRegular text-primary">
                  Director of Ops & Marketing, MetaLab
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Clients;
