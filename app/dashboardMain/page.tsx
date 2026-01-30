// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/app/context/AuthContext";
// import { db } from "@/app/firebase";

// import {
//   collection,
//   getDocs,
//   doc,
//   updateDoc,
// } from "firebase/firestore";

// type UserType = {
//   id: string;
//   name?: string;
//   email?: string;
//   role: "admin" | "user";
// };

// export default function DashboardPage() {
//   const { user, role } = useAuth();
//   const router = useRouter();

//   const [users, setUsers] = useState<UserType[]>([]);
//   const [loading, setLoading] = useState(true);

//   // 🔐 Redirect if not logged in
//   useEffect(() => {
//     if (user === null) {
//       router.replace("/auth/login");
//     }
//   }, [user, router]);

//   // 👑 Fetch users (ADMIN ONLY)
//   useEffect(() => {
//     if (role !== "admin") {
//       setLoading(false);
//       return;
//     }

//     const fetchUsers = async () => {
//       try {
//         const snap = await getDocs(collection(db, "users"));

//         const list = snap.docs.map((doc) => ({
//           id: doc.id,
//           ...(doc.data() as Omit<UserType, "id">),
//         }));

//         setUsers(list);
//       } catch (err) {
//         console.error("Failed to fetch users:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, [role]);

//   // 🔁 Change role (ADMIN ONLY)
//   const updateRole = async (
//     uid: string,
//     newRole: "admin" | "user"
//   ) => {
//     try {
//       await updateDoc(doc(db, "users", uid), {
//         role: newRole,
//       });

//       // Update UI instantly
//       setUsers((prev) =>
//         prev.map((u) =>
//           u.id === uid ? { ...u, role: newRole } : u
//         )
//       );
//     } catch (err) {
//       console.error("Role update failed:", err);
//     }
//   };

//   if (!user || !role) {
//     return <p className="p-6">Loading...</p>;
//   }

//   return (
//     <div className="p-6 space-y-10">

//       {/* 👤 USER DASHBOARD (VISIBLE TO ALL) */}
//       <section className="border rounded-lg p-5">
//         <h1 className="text-2xl font-bold">Dashboard</h1>

//         <p className="text-gray-600 mt-1">
//           Welcome, <b>{user.displayName}</b>
//         </p>

//         <p className="text-sm text-gray-500 mt-1">
//           Your role: <b>{role}</b>
//         </p>
//       </section>

//       {/* 👑 ADMIN PANEL */}
//       {role === "admin" && (
//         <section className="border rounded-lg p-5">
//           <h2 className="text-xl font-semibold mb-4">
//             Admin Panel – User Management
//           </h2>

//           {loading ? (
//             <p>Loading users...</p>
//           ) : users.length === 0 ? (
//             <p className="text-gray-500">
//               No users found
//             </p>
//           ) : (
//             <div className="space-y-3">
//               {users.map((u) => (
//                 <div
//                   key={u.id}
//                   className="flex justify-between items-center border p-3 rounded"
//                 >
//                   <div>
//                     <p className="font-medium">
//                       {u.name || "No Name"}
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       {u.email}
//                     </p>
//                     <p className="text-xs mt-1">
//                       Role: <b>{u.role}</b>
//                     </p>
//                   </div>

//                   {/* 🚫 Prevent admin changing own role */}
//                   {/* {u.id === user.uid ? (
//                     <span className="text-xs text-gray-400">
//                       You
//                     </span>
//                   ) : */}
//                   { u.role === "user" ? (
//                     <button
//                       onClick={() =>
//                         updateRole(u.id, "admin")
//                       }
//                       className="bg-green-600 text-white px-3 py-1 rounded"
//                     >
//                       Make Admin
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() =>
//                         updateRole(u.id, "user")
//                       }
//                       className="bg-orange-600 text-white px-3 py-1 rounded"
//                     >
//                       Remove Admin
//                     </button>
//                   )}
//                 </div>
                    
//               ))}
//             </div>
//           )}
//         </section>
//       )}
//     </div>
//   );
// }


// "use client";

// import { useEffect, useState } from "react";
// import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
// import { db } from "@/app/firebase";
// import { useAuth } from "@/app/context/AuthContext";

// type UserType = {
//   id: string;
//   name?: string;
//   email?: string;
//   role: "admin" | "user";
// };

// export default function ManageAccess() {
//   const { user, role } = useAuth();

//   const [users, setUsers] = useState<UserType[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [updatingId, setUpdatingId] = useState<string | null>(null);

//   // 🔐 Only admins can load this component
//   useEffect(() => {
//     if (role !== "admin") {
//       setLoading(false);
//       return;
//     }

//     const unsub = onSnapshot(collection(db, "users"), (snap) => {
//       const list = snap.docs.map((doc) => ({
//         id: doc.id,
//         ...(doc.data() as Omit<UserType, "id">),
//       }));
//       setUsers(list);
//       setLoading(false);
//     });

//     return () => unsub();
//   }, [role]);

//   const updateRole = async (uid: string, newRole: "admin" | "user") => {
//     if (uid === user?.uid) {
//       alert("You cannot change your own role ❌");
//       return;
//     }

//     try {
//       setUpdatingId(uid);
//       await updateDoc(doc(db, "users", uid), { role: newRole });
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   if (role !== "admin") {
//     return (
//       <div className="p-6 text-red-600 font-medium">
//         Access denied. Admins only.
//       </div>
//     );
//   }

//   if (loading) {
//     return <p className="p-6">Loading users...</p>;
//   }

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold">Manage User Access</h2>

//       {/* 👑 Current Admin */}
//       <div className="border rounded-lg p-4 bg-gray-50">
//         <h3 className="font-semibold mb-2">You (Admin)</h3>
//         <p className="text-sm">{user?.displayName}</p>
//         <p className="text-sm text-gray-500">{user?.email}</p>
//         <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
//           ADMIN
//         </span>
//       </div>

//       {/* 👥 Other Users */}
//       <div className="space-y-3">
//         {users
//           .filter((u) => u.id !== user?.uid)
//           .map((u) => (
//             <div
//               key={u.id}
//               className="flex justify-between items-center border p-4 rounded-lg"
//             >
//               <div>
//                 <p className="font-medium">{u.name || "No Name"}</p>
//                 <p className="text-sm text-gray-500">{u.email}</p>
//                 <p className="text-xs mt-1">
//                   Role: <b>{u.role}</b>
//                 </p>
//               </div>

//               {u.role === "user" ? (
//                 <button
//                   disabled={updatingId === u.id}
//                   onClick={() => updateRole(u.id, "admin")}
//                   className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
//                 >
//                   Make Admin
//                 </button>
//               ) : (
//                 <button
//                   disabled={updatingId === u.id}
//                   onClick={() => updateRole(u.id, "user")}
//                   className="bg-orange-600 text-white px-3 py-1 rounded disabled:opacity-50"
//                 >
//                   Remove Admin
//                 </button>
//               )}
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// }

