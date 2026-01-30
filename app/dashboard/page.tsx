// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/app/context/AuthContext";
// import SelectFieldModal from "@/app/components/SelectFieldModal";

// export default function DashboardPage() {
//   const { role, field, user } = useAuth();
//   const router = useRouter();

//   // Debug logging
//   console.log("Dashboard - user:", user?.uid, "role:", role, "field:", field);

//   // ⛔ Wait until auth loads
//   if (!user || role === null) {
//     console.log("Waiting for auth...");
//     return null;
//   }

//   // 👑 Admin direct redirect
//   if (role === "admin") {
//     console.log("Redirecting admin...");
//     router.replace("/dashboard/admin");
//     return null;
//   }

//   // 👤 User but field NOT selected → show modal
//   if (role === "user" && (field === null || field === undefined)) {
//     console.log("Showing modal for field selection");
//     return <SelectFieldModal />;
//   }

//   // 👤 User with field selected → redirect to their dashboard
//   if (role === "user" && field === "developer") {
//     console.log("Redirecting to developer dashboard");
//     router.replace("/dashboard/developer");
//     return null;
//   }

//   if (role === "user" && field === "digital_marketing") {
//     console.log("Redirecting to digital marketing dashboard");
//     router.replace("/dashboard/digital-marketing");
//     return null;
//   }

//   return null;
// }