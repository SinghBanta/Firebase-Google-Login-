"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase";
import { useParams } from "next/navigation";

function formatDate(timestamp: any): string {
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString();
}

export default function UserDetailsPage() {
  const { uid } = useParams();
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // user info
      const userSnap = await getDoc(doc(db, "users", uid as string));
      console.log(userSnap.data());
      setUser(userSnap.data());

      // submissions by user
      const q = query(
        collection(db, "submissions"),
        where("submittedBy", "==", uid)
      );
      const snap = await getDocs(q);

      setTasks(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    };

    fetchData();
  }, [uid]);

  if (!user) return null;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{user.name}</h1>
      <p>{user.email}</p>

      <div className="space-y-4">
        {tasks.map((t) => {
          const delay =
            t.submittedAt.seconds - t.taskDeadline.seconds;

          return (
            <div key={t.id} className="border rounded p-4">
              <h3 className="font-semibold">{t.taskTitle}</h3>
              <p>Completed: {formatDate(t.submittedAt)}</p>
              <p>Deadline: {formatDate(t.taskDeadline)}</p>
              <p>
                Delay:{" "}
                {delay > 0
                  ? `${Math.floor(delay / 3600)} hrs late`
                  : "On time"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
