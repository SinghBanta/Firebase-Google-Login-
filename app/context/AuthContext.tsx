"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

interface AuthContextType {
  user: User | null;
  role: "admin" | "user" | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// 👇 Admin emails (ONLY these become admins)
const ADMIN_EMAILS = [
  "singhbanta84@gmail.com",
  "admin2@gmail.com",
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"admin" | "user" | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setRole(null);
        return;
      }

      setUser(firebaseUser);

      const userRef = doc(db, "users", firebaseUser.uid);
      const snap = await getDoc(userRef);

      // 🆕 First-time Google login
      if (!snap.exists()) {
        const assignedRole = ADMIN_EMAILS.includes(firebaseUser.email || "")
          ? "admin"
          : "user";

        await setDoc(userRef, {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          photo: firebaseUser.photoURL,
          role: assignedRole,
          createdAt: serverTimestamp(),
        });

        setRole(assignedRole);
      } else {
        setRole(snap.data().role);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔥 Google Login only
  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
