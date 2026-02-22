import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { uploadPDFs } from "../cloudinary/cloudinary";
import { toast } from "react-hot-toast";
import Skeleton from "react-loading-skeleton";

export default function SubmitAssignment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  // Fetch assignment + check submission
  useEffect(() => {
    const fetchAssignment = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "assignments", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setAssignment(data);

        if (data.submissions?.[user.uid]?.status === "completed") {
          setAlreadySubmitted(true);
        }
      }
    };

    fetchAssignment();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let fileUrls = [];
      if (files.length > 0) fileUrls = await uploadPDFs(files);

      const docRef = doc(db, "assignments", id);

      await updateDoc(docRef, {
        [`submissions.${auth.currentUser.uid}`]: {
          status: "completed",
          submittedAt: serverTimestamp(),
          fileUrls,
        },
      });

      toast.success("Assignment submitted successfully!");

      // Prevent re-submit
      setAlreadySubmitted(true);

      navigate("/assignments");
      window.location.reload(); // refresh UI
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit assignment");
    }

    setLoading(false);
  };

  if (!assignment)
    return (
      <div className="mx-auto mt-8 max-w-3xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <Skeleton height={30} width="55%" />
          <div className="mt-4 space-y-2">
            <Skeleton height={14} />
            <Skeleton height={14} width="90%" />
            <Skeleton height={14} width="80%" />
          </div>
          <div className="mt-4">
            <Skeleton height={28} width={180} borderRadius={999} />
          </div>
          <div className="mt-6 border-t border-slate-200 pt-6">
            <Skeleton height={44} borderRadius={12} />
            <div className="mt-4">
              <Skeleton height={40} width={180} borderRadius={12} />
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 text-white">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-200">Assignment</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Submit Work</h1>
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

      <div className="mx-auto mt-8 max-w-3xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-emerald-50 via-white to-cyan-50 p-6 sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {assignment.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            {assignment.description}
          </p>
          <p className="mt-4 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 sm:text-sm">
            Due Date: {assignment.dueDate}
          </p>
        </div>

        <div className="border-t border-slate-200 p-6 sm:p-8">
          {alreadySubmitted ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700 sm:text-base">
              Submitted. You have already uploaded this assignment.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="text-sm font-semibold text-slate-800">
                  Upload PDF files
                </span>
                <input
                  type="file"
                  accept="application/pdf"
                  multiple
                  onChange={(e) => setFiles(Array.from(e.target.files))}
                  className="mt-2 block w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-emerald-700 hover:border-slate-400 focus:outline-none"
                  required
                />
              </label>

              <button
                disabled={loading}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
              >
                {loading ? "Submitting..." : "Submit Assignment"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
