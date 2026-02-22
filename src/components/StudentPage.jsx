// StudentPage.jsx
import { auth } from "../firebase/firebase.js";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.js";

export default function StudentPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/");
        return;
      }
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().role === "student") {
        setUserData(docSnap.data());
      } else {
        navigate("/"); // unauthorized access
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm text-slate-600">
          Loading student dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-10 flex items-center justify-between">
          <div>
            <p className="text-emerald-300 text-xs uppercase tracking-[0.2em]">Student Dashboard</p>
            <h1 className="text-3xl font-semibold mt-2">Hello, {userData.name}</h1>
            <p className="text-slate-300 mt-1">Access your assignments, announcements, and class messages.</p>
          </div>
          <div className="flex items-center gap-4">
            {userData.imageUrl && (
              <img
                src={userData.imageUrl}
                alt="Profile"
                className="w-14 h-14 rounded-full border-2 border-emerald-300 object-cover"
              />
            )}
            <button onClick={handleLogout} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg">
              Logout
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Account Role</p>
          <p className="mt-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold capitalize text-emerald-700">
            {userData.role}
          </p>
          <p className="mt-4 text-sm text-slate-600">
            Use the quick actions below to submit assignments, check announcements, and stay connected with your class.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <button
              onClick={() => navigate("/assignments")}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-slate-700 transition hover:bg-slate-50"
            >
              View Assignments
            </button>
            <button
              onClick={() => navigate("/announcements")}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-slate-700 transition hover:bg-slate-50"
            >
              View Announcements
            </button>
            <button
              onClick={() => navigate("/class-messages")}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-slate-700 transition hover:bg-slate-50"
            >
              Class Messages
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-slate-700 transition hover:bg-slate-50"
            >
              My Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

