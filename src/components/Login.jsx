// Login.jsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user role
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const role = docSnap.data().role;
        if (role === "student") navigate("/student");
        else if (role === "teacher") navigate("/teacher");
        else navigate("/admin");
      }
    } catch (err) {
      console.log(err);
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900 flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-16 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-4xl bg-white/95 backdrop-blur rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        <div className="hidden md:flex flex-col justify-between bg-slate-900 text-white p-10">
          <div>
            <p className="uppercase tracking-[0.2em] text-emerald-300 text-xs">Student Portal</p>
            <h1 className="text-3xl font-semibold mt-3">Welcome back</h1>
            <p className="text-slate-300 mt-3">
              Secure access for students, teachers, and admins with a clean, focused workspace.
            </p>
          </div>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Fast role-based access
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Profile images supported
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Clean, modern UI
            </div>
          </div>
        </div>

        <form className="p-8 md:p-10" onSubmit={handleLogin}>
          <h2 className="text-2xl font-bold text-slate-900">Login</h2>
          <p className="text-slate-500 mt-2">Sign in to continue to your dashboard.</p>

          <div className="mt-6 space-y-4">
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
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between text-sm">
            <span className="text-slate-500">New here?</span>
            <Link className="text-emerald-700 hover:text-emerald-800 font-medium" to="/signup">
              Create an account
            </Link>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-emerald-600 text-white py-2.5 font-medium shadow hover:bg-emerald-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
