type Branch =
  | "CSE"
  | "IT"
  | "ECE"
  | "EEE"
  | "MECH"
  | "CIVIL"
  | "CHEMICAL"
  | "OTHER";

interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
}

interface StudentForMatching {
  backlogs: number;
  educations: {
    cgpa: number | null;
    fieldOfStudy: Branch;
    endYear: number | null;
  }[];
  skills: { name: string }[];
}

interface JobCriteria {
  minCgpa: number | null;
  allowedBranches: Branch[];
  maxBacklogs: number | null;
  eligibleBatch: number | null;
  requiredSkills: string[];
}
export function checkEligibility(
  job: JobCriteria,
  student: StudentForMatching,
): EligibilityResult {
  const reasons: string[] = [];

  // Use the most recent education record as the student's "current" academic standing
  const latestEducation = [...student.educations].sort(
    (a, b) => (b.endYear ?? 0) - (a.endYear ?? 0),
  )[0];

  if (job.minCgpa !== null) {
    if (!latestEducation?.cgpa) {
      reasons.push("CGPA not added to your profile");
    } else if (latestEducation.cgpa < job.minCgpa) {
      reasons.push(
        `CGPA ${latestEducation.cgpa} is below the required ${job.minCgpa}`,
      );
    }
  }

  if (job.allowedBranches.length > 0) {
    const branch = latestEducation?.fieldOfStudy;
    if (!branch || !job.allowedBranches.includes(branch)) {
      reasons.push(
        `Branch not in allowed list: ${job.allowedBranches.join(", ")}`,
      );
    }
  }

  if (job.maxBacklogs !== null && student.backlogs > job.maxBacklogs) {
    reasons.push(
      `You have ${student.backlogs} backlogs, max allowed is ${job.maxBacklogs}`,
    );
  }

  if (
    job.eligibleBatch !== null &&
    latestEducation?.endYear !== job.eligibleBatch
  ) {
    reasons.push(`This job is for the ${job.eligibleBatch} batch`);
  }

  if (job.requiredSkills.length > 0) {
    const studentSkills = new Set(
      student.skills.map((s) => s.name.toLowerCase()),
    );
    const missing = job.requiredSkills.filter(
      (s) => !studentSkills.has(s.toLowerCase()),
    );
    if (missing.length > 0) {
      reasons.push(`Missing skills: ${missing.join(", ")}`);
    }
  }

  return { eligible: reasons.length === 0, reasons };
}
