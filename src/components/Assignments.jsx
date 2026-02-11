import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      const q = query(
        collection(db, "assignments"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAssignments(list);
    };

    fetchAssignments();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <p className="text-emerald-200 text-xs uppercase tracking-[0.3em]">Assignments</p>
          <h1 className="text-3xl font-semibold mt-2">All Assignments</h1>
          <p className="text-slate-200 mt-2">Review details, due dates, and attachments.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {assignments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
            No assignments found yet.
          </div>
        ) : (
          <div className="grid gap-5">
            {assignments.map((a) => (
              <div key={a.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{a.title}</h2>
                    <p className="text-slate-600 mt-2">{a.description}</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">
                    Due {a.dueDate}
                  </span>
                </div>

                {a.imageUrls && a.imageUrls.length > 0 && (
  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
    {a.imageUrls.map((url, idx) => (
      <img
        key={idx}
        src={url}
        alt={`assignment-${idx}`}
        className="w-full max-h-48 rounded-xl object-cover"
      />
    ))}
  </div>
)}

{a.pdfUrls && a.pdfUrls.length > 0 && (
  <div className="mt-2 flex flex-col gap-1">
    {a.pdfUrls.map((url, idx) => (
      <a
        key={idx}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-emerald-600 hover:underline"
      >
        PDF {idx + 1}
      </a>
    ))}
  </div>
)}



              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
