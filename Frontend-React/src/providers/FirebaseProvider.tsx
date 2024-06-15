"use client";

// import { useEffect } from "react";
// import axios from "axios";
// import { getToken } from "firebase/messaging";
// import { messaging } from "@/firebase/setup";
// import constants from "@/constants/general";

type Props = {
  children: React.ReactNode;
};

const FirebaseProvider: React.FC<Props> = ({ children }: Props) => {
  // const requestPermission = async () => {
  //   if (!messaging) return;
  //   const permission = await Notification.requestPermission();
  //   if (permission === "granted") {
  //     return await getToken(messaging, {
  //       vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
  //     });
  //   } else if (permission === "denied") {
  //     console.log("🚀 ~ requestPermission ~ Denied for the notification:");
  //   }
  // };
  // useEffect(() => {
  //   const setToken = async () => {
  //     try {
  //       const token = await requestPermission();
  //       const response = await axios.post(
  //         `${constants.urlBase}/users/setFcmToken`,
  //         { token },
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       console.log("🚀 ~ setToken ~ response.data:", response.data);
  //     } catch (error) {
  //       console.log("🚀 ~ setToken ~ error:", error);
  //     }
  //   };

  //   setToken();
  // }, []);

  return children;
};

export default FirebaseProvider;
