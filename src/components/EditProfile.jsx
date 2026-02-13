import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { uploadImage } from "../cloudinary/cloudinary.js";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const navigate = useNavigate();

  // 🔹 Load current user data
  useEffect(() => {
    const loadUser = async () => {
      const user = auth.currentUser;
      if (!user) return navigate("/");

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name || "");
        setPreview(data.imageUrl || "");
      }
    };

    loadUser();
  }, [navigate]);

  // 🔹 Update Profile (Name + Image only)
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const user = auth.currentUser;
      if (!user) return;

      let imageUrl = preview;

      // 🖼 Upload new image if selected
      if (image) {
        imageUrl = await uploadImage(image);
      }

      // 🔹 Update Firestore
      await updateDoc(doc(db, "users", user.uid), {
        name,
        imageUrl,
      });

      alert("Profile updated successfully 🚀");
      navigate("/profile");
    } catch (err) {
      console.log(err);
      alert("Update failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleUpdate}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow border"
      >
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

        {/* 🖼 Image Preview */}
        <div className="flex flex-col items-center mb-4">
          <img
            src={preview || "https://via.placeholder.com/100"}
            alt="preview"
            className="w-24 h-24 rounded-full object-cover border"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files[0]) {
                setImage(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]));
              }
            }}
            className="mt-2"
          />
        </div>

        {/* Name */}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
          required
        />

        <button className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700">
          Update Profile
        </button>
      </form>
    </div>
  );
}
