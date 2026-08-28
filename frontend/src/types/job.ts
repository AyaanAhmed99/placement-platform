export interface Job {
  id: string;
  title: string;
  description: string;
  location: string | null;
  jobType: "FULL_TIME" | "INTERNSHIP" | "PART_TIME";
  salaryMin: number | null;
  salaryMax: number | null;
  minCgpa: number | null;
  allowedBranches: string[];
  maxBacklogs: number | null;
  eligibleBatch: number | null;
  requiredSkills: string[];
  approved: boolean;
  createdAt: string;
  company?: { name: string; industry: string | null; location: string | null };
  eligibility?: { eligible: boolean; reasons: string[] };
}
