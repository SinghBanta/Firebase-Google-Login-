"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { UserField } from "@/app/types/user";

const redirectMap: Record<UserField, string> = {
  web_development: "/dashboard/developer",
  digital_marketing: "/dashboard/digital-marketing",
  seo: "/dashboard/seo",
  hr_executive: "/dashboard/hr",
  graphic_designer: "/dashboard/design",
  illustrator: "/dashboard/illustrator",
};

export default function SelectFieldModal() {
  const { updateField } = useAuth();
  const router = useRouter();
  const [selectedField, setSelectedField] = useState<UserField | "">("");

  const handleConfirm = async () => {
    if (!selectedField) return;
    await updateField(selectedField);
    router.replace(redirectMap[selectedField]);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[320px] space-y-5 text-center">
        <h2 className="text-xl font-bold">Select Your Role</h2>

        <select
          value={selectedField}
          onChange={(e) => setSelectedField(e.target.value as UserField)}
          className="w-full border rounded-md px-3 py-2"
        >
          <option value="">-- Select your role --</option>
          <option value="web_development">Web Development</option>
          <option value="digital_marketing">Digital Marketing</option>
          <option value="seo">SEO</option>
          <option value="hr_executive">HR Executive</option>
          <option value="graphic_designer">Graphic Designer</option>
          <option value="illustrator">Illustrator</option>
        </select>

        <button
          disabled={!selectedField}
          onClick={handleConfirm}
          className={`w-full py-2 rounded text-white font-semibold ${
            selectedField
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          OK
        </button>
      </div>
    </div>
  );
}
