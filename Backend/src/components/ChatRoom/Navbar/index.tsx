"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { forwardRef, useState } from "react";
import { faBars, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppSelector, useAppDispatch, pharmazingActions } from "@/redux";
import Colors from "@/constants/colors";
import { NavLinks, Modal } from "@/components";
import { i18n } from "@/lng/logic";
import { logout } from "@/helper";
import { useImages } from "@/context/imagesContext";

type Props = {};

const Navbar: React.ForwardRefRenderFunction<HTMLElement, Props> = (
  props: Props,
  ref
) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { data: translation } = useAppSelector((state) => state.i18n);
  const { setShowImages } = useImages();
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [logoutDialog, setLogoutDialog] = useState<boolean>(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const showLogoutDialog = () => {
    setLogoutDialog(true);
  };

  const closeLogoutDialog = () => {
    setLogoutDialog(false);
  };

  const handleNewChat = () => {
    setTimeout(() => setShowImages(false), 500);
    dispatch(pharmazingActions.resetMessages());
    if (pathname === "/ask") {
      
    } else {
      router.push("/ask");
    }
  };

  return (
    <>
      <Modal
        theme="light"
        showModal={logoutDialog}
        title={i18n(translation, "dialog", "logoutTitle")}
        description={i18n(translation, "dialog", "logoutDescription")}
        submitButtonText={i18n(translation, "general", "yes")}
        submitHandler={() => logout(router, dispatch)}
        closeButtonText={i18n(translation, "general", "no")}
        closeHandler={closeLogoutDialog}
      />
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40 ${
          showMenu ? "block" : "hidden"
        }`}
        onClick={toggleMenu}
      ></div>
      <header
        ref={ref}
        className="fixed top-0 z-10 w-full flex justify-between items-center px-4 py-2 lg:py-1 bg-white border-b border-b-gray-100"
      >
        <FontAwesomeIcon
          className="w-4 md:w-6 h-4 md:h-6 cursor-pointer"
          icon={faBars}
          color={Colors.primaryColor}
          onClick={toggleMenu}
        />
        <div className="w-24 md:w-32 lg:w-40">
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
        {!pathname.startsWith("/profile") ? (
          <FontAwesomeIcon
            className="w-4 md:w-6 h-4 md:h-6 cursor-pointer"
            icon={faEdit}
            color={Colors.primaryColor}
            onClick={handleNewChat}
          />
        ) : (
          <div className="w-4 md:w-6 h-4 md:h-6"></div>
        )}
      </header>
      <nav
        className={`bg-white z-40 fixed shadow-2xl top-0 left-0 h-screen w-4/6 md:w-1/2 lg:w-1/4 xl:w-1/5 px-2 py-2 md:py-6 transform ${
          showMenu ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full justify-start space-y-2">
          <NavLinks toggleMenu={toggleMenu} showDialog={showLogoutDialog} />
        </div>
      </nav>
    </>
  );
};

export default forwardRef(Navbar);
