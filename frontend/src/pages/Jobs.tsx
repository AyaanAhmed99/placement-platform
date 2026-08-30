import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import type { Job } from "../types/job";
import Navbar from "../components/Navbar";

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [applyingTo, setApplyingTo] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    api.get<{ data: Job[] }>("/jobs").then((res) => {
      setJobs(res.data.data);
      setLoading(false);
    });

    if (user?.role === "STUDENT") {
      api
        .get<{ data: { job: { id: string } }[] }>("/applications/mine")
        .then((res) => {
          setAppliedJobIds(new Set(res.data.data.map((a) => a.job.id)));
        });
    }
  }, [user]);

  async function handleApply(jobId: string) {
    setApplyingTo(jobId);
    try {
      await api.post("/applications", { jobId });
      setAppliedJobIds((prev) => new Set(prev).add(jobId));
    } catch {
      alert("Failed to apply. You may have already applied to this job.");
    } finally {
      setApplyingTo(null);
    }
  }

  if (loading) return <p className="text-slate-500 p-8">Loading jobs...</p>;

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-2xl font-semibold text-navy mb-6">
          Open Positions
        </h1>

        {jobs.length === 0 && (
          <p className="text-slate-500">
            No jobs available right now. Check back soon.
          </p>
        )}

        <div className="space-y-4">
          {jobs.map((job) => {
            const alreadyApplied = appliedJobIds.has(job.id);
            return (
              <div
                key={job.id}
                className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-navy"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-navy">
                      {job.title}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {job.company?.name} ·{" "}
                      {job.location ?? "Location not specified"}
                    </p>
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                    {job.jobType.replace("_", " ")}
                  </span>
                </div>

                <p className="text-slate-600 text-sm mt-3">{job.description}</p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {job.minCgpa && (
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      Min CGPA: {job.minCgpa}
                    </span>
                  )}
                  {job.allowedBranches.length > 0 && (
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      Branches: {job.allowedBranches.join(", ")}
                    </span>
                  )}
                  {job.requiredSkills.length > 0 && (
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      Skills: {job.requiredSkills.join(", ")}
                    </span>
                  )}
                  {job.salaryMin && job.salaryMax && (
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                      ₹{job.salaryMin.toLocaleString()} - ₹
                      {job.salaryMax.toLocaleString()}
                    </span>
                  )}
                </div>

                {user?.role === "STUDENT" && job.eligibility && (
                  <div className="mt-3">
                    {job.eligibility.eligible ? (
                      <span className="text-xs bg-institution-green/15 text-institution-green px-2 py-1 rounded-full font-medium">
                        ✓ You're eligible
                      </span>
                    ) : (
                      <div>
                        <span className="text-xs bg-brick/15 text-brick px-2 py-1 rounded-full font-medium">
                          Not eligible
                        </span>
                        <ul className="text-xs text-brick mt-1 list-disc list-inside">
                          {job.eligibility.reasons.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {user?.role === "STUDENT" && (
                  <button
                    onClick={() => handleApply(job.id)}
                    disabled={alreadyApplied || applyingTo === job.id}
                    className="mt-4 bg-navy text-white px-4 py-2 rounded text-sm hover:bg-navy-dark disabled:bg-slate-300 disabled:cursor-not-allowed"
                  >
                    {alreadyApplied
                      ? "Applied ✓"
                      : applyingTo === job.id
                        ? "Applying..."
                        : "Apply"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
