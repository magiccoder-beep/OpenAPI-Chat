"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { userActions, useAppDispatch, useAppSelector } from "@/redux";

const protectedRoutes: string[] = [
  "/ask",
  "/tutorial",
  "/history",
  "/history/chat",
  "/history/preview",
  "/preview",
  "/profile",
];

type Props = {
  children: React.ReactNode;
};

const AuthProvider: React.FC<Props> = ({ children }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { loading, user, tutorialSeen } = useAppSelector(
    (state) => state.users
  );

  useEffect(() => {
    dispatch(userActions.setUserLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (pathname === "/") {
      return;
    }
    if (!loading && user && user.loggedIn) {
      if (protectedRoutes.includes(pathname)) {
        if (!tutorialSeen) {
          router.replace("/tutorial");
        } else {
          router.replace(pathname);
        }
      } else if (pathname === "/login" && !tutorialSeen) {
        router.replace("/tutorial");
      } else {
        router.replace("/ask");
      }
    }
    if (!loading && (!user || !user.loggedIn)) {
      if (protectedRoutes.includes(pathname)) {
        router.replace("/");
      }
    }
  }, [router, pathname, loading, user, tutorialSeen]);

  if (loading) {
    return;
  }

  return children;
};

export default AuthProvider;
