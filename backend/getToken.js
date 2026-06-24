const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

// 🔥 YOUR FIREBASE CONFIG (replace this)
const firebaseConfig = {
  apiKey: "AIzaSyC-XCPCJ4en4bvIXpn2loBIM6Ev44KCpcY",
  authDomain: "internship-dashboard-b19f2.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function getToken() {
  try {
    const email = "test@gmail.com";      // MUST exist in Firebase Auth
    const password = "12345678";

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    const token = await user.getIdToken(true);

    console.log("\n🔥 YOUR FIREBASE TOKEN:\n");
    console.log(token);

  } catch (error) {
    console.error("❌ Error:", error.code, error.message);
  }
}

getToken();