import { useState, useEffect } from "react";
import api from "../api/axios";
import type { Application } from "../types/application";

const statusColors: Record<string, string> = {
  APPLIED: "bg-slate-100 text-slate-600",
  UNDER_REVIEW: "bg-blue-100 text-blue-700",
  SHORTLISTED: "bg-purple-100 text-purple-700",
  INTERVIEW_SCHEDULED: "bg-yellow-100 text-yellow-700",
  SELECTED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
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
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">
          My Applications
        </h1>

        {applications.length === 0 && (
          <p className="text-slate-500">You haven't applied to any jobs yet.</p>
        )}

        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white p-5 rounded-lg shadow-md flex items-center justify-between"
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
