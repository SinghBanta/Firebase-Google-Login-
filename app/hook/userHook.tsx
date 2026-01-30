import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

type User = {
    id: string;
    name?: string;
    email?: string;
    role: "admin" | "user";
};

export function useUser(): { user: User | null; loading: boolean } {
    const [loading , setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    // Removed unused role state

    useEffect(()=>{
        const fetchUser = async()=>{
            try{
               const q=query(collection(db,"users"),where("uid","==",auth.currentUser?.uid));
               const snapshot = await getDocs(q);

               const data: User[] = snapshot.docs.map((doc)=>({
                id: doc.id,
                ...(doc.data() as Omit<User,"id">),
               }));
               setUser(data[0] || null);
            }catch(err){
                console.error("Failed to fetch user:", err);    
            }finally{
                setLoading(false);
            }
        }
        fetchUser();
    },[])
    return {user, loading};
}
            


            
