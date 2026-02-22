// App.jsx
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import Signup from "./components/Signup";
import Login from "./components/Login";
import StudentPage from "./components/StudentPage";
import TeacherPage from "./components/TeacherPage";
import AdminPage from "./components/AdminPage";
import ProtectedRoute from "./components/ProtectedRoute";

import { authListener } from "./firebase/authListener";
import Assignments from "./components/Assignments";
import Announcements from "./components/Announcements";
import AddAnnouncement from "./components/Announcement";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import ClassMessages from "./components/ClassMessages";
import SubmitAssignment from "./components/SubmitAssignment";
import ViewResults from "./components/ViewResults";



function AppWrapper() {
  const navigate = useNavigate();

  // 🔐 Global auth listener
  useEffect(() => {
    authListener(navigate);
  }, [navigate]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Login />} />

      {/* Protected routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <StudentPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher"
        element={
          <ProtectedRoute role="teacher">
            <TeacherPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route path="/add-announcement" element={<AddAnnouncement />} />
<Route path="/announcements" element={<Announcements/>} />
<Route path="/profile" element={<Profile />} />
<Route path="/edit-profile" element={<EditProfile />} />
<Route path="/class-messages" element={<ClassMessages />} />
<Route path="/submit-assignment/:id" element={<SubmitAssignment />} />
<Route path="/view-results/:id" element={<ViewResults />} />



      <Route
  path="/assignments"
  element={
    <ProtectedRoute>
      <Assignments />
    </ProtectedRoute>
  }
/>

    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { fontSize: "14px" },
        }}
      />
    </Router>
  );
}
