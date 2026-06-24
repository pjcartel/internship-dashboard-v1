import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    // Restrict to work emails (example: softlink.com)
    if (!email.endsWith("@softlink.com")) {
      alert("Please use your work email to register");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user info in Firestore
      await addDoc(collection(db, "users"), {
        email: user.email,
        role: "intern", // default role
      });

      alert("Registration successful! You can now log in.");
      setEmail("");
      setPassword("");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Intern Registration</h1>
      <form onSubmit={handleRegister} className="flex flex-col w-80 bg-white p-6 rounded shadow">
        <input
          type="email"
          placeholder="Work Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Register
        </button>
      </form>
      <p className="mt-4">
        Already registered? <a href="/login" className="text-blue-500">Login here</a>
      </p>
    </div>
  );
}

