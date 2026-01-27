/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { CircleUserRound } from "lucide-react";

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      router.push("/");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  const isLoginPage = pathname === "/auth/login";

  // 🔥 Show profile dropdown ONLY on home page
  const showProfileDropdown = pathname === "/";

  const goAdmin = () => {
    if (role !== "admin") {
      alert("You are not an admin ❌");
      return;
    }
    router.push("/dashboard/admin");
    setOpen(false);
  };

  // const goUser = () => {
  //   router.push("/dashboard/user");
  //   setOpen(false);
  // };

  const goUser = () => {
    if (role === "admin") {
      alert("Admins cannot access User Dashboard ❌");
      return;
    }
    router.push("/dashboard/user");
    setOpen(false);
  };

  return (
    <>
      <nav className="flex justify-between items-center p-4 border-b">
        <h1
          onClick={() => router.push("/")}
          className="font-bold text-xl cursor-pointer"
        >
          Taskflow
        </h1>

        {/* ❌ Hide everything on login page */}
        {!isLoginPage && user && (
          <div className="flex items-center gap-4">
            {/* 🔥 Profile dropdown ONLY on home */}
            {showProfileDropdown && (
              <div className="relative">
                <button onClick={() => setOpen(!open)}>
                  <CircleUserRound/>
                </button>

                {/* {open && (
                  <div className="absolute right-0 top-12 w-44 bg-white border rounded-lg shadow-md z-50">
                    <button
                      onClick={goUser}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      User Dashboard
                    </button>

                    <button
                      onClick={goAdmin}
                      disabled={role !== "admin"}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        role !== "admin" &&
                        "text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Admin Dashboard
                    </button>
                  </div>
                )} */}

                {open && (
                  <div className="absolute right-0 top-12 w-44 bg-white border rounded-lg shadow-md z-50">
                    {/* User Dashboard */}
                    <button
                      onClick={goUser}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        role === "admin" && "text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      User Dashboard
                    </button>

                    {/* Admin Dashboard */}
                    <button
                      onClick={goAdmin}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        role !== "admin" && "text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Admin Dashboard
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ✅ Logout always visible (except login page) */}
            <button
              onClick={() => setShowConfirm(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        )}

        {/* 🔐 Login button */}
        {!isLoginPage && !user && (
          <button
            onClick={() => router.push("/auth/login")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Login
          </button>
        )}
      </nav>
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[300px] space-y-4">
            <h2 className="text-lg font-semibold">Confirm Logout</h2>

            <p className="text-gray-600 text-sm">
              Logged in as <b>{role}</b>
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                {loading ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
