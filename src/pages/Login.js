import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const provider = new GoogleAuthProvider();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Internship Dashboard</h1>
      <button 
        onClick={handleLogin} 
        className="bg-blue-500 text-white px-4 py-2 rounded">
        Sign in with Google
      </button>
    </div>
  );
}
