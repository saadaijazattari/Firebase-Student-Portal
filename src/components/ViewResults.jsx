import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Skeleton from "react-loading-skeleton";

export default function ViewResults() {
  const { id } = useParams(); // assignmentId
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [studentNames, setStudentNames] = useState({}); // uid -> name

  useEffect(() => {
    const fetchAssignment = async () => {
      const docRef = doc(db, "assignments", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setAssignment(data);

        const submissions = data.submissions || {};

        // Fetch all student names
        const nameMap = {};

        for (const studentId of Object.keys(submissions)) {
          const userRef = doc(db, "users", studentId);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            nameMap[studentId] = userSnap.data().name || "No Name";
          } else {
            nameMap[studentId] = "Unknown Student";
          }
        }

        setStudentNames(nameMap);
      }
    };

    fetchAssignment();
  }, [id]);

  if (!assignment)
    return (
      <div className="mx-auto mt-8 max-w-5xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <Skeleton height={30} width="45%" />
          <div className="mt-4 space-y-2">
            <Skeleton height={14} />
            <Skeleton height={14} width="90%" />
          </div>
          <div className="mt-6 border-t border-slate-200 pt-6 space-y-3">
            <Skeleton height={70} borderRadius={16} />
            <Skeleton height={70} borderRadius={16} width="94%" />
          </div>
        </div>
      </div>
    );

  const submissions = assignment.submissions || {};

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 text-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-200">Assignment</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">View Results</h1>
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

      <div className="mx-auto mt-8 max-w-5xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-emerald-50 via-white to-teal-50 p-6 sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {assignment.title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            {assignment.description}
          </p>
        </div>

        <div className="border-t border-slate-200 p-6 sm:p-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
              Submissions
            </h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 sm:text-sm">
              {Object.keys(submissions).length} total
            </span>
          </div>

          {Object.keys(submissions).length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-slate-500">
              No submissions yet
            </p>
          ) : (
            <ul className="space-y-4">
              {Object.entries(submissions).map(([studentId, data]) => (
                <li
                  key={studentId}
                  className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900 sm:text-base">
                      {studentNames[studentId] || <Skeleton width={110} />}
                    </p>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium capitalize text-emerald-700 sm:text-sm">
                      {data.status}
                    </span>
                  </div>

                  {data.fileUrls?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {data.fileUrls.map((url, idx) => (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50"
                        >
                          File {idx + 1}
                        </a>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
