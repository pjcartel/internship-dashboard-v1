import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC-XCPCJ4en4bvIXpn2loBIM6Ev44KCpcY",
  authDomain: "internship-dashboard-b19f2.firebaseapp.com",
  projectId: "internship-dashboard-b19f2",
  storageBucket: "internship-dashboard-b19f2.firebasestorage.app",
  messagingSenderId: "219886194633",
  appId: "1:219886194633:web:7ed9624e3a4e64929c2218",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);