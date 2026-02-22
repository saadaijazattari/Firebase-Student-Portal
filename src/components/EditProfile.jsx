import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase.js";
import { uploadImage } from "../cloudinary/cloudinary.js";

export default function EditProfile() {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return navigate("/");

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setPreview(data.imageUrl || "");
        }
      } finally {
        setLoadingProfile(false);
      }
    };

    loadUser();
  }, [navigate]);

  if (loadingProfile) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-100 px-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm text-slate-600 shadow-sm">
          Loading profile...
        </div>
      </div>
    );
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    setSaving(true);
    try {
      let imageUrl = preview;
      if (image) imageUrl = await uploadImage(image);

      await updateDoc(doc(db, "users", user.uid), { name, imageUrl });
      alert("Profile updated successfully");
      navigate("/profile");
    } catch (err) {
      console.log(err);
      alert("Update failed: " + err.message);
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 text-white">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-6 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-200">Profile</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Edit Profile</h1>
          </div>
          <Link
            to="/profile"
            className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/20"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <form onSubmit={handleUpdate} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
            <img
              src={preview || "https://via.placeholder.com/120"}
              alt="preview"
              className="h-28 w-28 rounded-2xl border-2 border-slate-200 object-cover"
            />

            <label className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600 sm:w-auto">
              <span className="font-medium text-slate-700">Upload New Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setImage(e.target.files[0]);
                    setPreview(URL.createObjectURL(e.target.files[0]));
                  }
                }}
                className="mt-2 block text-xs"
              />
            </label>
          </div>

          <div className="mt-6 space-y-2">
            <label className="text-sm font-medium text-slate-700">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
