import { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { uploadImages  } from "../cloudinary/cloudinary";
import { useNavigate } from "react-router-dom";


export default function AddAnnouncement() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return alert("Fill all fields");

    setLoading(true);

    try {
      let imageUrls = [];

      if (images.length > 0) {
        imageUrls = await uploadImages(Array.from(images));
      }

      await addDoc(collection(db, "announcements"), {
        title,
        description,
        imageUrls,
        createdAt: serverTimestamp(),
      });

      alert("Announcement Added ✅");
      navigate('/admin')
      setTitle("");
      setDescription("");
      setImages([]);
    } catch (err) {
      console.error(err);
      alert("Error adding announcement");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100">


      <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow mt-10">
        <h2 className="text-2xl font-semibold mb-4">Add Announcement</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Description"
            className="w-full border p-2 rounded"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="file"
            multiple
            onChange={(e) => setImages(e.target.files)}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
          >
            {loading ? "Uploading..." : "Add Announcement"}
          </button>
        </form>
      </div>
    </div>
  );
}
