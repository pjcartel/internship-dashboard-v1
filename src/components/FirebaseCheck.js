import React, { useEffect } from "react";
import { auth } from "../firebase";

export default function FirebaseCheck() {
  useEffect(() => {
    console.log("Auth currentUser:", auth.currentUser);
  }, []);
  return <div>Firebase runtime check complete. See console for details.</div>;
}
