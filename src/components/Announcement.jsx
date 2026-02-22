import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { uploadImages } from "../cloudinary/cloudinary";
import { toast } from "react-hot-toast";

export default function AddAnnouncement() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return toast.error("Fill all fields");

    setLoading(true);
    try {
      let imageUrls = [];
      if (images.length > 0) imageUrls = await uploadImages(Array.from(images));

      await addDoc(collection(db, "announcements"), {
        title,
        description,
        imageUrls,
        createdAt: serverTimestamp(),
      });

      toast.success("Announcement added");
      setTitle("");
      setDescription("");
      setImages([]);
      navigate("/admin");
    } catch (err) {
      console.error(err);
      toast.error("Error adding announcement");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 text-white">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-6 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-200">Admin Tools</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Create Announcement</h1>
          </div>
          <Link
            to="/admin"
            className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/20"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm text-slate-500">Share updates with all users in a clear and structured format.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Exam schedule update"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <textarea
                rows="5"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write announcement details..."
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
            </div>

            <label className="block rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <span className="font-medium text-slate-700">Attach Images (optional)</span>
              <p className="mt-1 text-xs text-slate-500">
                {images.length > 0 ? `${images.length} file(s) selected` : "PNG/JPG images for richer announcement cards"}
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages(Array.from(e.target.files || []))}
                className="mt-3 block w-full text-xs"
              />
            </label>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Uploading..." : "Publish Announcement"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
