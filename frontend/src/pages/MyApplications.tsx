import { useState, useEffect } from "react";
import api from "../api/axios";
import type { Application } from "../types/application";
import Navbar from "../components/Navbar";

const statusColors: Record<string, string> = {
  APPLIED: "bg-slate-100 text-slate-600",
  UNDER_REVIEW: "bg-navy/10 text-navy",
  SHORTLISTED: "bg-gold-light text-navy-dark",
  INTERVIEW_SCHEDULED: "bg-gold text-navy-dark",
  SELECTED: "bg-institution-green/15 text-institution-green",
  REJECTED: "bg-brick/15 text-brick",
};

export default function MyApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ data: Application[] }>("/applications/mine").then((res) => {
      setApplications(res.data.data);
      setLoading(false);
    });
  }, []);

  if (loading)
    return <p className="text-slate-500 p-8">Loading your applications...</p>;

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-4 sm:py-8">
        <h1 className="font-display text-2xl font-semibold text-navy mb-6">
          My Applications
        </h1>

        {applications.length === 0 && (
          <p className="text-slate-500">You haven't applied to any jobs yet.</p>
        )}

        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-navy flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-slate-800">{app.job.title}</p>
                <p className="text-sm text-slate-500">{app.job.company.name}</p>
                {app.interviewDate && (
                  <p className="text-xs text-slate-400 mt-1">
                    Interview: {new Date(app.interviewDate).toLocaleString()}
                  </p>
                )}
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[app.status]}`}
              >
                {app.status.replace("_", " ")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
