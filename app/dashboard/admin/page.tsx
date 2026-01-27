"use client";

import { useState } from "react";
import { useRouter} from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import Navbar from "@/app/components/Navbar";


export default function CreateTaskPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedUser, setAssignedUser] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("Pending");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "tasks"), {
        title,
        description,
        assignedUser, // user email
        deadline,
        status,
        createdAt: serverTimestamp(),
      });

      alert("Task created successfully ✅");
      router.push("/dashboard/admin");
    } catch (error) {
      console.error(error);
      alert("Error creating task ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    
    <div className="w-full max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Create New Task</h1>
      
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl border space-y-5"
      >
        {/* TITLE */}
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border rounded-xl"
          required
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border rounded-xl"
          rows={4}
          required
        />


        {/* ASSIGNED USER (EMAIL) */}
        <input
          type="email"
          placeholder="Assigned User Email"
          value={assignedUser}
          onChange={(e) => setAssignedUser(e.target.value)}
          className="w-full p-3 border rounded-xl"
          required
        />

        {/* DEADLINE */}
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full p-3 border rounded-xl"
          required
        />

        {/* STATUS */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-3 border rounded-xl"
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 text-white px-6 py-3 rounded-xl disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </div>
    </>
  );
}
