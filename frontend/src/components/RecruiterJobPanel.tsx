import { useState, useEffect, type FormEvent } from "react";
import api from "../api/axios";
import type { Job } from "../types/job";

export default function RecruiterJobPanel() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    minCgpa: "",
    allowedBranches: [] as string[],
    maxBacklogs: "",
    eligibleBatch: "",
    requiredSkills: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    const res = await api.get<{ data: Job[] }>("/jobs/mine");
    setJobs(res.data.data);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/jobs", {
        title: form.title,
        description: form.description,
        location: form.location || undefined,
        minCgpa: form.minCgpa ? Number(form.minCgpa) : undefined,
        allowedBranches:
          form.allowedBranches.length > 0 ? form.allowedBranches : undefined,
        maxBacklogs: form.maxBacklogs ? Number(form.maxBacklogs) : undefined,
        eligibleBatch: form.eligibleBatch
          ? Number(form.eligibleBatch)
          : undefined,
        requiredSkills: form.requiredSkills
          ? form.requiredSkills.split(",").map((s) => s.trim())
          : undefined,
      });
      setShowForm(false);
      setForm({
        title: "",
        description: "",
        location: "",
        minCgpa: "",
        allowedBranches: [],
        maxBacklogs: "",
        eligibleBatch: "",
        requiredSkills: "",
      });
      fetchJobs();
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to post job");
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-navy mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-semibold text-navy">
          Your Job Postings
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm bg-navy text-white px-3 py-1.5 rounded hover:bg-navy-dark"
        >
          {showForm ? "Cancel" : "Post a Job"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 mb-6 border-b border-slate-100 pb-6"
        >
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <input
            placeholder="Job title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-slate-300 rounded px-3 py-2"
          />
          <textarea
            placeholder="Description"
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-slate-300 rounded px-3 py-2"
          />
          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full border border-slate-300 rounded px-3 py-2"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Min CGPA (e.g. 7.5)"
              value={form.minCgpa}
              onChange={(e) => setForm({ ...form, minCgpa: e.target.value })}
              className="border border-slate-300 rounded px-3 py-2"
            />
            <input
              placeholder="Max backlogs"
              value={form.maxBacklogs}
              onChange={(e) =>
                setForm({ ...form, maxBacklogs: e.target.value })
              }
              className="border border-slate-300 rounded px-3 py-2"
            />
          </div>
          <input
            placeholder="Eligible batch (e.g. 2028)"
            value={form.eligibleBatch}
            onChange={(e) =>
              setForm({ ...form, eligibleBatch: e.target.value })
            }
            className="w-full border border-slate-300 rounded px-3 py-2"
          />
          <div>
            <label className="text-sm text-slate-600 block mb-1">
              Allowed branches
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                "CSE",
                "IT",
                "ECE",
                "EEE",
                "MECH",
                "CIVIL",
                "CHEMICAL",
                "OTHER",
              ].map((branch) => (
                <label key={branch} className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={form.allowedBranches.includes(branch)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...form.allowedBranches, branch]
                        : form.allowedBranches.filter((b) => b !== branch);
                      setForm({ ...form, allowedBranches: updated });
                    }}
                  />
                  {branch}
                </label>
              ))}
            </div>
          </div>
          <input
            placeholder="Required skills (comma separated)"
            value={form.requiredSkills}
            onChange={(e) =>
              setForm({ ...form, requiredSkills: e.target.value })
            }
            className="w-full border border-slate-300 rounded px-3 py-2"
          />
          <button
            type="submit"
            className="bg-navy text-white px-4 py-2 rounded hover:bg-navy-dark"
          >
            Submit for approval
          </button>
        </form>
      )}

      <div className="space-y-3">
        {jobs.length === 0 && (
          <p className="text-slate-500 text-sm">No jobs posted yet.</p>
        )}
        {jobs.map((job) => (
          <div
            key={job.id}
            className="flex items-center justify-between border-b border-slate-100 pb-3"
          >
            <div>
              <p className="font-medium text-slate-700">{job.title}</p>
              <p className="text-xs text-slate-400">
                {job.location ?? "No location"}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  job.approved
                    ? "bg-institution-green/15 text-institution-green"
                    : "bg-gold-light text-navy-dark"
                }`}
              >
                {job.approved ? "Approved" : "Pending approval"}
              </span>
              <a
                href={`/jobs/${job.id}/applicants`}
                className="text-xs text-blue-600 hover:underline"
              >
                View Applicants
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
