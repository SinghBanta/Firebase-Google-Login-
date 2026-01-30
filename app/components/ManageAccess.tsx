"use client";

import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/app/firebase";
import { useAuth } from "@/app/context/AuthContext";

type UserType = {
  id: string;
  name?: string;
  email?: string;
  role: "admin" | "user";
  createdAt?: Timestamp;
  lastLogin?: Timestamp;
};

export default function ManageAccess() {
  const { user, role } = useAuth();

  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // 🔐 Admin only
  useEffect(() => {
    if (role !== "admin") {
      setLoading(false);
      return;
    }

    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<UserType, "id">),
      }));

      setUsers(list);
      setLoading(false);
    });

    return () => unsub();
  }, [role]);

  const updateRole = async (uid: string, newRole: "admin" | "user") => {
    if (uid === user?.uid) {
      alert("You cannot change your own role ❌");
      return;
    }

    try {
      setUpdatingId(uid);
      await updateDoc(doc(db, "users", uid), { role: newRole });
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (timestamp: Timestamp | null | undefined) => {
    if (!timestamp) return "—";
    const date = timestamp.toDate();
    return date.toLocaleDateString();
  };

  if (role !== "admin") {
    return (
      <div className="p-6 text-red-600 font-medium">
        Access denied. Admins only.
      </div>
    );
  }

  if (loading) return <p className="p-6">Loading users...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Access</h2>

      {/* 👑 Current Admin */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <p className="font-semibold">You (Admin)</p>
        <p className="text-sm">{user?.displayName}</p>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>

      {/* 📋 Users Table */}
      <div className="border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-5 bg-gray-100 px-4 py-3 text-sm font-semibold">
          <div>Name</div>
          <div>Email</div>
          <div>Joined</div>
          <div>Last Login</div>
          <div className="text-right">Action</div>
        </div>

        {/* Rows */}
        {users
          .filter((u) => u.id !== user?.uid)
          .map((u) => (
            <div
              key={u.id}
              className="grid grid-cols-5 items-center px-4 py-3 border-t"
            >
              <div className="font-medium">{u.name || "No Name"}</div>

              <div className="text-sm text-gray-600">{u.email}</div>

              <div className="text-sm text-gray-600">
                {formatDate(u.createdAt)}
              </div>

              <div className="text-sm text-gray-600">
                {formatDate(u.lastLogin)}
              </div>

              <div className="text-right">
                <button
                  disabled={updatingId === u.id}
                  onClick={() =>
                    updateRole(
                      u.id,
                      u.role === "admin" ? "user" : "admin"
                    )
                  }
                  className={`px-4 py-1 rounded text-white text-sm disabled:opacity-50 ${
                    u.role === "admin"
                      ? "bg-orange-600 hover:bg-orange-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {u.role === "admin" ? "Remove Admin" : "Make Admin"}
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
