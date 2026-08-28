import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./context/AuthContext";
import Jobs from "./pages/Jobs";
import MyApplications from "./pages/MyApplications";
import JobApplicants from "./pages/JobApplicants";

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" /> : <Register />}
      />
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="*"
        element={<Navigate to={user ? "/dashboard" : "/login"} />}
      />
      <Route
        path="/jobs"
        element={user ? <Jobs /> : <Navigate to="/login" />}
      />
      <Route
        path="/my-applications"
        element={user ? <MyApplications /> : <Navigate to="/login" />}
      />
      <Route
        path="/jobs/:jobId/applicants"
        element={user ? <JobApplicants /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}
