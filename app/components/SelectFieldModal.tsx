"use client";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SelectFieldModal() {
  const { user } = useAuth();
  const router = useRouter();

  const selectField = async (
    field: "developer" | "digital_marketing"
  ) => {
    if (!user) return;

    await updateDoc(doc(db, "users", user.uid), { field });

    router.replace(
      field === "developer"
        ? "/dashboard/developer"
        : "/dashboard/digital-marketing"
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[320px] text-center space-y-4">
        <h2 className="text-xl font-bold">Select Your Role</h2>
        <p className="text-sm text-gray-500">
          Choose your working field to continue
        </p>

        <button
          onClick={() => selectField("developer")}
          className="w-full py-2 rounded bg-blue-600 text-white"
        >
          👨‍💻 Developer
        </button>

        <button
          onClick={() => selectField("digital_marketing")}
          className="w-full py-2 rounded bg-green-600 text-white"
        >
          📢 Digital Marketing
        </button>
      </div>
    </div>
  );
}
