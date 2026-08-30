import { useState, useEffect } from "react";
import api from "../api/axios";

interface Stats {
  totalStudents: number;
  totalRecruiters: number;
  approvedCompanies: number;
  pendingCompanies: number;
  activeJobs: number;
  pendingJobs: number;
  totalApplications: number;
  selectedCount: number;
  placementPercentage: number;
  averagePackage: number | null;
}

export default function AdminStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api
      .get<{ data: Stats }>("/admin/stats")
      .then((res) => setStats(res.data.data));
  }, []);

  if (!stats) return <p className="text-slate-500">Loading stats...</p>;

  const cards = [
    { label: "Students", value: stats.totalStudents },
    { label: "Recruiters", value: stats.totalRecruiters },
    { label: "Approved Companies", value: stats.approvedCompanies },
    { label: "Pending Companies", value: stats.pendingCompanies },
    { label: "Active Jobs", value: stats.activeJobs },
    { label: "Pending Jobs", value: stats.pendingJobs },
    { label: "Total Applications", value: stats.totalApplications },
    { label: "Placed Students", value: stats.selectedCount },
    { label: "Placement %", value: `${stats.placementPercentage}%` },
    {
      label: "Avg. Package",
      value: stats.averagePackage
        ? `₹${stats.averagePackage.toLocaleString()}`
        : "N/A",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className="bg-white rounded-lg shadow-sm border-t-2 border-gold p-4 text-center min-w-0"
        >
          <p className="stat-figure text-lg sm:text-xl font-semibold text-navy break-words">
            {c.value}
          </p>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wide">
            {c.label}
          </p>
        </div>
      ))}
    </div>
  );
}
