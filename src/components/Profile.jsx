import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";


export default function Profile() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    };

    fetchUser();
  }, []);

  if (!userData) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="animate-pulse space-y-4">
            <div className="mx-auto h-20 w-20 rounded-full bg-slate-200" />
            <div className="mx-auto h-4 w-40 rounded bg-slate-200" />
            <div className="mx-auto h-3 w-56 rounded bg-slate-200" />
            <div className="h-20 rounded-xl bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  const initials = userData?.name
    ? userData.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/40 to-cyan-50/40 px-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
          <div className="h-28 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

          <div className="px-6 pb-8 md:px-10">
            <div className="-mt-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="flex items-end gap-4">
                <div className="relative">
                  {userData.photoURL ? (
                    <img
                      src={userData.photoURL}
                      alt="Profile"
                      className="h-28 w-28 rounded-2xl border-4 border-white object-cover shadow-lg"
                    />
                  ) : (
                    <div className="grid h-28 w-28 place-items-center rounded-2xl border-4 border-white bg-slate-700 text-3xl font-bold text-white shadow-lg">
                      {initials}
                    </div>
                  )}
                </div>

                <div className="pb-1">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                    {userData.name || "Unnamed User"}
                  </h1>
                  <p className="text-sm text-slate-500">{userData.email || "No email added"}</p>
                  <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    {userData.role || "user"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
  <Link
    to={
      userData.role === "admin"
        ? "/admin"
        : userData.role === "teacher"
        ? "/teacher"
        : userData.role === "student"
        ? "/student"
        : "/"
    }
    className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 md:w-auto"
  >
    ← Back Home
  </Link>

  <Link
    to="/edit-profile"
    className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 md:w-auto"
  >
    Edit Profile
  </Link>
</div>

            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Account Type</p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {(userData.role || "user").toUpperCase()}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Member Since</p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {userData.createdAt
                    ? userData.createdAt.toDate().toLocaleDateString()
                    : "Date unavailable"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</p>
                <p className="mt-1 text-base font-semibold text-emerald-600">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
