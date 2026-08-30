import { useState, useEffect } from "react";
import api from "../api/axios";
import type { Company } from "../types/company";

export default function AdminCompanyApprovals() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  async function fetchCompanies() {
    setLoading(true);
    const res = await api.get<{ data: Company[] }>("/companies");
    setCompanies(res.data.data);
    setLoading(false);
  }

  async function approve(id: string) {
    await api.patch(`/companies/${id}/approve`);
    fetchCompanies();
  }

  if (loading) return <p className="text-slate-500">Loading companies...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-navy mt-4">
      <h2 className="font-display text-lg font-semibold text-navy mb-4">
        Companies
      </h2>
      <div className="space-y-3">
        {companies.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between border-b border-slate-100 pb-3"
          >
            <div>
              <p className="font-medium text-slate-700">{c.name}</p>
              <p className="text-xs text-slate-400">
                {c.recruiters?.[0]?.fullName} · {c.industry}
              </p>
            </div>
            {c.approved ? (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Approved
              </span>
            ) : (
              <button
                onClick={() => approve(c.id)}
                className="text-xs bg-institution-green text-white px-3 py-1 rounded hover:opacity-90"
              >
                Approve
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
