"use client";

import Image from "next/image";
import Link from "next/link";
import { forwardRef, useState } from "react";
import { Slide } from "react-awesome-reveal";
import {
  // faAngleDown,
  // faAngleRight,
  // faAngleUp,
  faBars,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = { scrollPosition: number };

const Header: React.ForwardRefRenderFunction<HTMLDivElement, Props> = (
  { scrollPosition }: Props,
  ref
) => {
  // const [showProducts, setShowProducts] = useState<boolean>(false);
  // const [showDownloads, setShowDownloads] = useState<boolean>(false);
  // const [showSolutions, setShowSolutions] = useState<boolean>(false);
  // const [showResources, setShowResources] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  // const products: {
  //   main: {
  //     title: string;
  //     description: string;
  //     img: string;
  //     width: number;
  //     height: number;
  //   }[];
  //   subMenu: {
  //     title: string;
  //     description: string;
  //   }[];
  // } = {
  //   main: [
  //     {
  //       title: "AI",
  //       description: "Integrated AI Assistant",
  //       img: "/assets/img/icons/ai.png",
  //       width: 24,
  //       height: 23,
  //     },
  //     {
  //       title: "Docs",
  //       description: "Simple & powerful",
  //       img: "/assets/img/icons/docs.png",
  //       width: 49,
  //       height: 49,
  //     },
  //     {
  //       title: "Wkikis",
  //       description: "Centralize your knowledge",
  //       img: "/assets/img/icons/wikis.png",
  //       width: 48,
  //       height: 48,
  //     },
  //     {
  //       title: "Projects",
  //       description: "Connected, flexible workflows",
  //       img: "/assets/img/icons/projects.png",
  //       width: 49,
  //       height: 49,
  //     },
  //     {
  //       title: "Calendar",
  //       description: "Time and work, together",
  //       img: "/assets/img/icons/calender.png",
  //       width: 48,
  //       height: 48,
  //     },
  //   ],
  //   subMenu: [
  //     { title: "Template Gallery", description: "Steps to get you started" },
  //     { title: "Customer Stories", description: "See how team use Pharmazing" },
  //     { title: "Connections", description: "Connect your tools to Pharmazing" },
  //   ],
  // };

  // const downloads: {
  //   title: string;
  //   url: string;
  // }[] = [
  //   { title: "Pharmazing", url: "" },
  //   { title: "Calendar", url: "" },
  //   { title: "Web Clipper", url: "" },
  // ];

  // const solutions: {
  //   main: {
  //     title: string;
  //     description: string;
  //     img: string;
  //     width: number;
  //     height: number;
  //   }[];
  //   subMenu1: {
  //     title: string;
  //   }[];
  //   subMenu2: {
  //     title: string;
  //   }[];
  // } = {
  //   main: [
  //     {
  //       title: "Enterprise",
  //       description: "Advance features for your org",
  //       img: "/assets/img/icons/enterprise.png",
  //       width: 80,
  //       height: 80,
  //     },
  //     {
  //       title: "Small Business",
  //       description: "Run your team on one tool",
  //       img: "/assets/img/icons/small-business.png",
  //       width: 80,
  //       height: 80,
  //     },
  //     {
  //       title: "Personal",
  //       description: "Free for individuals",
  //       img: "/assets/img/icons/personal.png",
  //       width: 80,
  //       height: 80,
  //     },
  //   ],
  //   subMenu1: [
  //     { title: "Design" },
  //     { title: "Engineering" },
  //     { title: "Product" },
  //     { title: "Managers" },
  //   ],
  //   subMenu2: [
  //     { title: "Startups" },
  //     { title: "Remote Work" },
  //     { title: "Education" },
  //     { title: "Nonprofits" },
  //   ],
  // };

  // const resources: {
  //   title: string;
  //   url: string;
  // }[] = [
  //   { title: "Blog", url: "" },
  //   { title: "Pharmazing Acadmey", url: "" },
  //   { title: "Guides & tutorials", url: "" },
  //   { title: "Webinars", url: "" },
  //   { title: "Help Center", url: "" },
  //   { title: "API Docs", url: "" },
  //   { title: "Community", url: "" },
  //   { title: "Hire a consultant", url: "" },
  //   { title: "Become a partner", url: "" },
  // ];

  return (
    <>
      <div
        ref={ref}
        className="fixed z-40 top-0 left-0 right-0 bg-white px-4 lg:px-2 xl:px-4"
      >
        <div
          className={`flex justify-between items-center w-full py-3 ${
            (scrollPosition > 100 || showMenu) && "border-b-2 border-b-gray-200"
          }`}
        >
          <Slide direction="down" triggerOnce={true}>
            <div className="flex justify-center items-center gap-x-1 lg:gap-x-[2px] xl:gap-x-1">
              <div className="w-4 md:w-6 lg:w-8">
                <Link
                  href="https://www.pharmazing.de"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/assets/img/pharmazingRound.png"
                    width={1300}
                    height={1300}
                    alt="pharmazing"
                    className="rounded-full"
                  />
                </Link>
              </div>
              <div className="w-16 md:w-24 lg:w-28">
                <Link
                  href="https://www.pharmazing.de"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/assets/img/pharmazingOrig.png"
                    width={1600}
                    height={533}
                    alt="pharmazing"
                  />
                </Link>
              </div>
              {/* <div
                onMouseEnter={() => setShowProducts(true)}
                onMouseLeave={() => setShowProducts(false)}
                className="hidden lg:block cursor-pointer text-lg hover:bg-[#f5f5f5] py-[2px] px-[10px] rounded-lg"
              >
                Product
                <FontAwesomeIcon
                  icon={showProducts ? faAngleUp : faAngleDown}
                  className="w-2 ml-2 -mb-[2px]"
                />
                {showProducts && (
                  <div className="absolute bg-white shadow-md">
                    <div className="flex p-1">
                      <div className="flex flex-col">
                        {products.main.map(
                          (
                            p: {
                              title: string;
                              description: string;
                              img: string;
                              width: number;
                              height: number;
                            },
                            i: number
                          ) => (
                            <div
                              key={i}
                              className="font-fontRegular flex justify-start items-center gap-x-[10px] hover:bg-[#f5f5f5] py-1 px-[10px] rounded-lg"
                            >
                              <div className="w-6">
                                <Image
                                  src={p.img}
                                  width={p.width}
                                  height={p.height}
                                  alt={p.title}
                                />
                              </div>
                              <div className="flex flex-col justify-center items-start">
                                <h1 className="text-base leading-5 opacity-80">
                                  {p.title}
                                </h1>
                                <p className="text-sm opacity-70 leading-5">
                                  {p.description}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                      <div className="flex flex-col border-l border-l-gray-100">
                        {products.subMenu.map(
                          (
                            p: {
                              title: string;
                              description: string;
                            },
                            i: number
                          ) => (
                            <div
                              key={i}
                              className="flex flex-col justify-center items-start hover:bg-[#f5f5f5] py-1 pl-[10px] pr-5 rounded-lg"
                            >
                              <h1 className="text-base leading-5 opacity-80">
                                {p.title}
                              </h1>
                              <p className="text-sm opacity-70 leading-5">
                                {p.description}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div
                onMouseEnter={() => setShowDownloads(true)}
                onMouseLeave={() => setShowDownloads(false)}
                className="hidden lg:block cursor-pointer text-lg hover:bg-[#f5f5f5] py-[2px] px-[10px] rounded-lg"
              >
                Download
                <FontAwesomeIcon
                  icon={showDownloads ? faAngleUp : faAngleDown}
                  className="w-2 ml-2 -mb-[2px]"
                />
                {showDownloads && (
                  <div className="absolute bg-white shadow-md">
                    <div className="flex flex-col p-1">
                      {downloads.map(
                        (
                          d: {
                            title: string;
                            url: string;
                          },
                          i: number
                        ) => (
                          <div
                            key={i}
                            className="font-fontRegular flex flex-col justify-center items-start hover:bg-[#f5f5f5] py-2 pl-[10px] pr-5 rounded-lg"
                          >
                            <h1 className="text-base leading-5 opacity-80">
                              {d.title}
                            </h1>
                          </div>
                        )
                      )}
                      <p className="text-sm opacity-70 pl-[10px] pr-8 mb-2">
                        Pharmazing is always at home <br /> right{" "}
                        <span className="border-b border-b-gray-400 leading-3 hover:text-blue-700 hover:border-b-blue-700">
                          in your browser
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div
                onMouseEnter={() => setShowSolutions(true)}
                onMouseLeave={() => setShowSolutions(false)}
                className="hidden lg:block cursor-pointer text-lg hover:bg-[#f5f5f5] py-[2px] px-[10px] rounded-lg"
              >
                Solutions
                <FontAwesomeIcon
                  icon={showSolutions ? faAngleUp : faAngleDown}
                  className="w-2 ml-2 -mb-[2px]"
                />
                {showSolutions && (
                  <div className="absolute bg-white shadow-md w-full">
                    <div className="flex gap-x-2 p-1">
                      <div className="flex flex-col w-2/5">
                        <p className="font-fontRegular text-xs opacity-70 pl-[10px] pt-1">
                          BY TEAM SIZE
                        </p>
                        {solutions.main.map(
                          (
                            s: {
                              title: string;
                              description: string;
                              img: string;
                              width: number;
                              height: number;
                            },
                            i: number
                          ) => (
                            <div
                              key={i}
                              className="font-fontRegular flex justify-start items-center gap-x-[10px] hover:bg-[#f5f5f5] py-2 pl-[10px] mx-1 w-full rounded-lg"
                            >
                              <div className="w-10">
                                <Image
                                  src={s.img}
                                  width={s.width}
                                  height={s.height}
                                  alt={s.title}
                                />
                              </div>
                              <div className="flex flex-col justify-center items-start">
                                <h1 className="text-base leading-5 opacity-80">
                                  {s.title}
                                </h1>
                                <p className="text-sm opacity-70 leading-5">
                                  {s.description}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                      <div className="flex flex-col border-l border-l-gray-100 w-[30%]">
                        <p className="font-fontRegular text-xs opacity-70 pl-[10px] pt-1">
                          BY TEAM FUNCTION
                        </p>
                        {solutions.subMenu1.map(
                          (
                            s: {
                              title: string;
                            },
                            i: number
                          ) => (
                            <div
                              key={i}
                              className="flex flex-col justify-center items-start hover:bg-[#f5f5f5] py-2 pl-[10px] mx-1 w-full rounded-lg"
                            >
                              <h1 className="text-base leading-5 opacity-80">
                                {s.title}
                              </h1>
                            </div>
                          )
                        )}
                      </div>
                      <div className="flex flex-col border-l border-l-gray-100 w-[30%] mr-1">
                        <p className="font-fontRegular text-xs opacity-70 pl-[10px] pt-1">
                          PHARMAZING FOR
                        </p>
                        {solutions.subMenu2.map(
                          (
                            s: {
                              title: string;
                            },
                            i: number
                          ) => (
                            <div
                              key={i}
                              className="flex flex-col justify-center items-start hover:bg-[#f5f5f5] py-2 pl-[10px] mx-1 w-full rounded-lg"
                            >
                              <h1 className="text-base leading-5 opacity-80">
                                {s.title}
                              </h1>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div
                onMouseEnter={() => setShowResources(true)}
                onMouseLeave={() => setShowResources(false)}
                className="hidden lg:block cursor-pointer text-lg hover:bg-[#f5f5f5] py-[1px] px-[10px] rounded-lg"
              >
                Resources
                <FontAwesomeIcon
                  icon={showResources ? faAngleUp : faAngleDown}
                  className="w-2 ml-2 -mb-[2px]"
                />
                {showResources && (
                  <div className="absolute bg-white shadow-md">
                    <div className="flex flex-col p-1">
                      {resources.map(
                        (
                          r: {
                            title: string;
                            url: string;
                          },
                          i: number
                        ) => (
                          <div
                            key={i}
                            className="font-fontRegular flex flex-col justify-center items-start hover:bg-[#f5f5f5] py-2 pl-[10px] pr-5 rounded-lg"
                          >
                            <h1 className="text-base leading-5 opacity-80">
                              {r.title}
                            </h1>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div> */}
              {/* <div className="hidden lg:block cursor-pointer text-lg hover:bg-[#f5f5f5] py-[1px] px-[10px] rounded-lg">
                Pricing
              </div> */}
            </div>
            <div className="flex justify-center items-center">
              {/* <div className="hidden lg:block cursor-pointer text-lg hover:bg-[#f5f5f5] py-[1px] px-[10px] rounded-lg">
                Request a demo
              </div> */}
              <div className="mx-1 h-5 w-[0.8px] bg-gray-200" />
              <Link
                href="/login"
                className="hidden lg:block cursor-pointer no-underline text-lg hover:bg-[#f5f5f5] py-[1px] px-[10px] rounded-lg"
              >
                Einloggen
              </Link>
              {!showMenu && (
                <Link
                  href="/register"
                  className={`${
                    scrollPosition > 100 ? "block" : "hidden lg:block"
                  } cursor-pointer no-underline text-lg bg-primary hover:bg-[#534ba2] text-white ml-2 py-[1px] px-4 rounded-lg`}
                >
                  Registrieren
                </Link>
              )}
              {showMenu ? (
                <FontAwesomeIcon
                  icon={faClose}
                  size="xl"
                  className="opacity-60 cursor-pointer block lg:hidden mx-4"
                  onClick={() => setShowMenu(false)}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faBars}
                  size="xl"
                  className="opacity-60 cursor-pointer block lg:hidden mx-4"
                  onClick={() => setShowMenu(true)}
                />
              )}
            </div>
          </Slide>
        </div>
      </div>
      {/* {Mobile Menu} */}
      <nav
        className={`bg-white z-30 fixed shadow-2xl top-0 left-0 h-screen w-screen overflow-y-auto px-2 py-2 md:py-6 transform ${
          showMenu ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex flex-col h-full justify-start space-y-4 pt-[55px] md:pt-[46px] px-2">
          {/* <div className="flex flex-col justify-center items-start border-b border-b-gray-300 pb-4">
            <div
              className="flex justify-between items-center cursor-pointer w-full"
              onClick={() => setShowProducts((prev) => !prev)}
            >
              <h2 className="text-lg">Product</h2>
              <FontAwesomeIcon
                icon={showProducts ? faAngleDown : faAngleRight}
                size="sm"
                className="mr-1"
              />
            </div>
            {showProducts && (
              <div className="mt-4 w-full">
                {products.main.map(
                  (
                    p: {
                      title: string;
                      description: string;
                      img: string;
                      width: number;
                      height: number;
                    },
                    i: number
                  ) => (
                    <div
                      key={i}
                      className="w-full flex justify-start items-center gap-x-2 cursor-pointer my-2"
                    >
                      <div className="w-6">
                        <Image
                          src={p.img}
                          width={p.width}
                          height={p.height}
                          alt={p.title}
                        />
                      </div>
                      <p className="font-fontRegular text-lg">{p.title}</p>
                    </div>
                  )
                )}
                <div className="mt-4 w-full">
                  {products.subMenu.map(
                    (
                      p: {
                        title: string;
                        description: string;
                      },
                      i: number
                    ) => (
                      <p
                        key={i}
                        className="font-fontRegular text-lg w-full cursor-pointer my-1"
                      >
                        {p.title}
                      </p>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center items-start border-b border-b-gray-300 pb-4">
            <div
              className="flex justify-between items-center cursor-pointer w-full"
              onClick={() => setShowSolutions((prev) => !prev)}
            >
              <h2 className="text-lg">Solutions</h2>
              <FontAwesomeIcon
                icon={showSolutions ? faAngleDown : faAngleRight}
                size="sm"
                className="mr-1"
              />
            </div>
            {showSolutions && (
              <div className="mt-4 w-full">
                <p className="font-fontRegular text-xs opacity-70 mt-3 pt-1">
                  BY TEAM SIZE
                </p>
                {solutions.main.map(
                  (
                    s: {
                      title: string;
                      description: string;
                      img: string;
                      width: number;
                      height: number;
                    },
                    i: number
                  ) => (
                    <div
                      key={i}
                      className="w-full flex justify-start items-center gap-x-2 cursor-pointer my-2"
                    >
                      <p className="font-fontRegular text-lg">{s.title}</p>
                    </div>
                  )
                )}
                <p className="font-fontRegular text-xs opacity-70 mt-5 pt-1">
                  BY TEAM FUNCTION
                </p>
                <div className="mt-2 w-full">
                  {solutions.subMenu1.map(
                    (
                      p: {
                        title: string;
                      },
                      i: number
                    ) => (
                      <p
                        key={i}
                        className="font-fontRegular text-lg w-full cursor-pointer my-1"
                      >
                        {p.title}
                      </p>
                    )
                  )}
                </div>
                <p className="font-fontRegular text-xs opacity-70 mt-5 pt-1">
                  PHARMAZING FOR
                </p>
                <div className="mt-2 w-full">
                  {solutions.subMenu2.map(
                    (
                      p: {
                        title: string;
                      },
                      i: number
                    ) => (
                      <p
                        key={i}
                        className="font-fontRegular text-lg w-full cursor-pointer my-1"
                      >
                        {p.title}
                      </p>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center items-start border-b border-b-gray-300 pb-4">
            <div
              className="flex justify-between items-center cursor-pointer w-full"
              onClick={() => setShowResources((prev) => !prev)}
            >
              <h2 className="text-lg">Resources</h2>
              <FontAwesomeIcon
                icon={showResources ? faAngleDown : faAngleRight}
                size="sm"
                className="mr-1"
              />
            </div>
            {showResources && (
              <div className="mt-4 w-full">
                {resources.map(
                  (
                    r: {
                      title: string;
                      url: string;
                    },
                    i: number
                  ) => (
                    <div
                      key={i}
                      className="w-full flex justify-start items-center gap-x-2 cursor-pointer my-2"
                    >
                      <p className="font-fontRegular text-lg">{r.title}</p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center items-start border-b border-b-gray-300 pb-4">
            <div
              className="flex justify-between items-center cursor-pointer w-full"
              onClick={() => setShowDownloads((prev) => !prev)}
            >
              <h2 className="text-lg">Downloads</h2>
              <FontAwesomeIcon
                icon={showDownloads ? faAngleDown : faAngleRight}
                size="sm"
                className="mr-1"
              />
            </div>
            {showDownloads && (
              <>
                <div className="mt-4 w-full">
                  {downloads.map(
                    (
                      d: {
                        title: string;
                        url: string;
                      },
                      i: number
                    ) => (
                      <div
                        key={i}
                        className="w-full flex justify-start items-center gap-x-2 cursor-pointer my-2"
                      >
                        <p className="font-fontRegular text-lg">{d.title}</p>
                      </div>
                    )
                  )}
                </div>
                <p className="text-sm opacity-70 mt-2">
                  Pharmazing is always at home right{" "}
                  <span className="cursor-pointer border-b border-b-gray-400 leading-3 hover:text-blue-700 hover:border-b-blue-700">
                    in your browser
                  </span>
                </p>
              </>
            )}
          </div> */}
          {/* <div className="flex flex-col justify-center items-start border-b border-b-gray-300 pb-4">
            <div className="flex justify-between items-center cursor-pointer w-full">
              <h2 className="text-lg">Pricing</h2>
            </div>
          </div> */}
          {/* <div className="flex flex-col justify-center items-start border-b border-b-gray-300 pb-4">
            <div className="flex justify-between items-center cursor-pointer w-full">
              <h2 className="text-lg">Request a demo</h2>
            </div>
          </div> */}
          <div className="pt-4">
            <Link
              href="/register"
              className="no-underline flex flex-col justify-center items-center py-1 cursor-pointer rounded-lg bg-black"
            >
              <span className="text-lg text-white">Register</span>
            </Link>
            <Link
              href="/login"
              className="mt-4 no-underline flex flex-col justify-center items-center py-1 cursor-pointer rounded-lg bg-white border border-gray-300"
            >
              <span className="text-lg text-black">Login</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default forwardRef(Header);
