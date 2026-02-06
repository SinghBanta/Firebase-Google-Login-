"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSubmissions } from "@/app/hook/useSubmissions";

const formatDate = (date: string | Date | number | null | any): string => {
  if (!date) return "N/A";
  // Handle Firestore Timestamp objects
  if (typeof date === 'object' && 'seconds' in date) {
    return new Date(date.seconds * 1000).toLocaleDateString();
  }
  return new Date(date).toLocaleDateString();
};

export default function SubmissionsPage() {
  const {submissions}=useSubmissions();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const usersList = Array.from(
    new Map(
      submissions.map((s) => [s.submittedBy, s.userName])
    )
  ).map(([id, name]) => ({ id, name }));

  const filteredSubmissions = submissions.filter((s) =>
    (s.userName || "").toLowerCase().includes(search.toLowerCase())
  );

return (
<div className="space-y-4">
  <div className="relative w-80">
    <input
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setShowDropdown(true);
      }}
      placeholder="Search user..."
      className="w-full border px-3 py-2 rounded"
    />

    {showDropdown && search && (
      <div className="absolute bg-white border w-full mt-1 rounded shadow z-10">
        {usersList
          .filter((u) =>
            u.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((u) => (
            <div
              key={u.id}
              onClick={() => {
                setSearch(u.name);
                setShowDropdown(false);
              }}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {u.name}
            </div>
          ))}
      </div>
    )}
  </div>

  {filteredSubmissions.map((s) => (
    <div key={s.id} className="border rounded p-4 space-y-2">
      <h3 className="font-semibold">{String(s.taskTitle)}</h3>
      <p>User: {s.userName}</p>
      <p>Status: {String(s.approval)}</p>
      <p>Deadline: {formatDate(s.taskDeadline)}</p>
      
      <button
        onClick={() => router.push(`/dashboard/admin/userDetails/${s.submittedBy}`)}
        className="text-blue-600 text-sm underline"
      >
        View User Details
      </button>
    </div>
  ))}
</div>
);
}

