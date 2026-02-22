import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import { deleteAssignment } from "../firebase/deleteAssignment";
import { useNavigate } from "react-router-dom";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [role, setRole] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAssignments, setLoadingAssignments] = useState(true);

  const navigate = useNavigate();

  // Listen auth
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  // Fetch assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const q = query(collection(db, "assignments"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        setAssignments(snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() })));
      } finally {
        setLoadingAssignments(false);
      }
    };
    fetchAssignments();
  }, []);

  // Fetch role
  useEffect(() => {
    const fetchRole = async () => {
      if (!currentUser) return;

      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setRole(docSnap.data().role);
      }
    };
    fetchRole();
  }, [currentUser]);

  // Delete
  const handleDelete = async (id) => {
    await deleteAssignment(id);
    setAssignments(assignments.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 text-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-200">Coursework</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Assignments</h1>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/20"
          >
            Back
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10 grid gap-6">
        {loadingAssignments ? (
          // <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          //   <p className="text-sm font-medium text-slate-600">Loading assignments...</p>
          // </div>
          <div>
    <Skeleton height={30} width={200} />
    <Skeleton count={3} />
  </div>
        ) : assignments.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">No assignments yet</h2>
            <p className="mt-2 text-sm text-slate-500">New assignments will appear here.</p>
          </div>
        ) : (
          assignments.map((a) => (
          <article
            key={a.id}
            className="rounded-2xl border bg-white p-6 shadow"
          >
            <h2 className="text-xl font-semibold">{a.title}</h2>
            <p className="text-slate-600">{a.description}</p>
            <p className="text-sm text-rose-600 mt-1">Due: {a.dueDate}</p>

            {/* STUDENT BUTTON */}
            {role === "student" && currentUser && (
              <div className="mt-4">
                {a.submissions?.[currentUser.uid]?.status === "completed" ? (
                  <button
                    disabled
                    className="bg-gray-400 text-white px-4 py-2 rounded-xl cursor-not-allowed"
                  >
                    Submitted ✓
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/submit-assignment/${a.id}`)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700"
                  >
                    Submit Assignment
                  </button>
                )}
              </div>
            )}

            {/* TEACHER BUTTON */}
            {role === "teacher" && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => navigate(`/view-results/${a.id}`)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
                >
                  View Results
                </button>

                <button
                  onClick={() => handleDelete(a.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </article>
          ))
        )}
      </div>
    </div>
  );
}
