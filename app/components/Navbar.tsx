"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center px-6 py-4 border-b">
      <h1 className="font-bold text-lg">MyApp</h1>

      {user ? (
        <button
          onClick={logout}
          className="px-4 py-2 bg-gray-800 text-white rounded-md"
        >
          Logout
        </button>
      ) : (
        <Link
          href="/auth/login"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md"
        >
          Login
        </Link>
      )}
    </nav>
  );
}
