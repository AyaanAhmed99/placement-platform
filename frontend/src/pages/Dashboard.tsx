import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-xl font-semibold text-slate-800">
          Welcome, {user?.email}
        </h1>
        <p className="text-slate-500 mt-1">Role: {user?.role}</p>
        <button
          onClick={logout}
          className="mt-4 bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-900"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
