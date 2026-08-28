import { useState, useEffect } from "react";
import api from "../api/axios";
import type { Job } from "../types/job";

export default function AdminJobApprovals() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  async function fetchPending() {
    setLoading(true);
    const res = await api.get<{ data: Job[] }>("/jobs/pending");
    setJobs(res.data.data);
    setLoading(false);
  }

  async function approve(id: string) {
    await api.patch(`/jobs/${id}/approve`);
    fetchPending();
  }

  if (loading) return <p className="text-slate-500">Loading pending jobs...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-4">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Pending Jobs
      </h2>

      {jobs.length === 0 && (
        <p className="text-slate-500 text-sm">No jobs waiting for approval.</p>
      )}

      <div className="space-y-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="flex items-center justify-between border-b border-slate-100 pb-3"
          >
            <div>
              <p className="font-medium text-slate-700">{job.title}</p>
              <p className="text-xs text-slate-400">{job.company?.name}</p>
            </div>
            <button
              onClick={() => approve(job.id)}
              className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Approve
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
