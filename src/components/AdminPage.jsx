// AdminPage.jsx
import { auth } from "../firebase/firebase.js";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.js";

export default function AdminPage() {
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
      if (docSnap.exists() && docSnap.data().role === "admin") {
        setUserData(docSnap.data());
        console.log("Admin data loaded:", docSnap.data());
      } else {
        navigate("/"); // unauthorized access
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm text-slate-600">
          Loading admin dashboard...
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
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="grid md:grid-cols-3 gap-5">
          <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
            <p className="text-slate-500 text-sm">Total Students</p>
            <p className="text-3xl font-semibold text-slate-900 mt-2">1,240</p>
            <p className="text-emerald-600 text-sm mt-2">+6% this month</p>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
            <p className="text-slate-500 text-sm">Total Teachers</p>
            <p className="text-3xl font-semibold text-slate-900 mt-2">86</p>
            <p className="text-cyan-600 text-sm mt-2">+2 new hires</p>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
            <p className="text-slate-500 text-sm">Open Requests</p>
            <p className="text-3xl font-semibold text-slate-900 mt-2">14</p>
            <p className="text-amber-600 text-sm mt-2">3 urgent</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Recent Activities</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">New student registrations</span>
                <span className="text-slate-900 font-medium">+24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Role updates approved</span>
                <span className="text-slate-900 font-medium">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Pending support tickets</span>
                <span className="text-slate-900 font-medium">5</span>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <button className="rounded-lg border border-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-50">Create Notice</button>
              <button className="rounded-lg border border-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-50">Approve Users</button>
              <button className="rounded-lg border border-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-50">Assign Roles</button>
              <button className="rounded-lg border border-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-50">View Reports</button>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">System Overview</h2>
          <div className="mt-4 grid md:grid-cols-4 gap-4 text-sm">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-slate-500">Active Sessions</p>
              <p className="text-xl font-semibold text-slate-900 mt-1">312</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-slate-500">Server Health</p>
              <p className="text-xl font-semibold text-slate-900 mt-1">99.9%</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-slate-500">Announcements</p>
              <p className="text-xl font-semibold text-slate-900 mt-1">4</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-slate-500">Role</p>
              <p className="text-xl font-semibold text-slate-900 mt-1 capitalize">{userData.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
