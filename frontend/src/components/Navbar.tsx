import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <div className="bg-navy mb-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-y-3">
        <Link
          to="/dashboard"
          className="font-display font-semibold text-white tracking-tight mr-4 sm:mr-8"
        >
          Placement Office
        </Link>
        <div className="flex flex-wrap gap-3 sm:gap-5 items-center text-sm">
          <Link
            to="/dashboard"
            className="text-gold-light hover:text-gold transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/jobs"
            className="text-gold-light hover:text-gold transition-colors"
          >
            Browse Jobs
          </Link>
          {user.role === "STUDENT" && (
            <>
              <Link
                to="/profile"
                className="text-gold-light hover:text-gold transition-colors"
              >
                My Profile
              </Link>
              <Link
                to="/my-applications"
                className="text-gold-light hover:text-gold transition-colors"
              >
                My Applications
              </Link>
            </>
          )}
          <span className="font-mono text-xs uppercase tracking-wider text-gold border border-gold/40 rounded px-2 py-1">
            {user.role}
          </span>
          <button
            onClick={logout}
            className="bg-gold text-navy-dark font-medium px-3 py-1.5 rounded hover:bg-gold-light transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
