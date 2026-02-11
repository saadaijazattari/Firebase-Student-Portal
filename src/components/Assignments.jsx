import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import Navbar from "./Navbar";
import { deleteAssignment } from "../firebase/deleteAssignment";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [role, setRole] = useState("");

  // Fetch assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      const q = query(collection(db, "assignments"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setAssignments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchAssignments();
  }, []);

  // Fetch current user role
  useEffect(() => {
    const fetchRole = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setRole(docSnap.data().role);
      }
    };
    fetchRole();
  }, []);

  // Handle Delete
  const handleDelete = async (id) => {
    await deleteAssignment(id);
    setAssignments(assignments.filter(a => a.id !== id)); // update UI
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.25),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(148,163,184,0.2),transparent_40%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-12">
          <p className="text-xs uppercase tracking-[0.32em] text-emerald-200">
            Assignment Center
          </p>
          <h1 className="mt-3 text-3xl font-semibold md:text-4xl">All Assignments</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-200 md:text-base">
            Review every assignment, check due dates, preview documents, and open
            PDFs directly from this page.
          </p>
          <div className="mt-6 inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-medium text-emerald-100">
            Total: {assignments.length} assignment{assignments.length === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10 grid gap-6">
        {assignments.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800">No assignments yet</h3>
            <p className="mt-2 text-sm text-slate-500">
              New assignments will appear here with attachments and PDF previews.
            </p>
          </div>
        ) : (
          assignments.map((a) => (
            <article
              key={a.id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
            >
              {/* Header */}
              <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-slate-900 md:text-2xl">{a.title}</h2>
                    <p className="max-w-3xl text-sm text-slate-600 md:text-base">{a.description}</p>
                  </div>
                  <span className="inline-flex w-fit items-center rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-xs font-semibold text-rose-700">
                    Due: {a.dueDate}
                  </span>
                </div>
              </div>

              {/* Images */}
              {a.imageUrls?.length > 0 && (
                <section className="space-y-3 p-6 pb-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Images
                  </h3>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {a.imageUrls.map((url, idx) => (
                      <div key={idx} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                        <img
                          src={url}
                          alt={`assignment-${idx}`}
                          className="h-36 w-full object-cover transition duration-300 hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* PDFs */}
              {a.pdfUrls?.length > 0 && (
                <section className="space-y-4 p-6 pt-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    PDF Attachments
                  </h3>

                  {a.pdfUrls.map((url, idx) => (
                    <div
                      key={idx}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                    >
                      <div className="flex flex-col gap-3 border-b border-slate-200 bg-white px-4 py-3 md:flex-row md:items-center md:justify-between">
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                          <img src="/pdf-icon.png" alt="PDF" className="h-5 w-5" />
                          PDF {idx + 1}
                        </span>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-fit items-center rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-700"
                        >
                          View PDF
                        </a>
                      </div>
                    </div>
                  ))}
                </section>
              )}

              {/* ❌ Delete Button — Only Teacher */}
              {role === "teacher" && (
                <div className="p-6">
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
                  >
                    Delete Assignment
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
