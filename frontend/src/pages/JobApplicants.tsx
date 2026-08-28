import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import type { Applicant, ApplicationStatus } from "../types/application";

const statuses: ApplicationStatus[] = [
  "APPLIED",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "INTERVIEW_SCHEDULED",
  "SELECTED",
  "REJECTED",
];

export default function JobApplicants() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  async function fetchApplicants() {
    const res = await api.get<{ data: Applicant[] }>(
      `/applications/job/${jobId}`,
    );
    setApplicants(res.data.data);
    setLoading(false);
  }

  async function handleStatusChange(applicationId: string, status: string) {
    await api.patch(`/applications/${applicationId}/status`, { status });
    fetchApplicants();
  }

  function openResume(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  if (loading) {
    return <p className="text-slate-500 p-8">Loading applicants...</p>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">
          Applicants
        </h1>

        {applicants.length === 0 && (
          <p className="text-slate-500">No applicants yet.</p>
        )}

        <div className="space-y-4">
          {applicants.map((app) => (
            <div key={app.id} className="bg-white p-5 rounded-lg shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-slate-800">
                    {app.student.fullName}
                  </p>
                  <p className="text-sm text-slate-500">
                    {app.student.user.email}
                  </p>

                  {app.student.educations[0] && (
                    <p className="text-xs text-slate-400 mt-1">
                      {app.student.educations[0].degree} - CGPA{" "}
                      {app.student.educations[0].cgpa ?? "N/A"}
                    </p>
                  )}

                  {app.student.skills.length > 0 && (
                    <p className="text-xs text-slate-400 mt-1">
                      Skills: {app.student.skills.map((s) => s.name).join(", ")}
                    </p>
                  )}

                  {app.student.resume && (
                    <button
                      onClick={() => openResume(app.student.resume!.fileUrl)}
                      className="text-xs text-blue-600 hover:underline mt-1 block"
                    >
                      View Resume
                    </button>
                  )}
                </div>

                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app.id, e.target.value)}
                  className="text-sm border border-slate-300 rounded px-2 py-1"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
