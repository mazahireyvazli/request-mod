import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDhrnsR0opIxKojkxTe5KzjP6GTvGlhdbY",
  authDomain: "request-mod.firebaseapp.com",
  projectId: "request-mod",
  storageBucket: "request-mod.appspot.com",
  messagingSenderId: "669219191683",
  appId: "1:669219191683:web:eb015db9ca84efb03cd4b6",
  measurementId: "G-K00YNH677T",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
