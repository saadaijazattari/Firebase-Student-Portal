import { useState } from "react";
import { db, auth } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {  uploadImages, uploadPDFs } from "../cloudinary/cloudinary";

export default function AddAssignment({handleClose}) {
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
if (images.length > 0) {
  imageUrls = await uploadImages(images);
}

let pdfUrls = [];
if (pdfs.length > 0) {
  pdfUrls = await uploadPDFs(pdfs);
}

await addDoc(collection(db, "assignments"), {
  title,
  description,
  dueDate,
  imageUrls, // store as array
  pdfUrls,
  teacherId: auth.currentUser.uid,
  createdAt: serverTimestamp(),
});


      alert("Assignment Added ✅");
      handleClose()
      

      setTitle("");
      setDescription("");
      setDueDate("");
      setImages([]); // ✅ sahi

    } catch (error) {
      console.error(error);
      alert("Error adding assignment");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
      <div className="px-6 pt-6 pb-4 border-b border-slate-100">
        <h2 className="text-2xl font-semibold text-slate-900">Add Assignment</h2>
        <p className="text-sm text-slate-500 mt-1">
          Provide the assignment details and an optional cover image.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Title</label>
          <input
            type="text"
            placeholder="Assignment Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea
            placeholder="Write a short description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-27.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Cover Image</label>
            <div className="flex items-center justify-between rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2">
              <span className="text-xs text-slate-500">
  {images.length > 0 ? images.map(img => img.name).join(", ") : "Optional: JPG/PNG up to 5MB"}
  {pdfs.length > 0 ? pdfs.map(pdf => pdf.name).join(", ") : "Optional: PDF files up to 10MB"}
</span>

              <div className="flex flex-col gap-2">

  {/* Image Upload */}
  <label className="cursor-pointer text-sm font-medium text-emerald-600 hover:text-emerald-700">
    Upload Images
    <input
      type="file"
      accept="image/*"
      multiple
      onChange={(e) => setImages(Array.from(e.target.files))}
      className="hidden"
    />
  </label>

  {/* PDF Upload */}
  <label className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700">
    Upload PDFs
    <input
      type="file"
      accept="application/pdf"
      multiple
      onChange={(e) => setPdfs(Array.from(e.target.files))}
      className="hidden"
    />
  </label>

</div>

            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Uploading..." : "Add Assignment"}
          </button>
        </div>
      </form>
    </div>
  );
}
