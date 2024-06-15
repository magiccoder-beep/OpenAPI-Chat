"use client";

import Image from "next/image";
import Link from "next/link";

type Props = {};

const products: string[] = [
  "AI",
  "Docs",
  "Wikis",
  "Projects",
  "Calendar",
  "What’s new",
];

const downloads: string[] = [
  "iOS & Android",
  "Mac & Windows",
  "Calendar",
  "Web Clipper",
];

const getStarted: string[] = [
  "Switch from Confluence",
  "Switch from Asana",
  "Switch from Evernote",
  "Compare vs Monday",
  "Compare vs Clickup",
  "Compare vs Jira",
];

const Footer: React.FC<Props> = (props: Props) => {
  return(<div></div>)
  return (
    <>
      <div className="flex justify-center items-center">
        <div className="flex flex-col lg:flex-row gap-y-6 lg:gap-y-0 justify-center items-start border-t border-t-gray-200 p-10 w-[98%]">
          <div className="flex flex-col justify-start items-start w-full lg:w-1/5">
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
            </div>
          </div>
          {/* <div className="flex flex-col justify-start items-start w-full lg:w-1/5">
            <h1 className="my-2 font-fontBold text-secondary">Product</h1>
            {products.map((p: string, i: number) => (
              <p
                key={i}
                className="my-2 cursor-pointer font-fontRegular hover:border-b-[1.2px] text-primary hover:text-[#534ba2] hover:border-b-[#534ba2] leading-3"
              >
                {p}
              </p>
            ))}
          </div> */}
          {/* <div className="flex flex-col justify-start items-start w-full lg:w-1/5">
            <h1 className="my-2 font-fontBold text-secondary">Download</h1>
            {downloads.map((d: string, i: number) => (
              <p
                key={i}
                className="my-2 cursor-pointer font-fontRegular hover:border-b-[1.2px] text-primary hover:text-[#534ba2] hover:border-b-[#534ba2] leading-3"
              >
                {d}
              </p>
            ))}
          </div> */}
          {/* <div className="flex flex-col justify-start items-start w-full lg:w-1/5">
            <h1 className="my-2 font-fontBold text-secondary">Get started</h1>
            {getStarted.map((g: string, i: number) => (
              <p
                key={i}
                className="my-2 cursor-pointer font-fontRegular hover:border-b-[1.2px] text-primary hover:text-[#534ba2] hover:border-b-[#534ba2] leading-3"
              >
                {g}
              </p>
            ))}
          </div> */}
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-center mb-4">
        <h1 className="my-2 cursor-pointer font-fontBold hover:border-b-[1.2px] text-primary hover:text-[#534ba2] hover:border-b-[#534ba2] leading-3">
          Do Not Sell or Share My Info
        </h1>
        <p className="text-[#534ba2]">© 2024 Pharmazing Labs, Inc.</p>
      </div>
    </>
  );
};

export default Footer;
