import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase.js";
import Skeleton from "react-loading-skeleton";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);


  useEffect(() => {
  const getRole = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists()) {
      setRole(snap.data().role);
    }
  };

  getRole();
}, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        setAnnouncements(snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() })));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 text-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-6 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-200">Updates</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Announcements</h1>
          </div>
          <Link
            to={
  role === "admin"
    ? "/admin"
    : role === "teacher"
    ? "/teacher"
    : role === "student"
    ? "/student"
    : "/"
}

            className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/20"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-5xl gap-5 px-4 py-8 sm:px-6">
        {loading ? (
          <div className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <Skeleton height={26} width="45%" />
              <Skeleton className="mt-2" height={14} width={140} />
              <div className="mt-5 space-y-2">
                <Skeleton height={14} />
                <Skeleton height={14} width="88%" />
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <Skeleton height={26} width="38%" />
              <Skeleton className="mt-2" height={14} width={140} />
              <div className="mt-5 space-y-2">
                <Skeleton height={14} />
                <Skeleton height={14} width="82%" />
              </div>
            </div>
          </div>
        ) : announcements.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">No announcements yet</h2>
            <p className="mt-2 text-sm text-slate-500">Published announcements will appear here.</p>
          </div>
        ) : (
          announcements.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">
                <h2 className="text-xl font-semibold text-slate-900">{item.title}</h2>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleString() : "Just now"}
                </p>
              </div>

              <div className="px-5 py-5 sm:px-6">
                <p className="text-sm leading-relaxed text-slate-700 sm:text-base">{item.description}</p>

                {item.imageUrls?.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {item.imageUrls.map((url, idx) => (
                      <div key={idx} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                        <img src={url} alt="announcement" className="h-44 w-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
