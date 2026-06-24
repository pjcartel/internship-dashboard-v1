import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      // Get Firebase ID token
      const token = await res.user.getIdToken(true);

      // Send user + token to App.js
      setUser({
        email: res.user.email,
        uid: res.user.uid,
        token: token,
      });

    } catch (err) {
      console.log(err);
      alert(`${err.code}: ${err.message}`);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={login} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}