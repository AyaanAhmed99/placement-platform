import { useState, useEffect } from "react";
import api from "../api/axios";
import type { Job } from "../types/job";

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ data: Job[] }>("/jobs").then((res) => {
      setJobs(res.data.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-slate-500 p-8">Loading jobs...</p>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">
          Open Positions
        </h1>

        {jobs.length === 0 && (
          <p className="text-slate-500">
            No jobs available right now. Check back soon.
          </p>
        )}

        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
