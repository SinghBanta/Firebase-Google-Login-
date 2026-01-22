"use client";

import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { loginWithGoogle, user, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && role) {
      router.replace(
        role === "admin"
          ? "/admin/dashboard"
          : "/user/dashboard"
      );
    }
  }, [user, role, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Continue with Google
        </h2>

        <button
          onClick={loginWithGoogle}
          className="w-full py-3 bg-red-500 text-white rounded-lg"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
