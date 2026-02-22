// AdminPage.jsx
import { auth } from "../firebase/firebase.js";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase.js";
import Skeleton from "react-loading-skeleton";

export default function AdminPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [announcementsCount, setAnnouncementsCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [teachersCount, setTeachersCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/");
        return;
      }
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().role === "admin") {
        setUserData(docSnap.data());

        // for announcement count
        const announcementsSnap = await getDocs(collection(db, "announcements"));
        setAnnouncementsCount(announcementsSnap.size);

        // for students and teachers count
        const usersSnap = await getDocs(collection(db, "users"));

        let students = 0;
        let teachers = 0;

        usersSnap.forEach((docItem) => {
          const role = docItem.data().role;
          if (role === "student") students++;
          if (role === "teacher") teachers++;
        });

        setStudentsCount(students);
        setTeachersCount(teachers);
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
      <div className="min-h-screen bg-slate-50 px-6 py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <Skeleton height={14} width={180} />
            <Skeleton className="mt-3" height={34} width="40%" />
            <Skeleton className="mt-3" height={14} width="55%" />
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <Skeleton height={14} width={110} />
              <Skeleton className="mt-3" height={34} width={70} />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <Skeleton height={14} width={110} />
              <Skeleton className="mt-3" height={34} width={70} />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <Skeleton height={14} width={110} />
              <Skeleton className="mt-3" height={34} width={70} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-10 flex items-center justify-between">
          <div>
            <p className="text-emerald-300 text-xs uppercase tracking-[0.2em]">Admin Panel</p>
            <h1 className="text-3xl font-semibold mt-2">Welcome, {userData.name}</h1>
            <p className="text-slate-300 mt-1">Manage users, roles, and system activity.</p>
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
        <div className="grid md:grid-cols-3 gap-5">
          <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
            <p className="text-slate-500 text-sm">Total Students</p>
            <p className="text-3xl font-semibold text-slate-900 mt-2">{studentsCount}</p>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
            <p className="text-slate-500 text-sm">Total Teachers</p>
            <p className="text-3xl font-semibold text-slate-900 mt-2">{teachersCount}</p>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
            <p className="text-slate-500 text-sm">Announcements</p>
            <p className="text-3xl font-semibold text-slate-900 mt-2">{announcementsCount}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <button
              onClick={() => navigate("/add-announcement")}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-slate-700 transition hover:bg-slate-50"
            >
              Create Announcement
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
