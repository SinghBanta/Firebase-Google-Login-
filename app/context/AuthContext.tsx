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
  field: "developer" | "digital_marketing" | null;
  updateField: (newField: "developer" | "digital_marketing") => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [field, setField] = useState<"developer" | "digital_marketing" | null>(null);

  const ADMIN_EMAILS = [
  "singhbanta84@gmail.com",
  "admin2@gmail.com",
];

  const updateField = async (newField: "developer" | "digital_marketing") => {
    if (!user) return;
    
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { field: newField }, { merge: true });
    setField(newField);
  };

   useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      console.log("🔥 Auth state changed:", firebaseUser?.email);
      
      if (!firebaseUser) {
        setUser(null);
        setRole(null);
        setField(null);
        console.log("❌ No user, cleared state");
        return;
      }

      setUser(firebaseUser);

      const userRef = doc(db, "users", firebaseUser.uid);
      const snap = await getDoc(userRef);

      console.log("📄 Firestore snap exists:", snap.exists());

      // 🆕 First-time Google login
      if (!snap.exists()) {
        const assignedRole = ADMIN_EMAILS.includes(firebaseUser.email || "")
          ? "admin"
          : "user";
        console.log("🆕 Creating new user document");
        await setDoc(userRef, {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          photo: firebaseUser.photoURL,
          role: assignedRole,
          field: null,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        });

        setRole(assignedRole);
        setField(null);
        console.log("✅ New user created with role: user, field: null");
      } else {
        // 🔁 Update last login every time
        await setDoc(
          userRef,
          { lastLogin: serverTimestamp() },
          { merge: true }
        );
        
        const data = snap.data();
        const normalizedField =
          data.field === "developer" || data.field === "digital_marketing"
            ? data.field
            : null;

        // Backfill missing field for existing users
        if (data.field === undefined) {
          await setDoc(userRef, { field: null }, { merge: true });
        }

        setRole(data.role);
        setField(normalizedField);
      }
    });

    return () => unsubscribe();
  }, []);

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
        field,
        updateField,
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