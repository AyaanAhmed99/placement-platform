import { useAuth } from "../context/AuthContext";
import RecruiterCompanyPanel from "../components/RecruiterCompanyPanel";
import AdminCompanyApprovals from "../components/AdminCompanyApprovals";
import RecruiterJobPanel from "../components/RecruiterJobPanel";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">
              Welcome, {user?.email}
            </h1>
            <p className="text-slate-500 mt-1">Role: {user?.role}</p>
          </div>
          <div className="flex gap-2">
            <a
              href="/jobs"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Browse Jobs
            </a>
            <button
              onClick={logout}
              className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-900"
            >
              Log out
            </button>
          </div>
        </div>

        {user?.role === "RECRUITER" && (
          <>
            <RecruiterCompanyPanel />
            <RecruiterJobPanel />
          </>
        )}
        {user?.role === "ADMIN" && <AdminCompanyApprovals />}
      </div>
    </div>
  );
}
