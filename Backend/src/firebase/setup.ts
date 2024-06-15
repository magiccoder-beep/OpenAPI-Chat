// import { initializeApp, FirebaseApp } from "firebase/app";
// import { getMessaging, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

// const app: FirebaseApp = initializeApp(firebaseConfig);
// let messaging: Messaging | undefined;
// if (typeof window !== "undefined") {
  // messaging = getMessaging(app);
// }

// export { app, messaging };
