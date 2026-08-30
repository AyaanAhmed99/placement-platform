import { useState, useEffect, FormEvent } from "react";
import api from "../api/axios";
import type { Company } from "../types/company";

export default function RecruiterCompanyPanel() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    industry: "",
    location: "",
    website: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCompany();
  }, []);

  async function fetchCompany() {
    try {
      const res = await api.get<{ data: Company }>("/companies/mine");
      setCompany(res.data.data);
    } catch {
      setCompany(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post<{ data: Company }>("/companies", form);
      setCompany(res.data.data);
      setShowForm(false);
    } catch {
      setError("Failed to create company");
    }
  }

  if (loading) return <p className="text-slate-500">Loading company info...</p>;

  if (company) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-navy mt-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display text-lg font-semibold text-navy">
            {company.name}
          </h2>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              company.approved
                ? "bg-institution-green/15 text-institution-green"
                : "bg-gold-light text-navy-dark"
            }`}
          >
            {company.approved ? "Approved" : "Pending approval"}
          </span>
        </div>
        <p className="text-slate-600 text-sm">{company.description}</p>
        <p className="text-slate-400 text-xs mt-2">
          {company.industry} · {company.location}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-navy mt-4">
      <h2 className="font-display text-lg font-semibold text-navy mb-2">
        No company yet
      </h2>
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="bg-navy text-white px-4 py-2 rounded hover:bg-navy-dark"
        >
          Create Company
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <input
            placeholder="Company name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-slate-300 rounded px-3 py-2"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-slate-300 rounded px-3 py-2"
          />
          <input
            placeholder="Industry"
            value={form.industry}
            onChange={(e) => setForm({ ...form, industry: e.target.value })}
            className="w-full border border-slate-300 rounded px-3 py-2"
          />
          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full border border-slate-300 rounded px-3 py-2"
          />
          <input
            placeholder="Website"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            className="w-full border border-slate-300 rounded px-3 py-2"
          />
          <button
            type="submit"
            className="bg-navy text-white px-4 py-2 rounded hover:bg-navy-dark"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
