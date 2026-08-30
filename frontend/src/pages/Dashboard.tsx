import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import RecruiterCompanyPanel from "../components/RecruiterCompanyPanel";
import AdminCompanyApprovals from "../components/AdminCompanyApprovals";
import RecruiterJobPanel from "../components/RecruiterJobPanel";
import AdminStats from "../components/AdminStats";
import AdminJobApprovals from "../components/AdminJobApprovals";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <div className="max-w-2xl mx-auto px-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-navy">
          <h1 className="font-display text-xl font-semibold text-navy">
            Welcome, {user?.email}
          </h1>
          <p className="text-slate-500 mt-1 font-mono text-xs uppercase tracking-wide">
            Role: {user?.role}
          </p>
        </div>

        {user?.role === "RECRUITER" && (
          <>
            <RecruiterCompanyPanel />
            <RecruiterJobPanel />
          </>
        )}
        {user?.role === "ADMIN" && (
          <>
            <div className="mt-4">
              <AdminStats />
            </div>
            <AdminCompanyApprovals />
            <AdminJobApprovals />
          </>
        )}
      </div>
    </div>
  );
}
