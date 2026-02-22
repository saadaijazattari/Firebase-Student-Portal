// src/components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase.js";

export default function ProtectedRoute({ children, role }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userRole = docSnap.data().role;

          if (!role || role === userRole) {
            setAllowed(true);
          } else {
            setAllowed(false);
          }
        } else {
          setAllowed(false);
        }
      } catch (err) {
        console.error(err);
        setAllowed(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [role]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-100 px-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm text-slate-600 shadow-sm">
          Checking access...
        </div>
      </div>
    );
  }

  if (!allowed) return <Navigate to="/" replace />;

  return children;
}
