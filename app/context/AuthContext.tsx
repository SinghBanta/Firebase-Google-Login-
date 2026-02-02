"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { UserField } from "@/app/types/user";


interface AuthContextType {
  user: User | null;
  role: "admin" | "user" | null;
  field: UserField | null;
  loginWithGoogle: () => Promise<void>;
  updateField: (field: UserField) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ADMIN_EMAILS = [
  "singhbanta84@gmail.com",
  "admin2@gmail.com",
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [field, setField] = useState<UserField | null>(null);

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateField = async (newField: UserField) => {
    if (!user) return;
    await setDoc(
      doc(db, "users", user.uid),
      { field: newField },
      { merge: true }
    );
    setField(newField);
  };

  useEffect(() => {
    return auth.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setRole(null);
        setField(null);
        return;
      }

      setUser(firebaseUser);
      const ref = doc(db, "users", firebaseUser.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        const assignedRole = ADMIN_EMAILS.includes(firebaseUser.email || "")
          ? "admin"
          : "user";

        await setDoc(ref, {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          role: assignedRole,
          field: null,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        });

        setRole(assignedRole);
        setField(null);
      } else {
        await setDoc(ref, { lastLogin: serverTimestamp() }, { merge: true });
        const data = snap.data();
        setRole(data.role);
        setField(data.field ?? null);
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, role, field, loginWithGoogle, updateField, logout }}
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
