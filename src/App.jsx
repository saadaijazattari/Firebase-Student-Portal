// App.jsx
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Signup from "./components/Signup";
import Login from "./components/Login";
import StudentPage from "./components/StudentPage";
import TeacherPage from "./components/TeacherPage";
import AdminPage from "./components/AdminPage";
import ProtectedRoute from "./components/ProtectedRoute";

import { authListener } from "./firebase/authListener";
import Assignments from "./components/Assignments";

function AppWrapper() {
  const navigate = useNavigate();

  // 🔐 Global auth listener
  useEffect(() => {
    authListener(navigate);
  }, []);

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
      <Route
  path="/assignments"
  element={
    <ProtectedRoute role="student">
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
    </Router>
  );
}
