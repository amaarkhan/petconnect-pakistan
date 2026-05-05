import { getAnalytics } from "firebase/analytics";
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "",
};

let app: FirebaseApp | null = null;

export const getFirebaseApp = () => {
  if (typeof window === "undefined") {
    return null;
  }
  if (!app) {
    app = initializeApp(firebaseConfig);
    if (firebaseConfig.measurementId) {
      getAnalytics(app);
    }
  }
  return app;
};

export const getFirebaseAuth = () => {
  const firebaseApp = getFirebaseApp();
  return firebaseApp ? getAuth(firebaseApp) : null;
};

export const getFirebaseDb = () => {
  const firebaseApp = getFirebaseApp();
  return firebaseApp ? getFirestore(firebaseApp) : null;
};

export const getFirebaseStorage = () => {
  const firebaseApp = getFirebaseApp();
  return firebaseApp ? getStorage(firebaseApp) : null;
};
