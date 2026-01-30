import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { User } from "firebase/auth";
import { field } from "firebase/firestore/pipelines";

export const createUserInDB = async (user: User) => {
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  // ❌ If user already exists, do nothing
  if (snap.exists()) return;

  // ✅ Create user
  await setDoc(userRef, {
    uid: user.uid,
    name: user.displayName || "",
    email: user.email,
    photoURL: user.photoURL || "",
    provider: user.providerData[0]?.providerId,
    createdAt: serverTimestamp(),
    field: null,
    lastLogin: serverTimestamp()
  });
};
