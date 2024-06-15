"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/redux";
import { i18n } from "@/lng/logic";

type LinkType = {
  name: string;
  path: string;
  isExternal: boolean;
};

type Props = {
  toggleMenu: () => void;
  showDialog: () => void;
};

const NavLinks: React.FC<Props> = ({ toggleMenu, showDialog }: Props) => {
  const pathname = usePathname();
  const { data: translation } = useAppSelector((state) => state.i18n);

  const links: LinkType[] = [
    {
      name: i18n(translation, "drawer", "Question"),
      path: "/ask",
      isExternal: false,
    },
    {
      name: i18n(translation, "drawer", "history"),
      path: "/history",
      isExternal: false,
    },
    {
      name: i18n(translation, "drawer", "profile"),
      path: "/profile",
      isExternal: false,
    },
    {
      name: i18n(translation, "drawer", "tutorial"),
      path: "/tutorial",
      isExternal: false,
    },
    {
      name: i18n(translation, "drawer", "instagram"),
      path: "https://www.instagram.com/pharmazingde?igsh=MTNkbDV6cXl3ZXJnag==",
      isExternal: true,
    },
    {
      name: i18n(translation, "drawer", "Support"),
      path: "mailto:support@pharmazing.de?subject=Support",
      isExternal: true,
    },
  ];

  return (
    <>
      {links.map((link: LinkType, i: number) => {
        return link.isExternal ? (
          <Link
            key={i}
            href={link.path}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-md text-black hover:bg-black transition-all duration-500 ease-in-out hover:bg-opacity-30"
            onClick={toggleMenu}
          >
            <button
              className="w-full h-full text-left font-MathJaxRegular"
            >
              {link.name}
            </button>
          </Link>
        ) : (
          <Link
            key={i}
            href={link.path}
            className={`${
              pathname.startsWith(link.path)
                ? "bg-primary bg-opacity-30 text-primary"
                : "text-black hover:bg-black transition-all duration-500 ease-in-out hover:bg-opacity-30"
            } p-2 rounded-md`}
            onClick={toggleMenu}
          >
            <button
              className="w-full h-full text-left font-MathJaxRegular"
            >
              {link.name}
            </button>
          </Link>
        );
      })}
      <button
        className="text-black font-MathJaxRegular text-left p-2 rounded-md hover:bg-black transition-all duration-500 ease-in-out hover:bg-opacity-30"
        onClick={showDialog}
      >
        {i18n(translation, "drawer", "logout")}
      </button>
    </>
  );
};

export default NavLinks;
