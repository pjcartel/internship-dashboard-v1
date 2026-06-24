import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC-XCPCJ4en4bvIXpn2loBIM6Ev44KCpcY",
  authDomain: "internship-dashboard-b19f2.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);