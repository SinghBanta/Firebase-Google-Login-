import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase";

export function useSubmissions() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // 1️⃣ Fetch users
      const usersSnap = await getDocs(collection(db, "users"));
      const usersMap = new Map(
        usersSnap.docs.map(doc => [
          doc.id,
          {
            name: doc.data().name,
            role: doc.data().role,
          },
        ])
      );

      // 2️⃣ Fetch submissions
      const submissionsSnap = await getDocs(collection(db, "submissions"));

      const list = submissionsSnap.docs
        .map(doc => {
          const data = doc.data();
          const user = usersMap.get(data.submittedBy);

          // attach user info
          return {
            id: doc.id,
            ...data,
            userName: user?.name ?? "Unknown",
            userRole: user?.role,
          };
        })
        // 3️⃣ FILTER → ONLY USERS
        .filter(s => s.userRole === "user");

      setSubmissions(list);
      setLoading(false);
    };

    fetchData();
  }, []);

  return { submissions, loading };
}
