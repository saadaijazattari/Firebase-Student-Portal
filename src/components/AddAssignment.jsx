import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { uploadImages, uploadPDFs } from "../cloudinary/cloudinary";
import { toast } from "react-hot-toast";

export default function AddAssignment({ handleClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [images, setImages] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      let imageUrls = [];
      if (images.length > 0) imageUrls = await uploadImages(images);

      let pdfUrls = [];
      if (pdfs.length > 0) pdfUrls = await uploadPDFs(pdfs);

      await addDoc(collection(db, "assignments"), {
        title,
        description,
        dueDate,
        imageUrls,
        pdfUrls,
        teacherId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      toast.success("Assignment added");
      handleClose();
      setTitle("");
      setDescription("");
      setDueDate("");
      setImages([]);
      setPdfs([]);
    } catch (error) {
      console.error(error);
      toast.error("Error adding assignment");
    }

    setLoading(false);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl">
      <div className="border-b border-slate-100 px-6 pb-4 pt-6">
        <h2 className="text-2xl font-semibold text-slate-900">Add Assignment</h2>
        <p className="mt-1 text-sm text-slate-500">
          Add title, due date, details, and optional image/PDF attachments.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 p-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Title</label>
          <input
            type="text"
            placeholder="Assignment title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea
            placeholder="Write assignment instructions"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-32 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <span className="font-medium text-slate-700">Upload Images</span>
            <p className="mt-1 text-xs text-slate-500">
              {images.length > 0 ? `${images.length} selected` : "Optional: JPG/PNG"}
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImages(Array.from(e.target.files || []))}
              className="mt-2 block w-full text-xs"
            />
          </label>

          <label className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <span className="font-medium text-slate-700">Upload PDFs</span>
            <p className="mt-1 text-xs text-slate-500">
              {pdfs.length > 0 ? `${pdfs.length} selected` : "Optional: assignment documents"}
            </p>
            <input
              type="file"
              accept="application/pdf"
              multiple
              onChange={(e) => setPdfs(Array.from(e.target.files || []))}
              className="mt-2 block w-full text-xs"
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Uploading..." : "Add Assignment"}
          </button>
        </div>
      </form>
    </div>
  );
}
