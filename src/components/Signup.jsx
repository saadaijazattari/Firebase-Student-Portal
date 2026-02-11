// Signup.jsx
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebase.js";
import { uploadImage } from "../cloudinary/cloudinary.js";
// import { doc, setDoc } from "";
import { Link, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // 1️⃣ Upload image to Cloudinary
      const imageUrl = image ? await uploadImage(image) : "";

      // 2️⃣ Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 3️⃣ Save user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role,
        imageUrl
      });
      console.log("Selected file:", image);
      console.log("Cloudinary URL:", imageUrl);

      // 4️⃣ Redirect based on role
      if (role === "student") navigate("/student");
      else if (role === "teacher") navigate("/teacher");
      else navigate("/admin");

    } catch (err) {
      console.log(err);
      alert("Signup failed: " + err.message);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900 flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 right-0 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-4xl bg-white/95 backdrop-blur rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        <div className="hidden md:flex flex-col justify-between bg-slate-900 text-white p-10">
          <div>
            <p className="uppercase tracking-[0.2em] text-emerald-300 text-xs">Join Portal</p>
            <h1 className="text-3xl font-semibold mt-3">Create your account</h1>
            <p className="text-slate-300 mt-3">
              One account gives you the right dashboard for your role.
            </p>
          </div>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Student, Teacher, Admin
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Upload profile photo
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Secure access
            </div>
          </div>
        </div>

        <form className="p-8 md:p-10" onSubmit={handleSignup}>
          <h2 className="text-2xl font-bold text-slate-900">Sign Up</h2>
          <p className="text-slate-500 mt-2">Create your profile in a few steps.</p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-slate-600">Full Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">Email</label>
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">Password</label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">Profile Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    setImage(e.target.files[0]);
                    console.log("File selected:", e.target.files[0]);
                  } else {
                    setImage(null);
                  }
                }}
                className="mt-1 w-full rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-emerald-600 file:px-3 file:py-1.5 file:text-white hover:file:bg-emerald-700"
              />
            </div>
          </div>

          <div className="mt-5">
            <p className="text-sm text-slate-600 mb-2">Choose role</p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <label className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 cursor-pointer ${role === "student" ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600"}`}>
                <input type="radio" value="student" checked={role === "student"} onChange={e => setRole(e.target.value)} className="hidden" />
                Student
              </label>
              <label className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 cursor-pointer ${role === "teacher" ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600"}`}>
                <input type="radio" value="teacher" checked={role === "teacher"} onChange={e => setRole(e.target.value)} className="hidden" />
                Teacher
              </label>
              <label className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 cursor-pointer ${role === "admin" ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600"}`}>
                <input type="radio" value="admin" checked={role === "admin"} onChange={e => setRole(e.target.value)} className="hidden" />
                Admin
              </label>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between text-sm">
            <span className="text-slate-500">Already have an account?</span>
            <Link className="text-emerald-700 hover:text-emerald-800 font-medium" to="/">
              Login
            </Link>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-emerald-600 text-white py-2.5 font-medium shadow hover:bg-emerald-700 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
