import { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { demoUsers } from "../data/seedData";

const AuthContext = createContext(null);
const DEMO_SESSION_KEY = "internship-dashboard-demo-session";

function createDemoSession(role = "admin") {
  const user = demoUsers.find((item) => item.role === role) || demoUsers[0];
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.fullName,
    isDemo: true,
  };
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState("intern");
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const savedDemo = window.localStorage.getItem(DEMO_SESSION_KEY);
    if (savedDemo) {
      const session = JSON.parse(savedDemo);
      setCurrentUser(session.user);
      setRole(session.role);
      setLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setAuthError("");
      if (!user) {
        setCurrentUser(null);
        setRole("intern");
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdTokenResult(true);
        const profileRef = doc(db, "users", user.uid);
        const profileSnap = await getDoc(profileRef);
        const firestoreRole = profileSnap.exists() ? profileSnap.data().role : undefined;
        setRole(token.claims.role || firestoreRole || "intern");
      } catch (error) {
        console.warn("Unable to load Firebase role information", error);
        setRole("intern");
      }

      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    setAuthError("");
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  const register = async ({ email, password, fullName, department, phone, bio }) => {
    setAuthError("");
    if (!email.endsWith("@softlink.com")) {
      throw new Error("Use a Softlink work email address to register.");
    }
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", result.user.uid), {
      email,
      role: "intern",
      fullName,
      department,
      phone,
      bio,
      createdAt: new Date().toISOString(),
    });
    await setDoc(doc(db, "profiles", result.user.uid), {
      email,
      fullName,
      department,
      phone,
      role: "intern",
      bio,
      createdAt: new Date().toISOString(),
    });
    return result.user;
  };

  const demoLogin = (selectedRole = "admin") => {
    const user = createDemoSession(selectedRole);
    const session = { user, role: selectedRole };
    window.localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
    setCurrentUser(user);
    setRole(selectedRole);
    setAuthError("");
  };

  const logout = async () => {
    window.localStorage.removeItem(DEMO_SESSION_KEY);
    if (!currentUser?.isDemo) {
      await signOut(auth);
    }
    setCurrentUser(null);
    setRole("intern");
  };

  const value = {
    currentUser,
    role,
    loading,
    authError,
    setAuthError,
    login,
    register,
    demoLogin,
    logout,
    isAuthenticated: Boolean(currentUser),
    isDemo: Boolean(currentUser?.isDemo),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
