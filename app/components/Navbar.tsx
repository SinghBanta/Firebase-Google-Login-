"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { CircleUserRound } from "lucide-react";

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  

  const isLoginPage = pathname === "/auth/login";

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } finally {
      setShowConfirm(false);
      setOpen(false);
    }
  };

  const goUser = () => {
    router.push("/dashboard/user");
    setOpen(false);
  };

  const goAdmin = () => {
    if (role !== "admin") {
      setShowAccessDenied(true);
      setOpen(false);
      return;
    }
    router.push("/dashboard/admin");
    setOpen(false);
  };

 

  return (
    <>
      {/* 🚫 Access Denied Modal */}
      {showAccessDenied && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[320px] space-y-4 text-center">
            <h2 className="text-lg font-semibold text-red-600">
              Access Denied 🚫
            </h2>

            <p className="text-gray-600 text-sm">
              You don’t have permission to access the Admin Dashboard.
            </p>

            <button
              onClick={() => setShowAccessDenied(false)}
              className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Okay
            </button>
          </div>
        </div>
      )}

       

      <nav className="flex justify-between items-center p-4 border-b">
        <h1
          onClick={() => router.push("/")}
          className="font-bold text-xl cursor-pointer"
        >
          Taskflow
        </h1>

        {/* ✨ Center: clean brand strip */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full border bg-gray-50 text-gray-600 shadow-sm">
            <span className="text-sm font-medium">✨ Onboarding OS</span>
            <span className="text-xs px-2 py-1 rounded-full bg-white border text-gray-500">Focus • Flow • Finish</span>
          </div>
          <button className="px-4 py-2 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-sm font-semibold hover:bg-blue-100 transition">
            Launch your team flow
          </button>
        </div>

        {/* 🔐 Right side */}
        {!isLoginPage && user && (
          <div className="relative">
            <button onClick={() => setOpen(!open)}>
              <CircleUserRound className="w-7 h-7" />
            </button>

            {open && (
              <div className="absolute right-0 top-12 w-44 bg-white border rounded-lg shadow-md z-50">
                <button
                  onClick={goUser}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  User Dashboard
                </button>

                <button
                  onClick={goAdmin}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Admin Dashboard
                </button>

                <button
                  onClick={() => {
                    setShowConfirm(true);
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {!isLoginPage && !user && (
          <button
            onClick={() => router.push("/auth/login")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Login
          </button>
        )}
  </nav>

  {/* 🔴 Logout Confirmation */}
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
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
