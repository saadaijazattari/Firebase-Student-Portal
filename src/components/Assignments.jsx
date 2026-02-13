import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import { deleteAssignment } from "../firebase/deleteAssignment";
import { Link, useNavigate } from "react-router-dom";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [role, setRole] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

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
      const q = query(collection(db, "assignments"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setAssignments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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

      <div className="mx-auto max-w-6xl px-6 py-10 grid gap-6">
        {assignments.map((a) => (
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
        ))}
      </div>
    </div>
  );
}
