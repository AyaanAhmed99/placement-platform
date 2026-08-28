import type { Job } from "./job";

export type ApplicationStatus =
  | "APPLIED"
  | "UNDER_REVIEW"
  | "SHORTLISTED"
  | "INTERVIEW_SCHEDULED"
  | "SELECTED"
  | "REJECTED";

export interface Application {
  id: string;
  status: ApplicationStatus;
  interviewDate: string | null;
  appliedAt: string;
  job: Job & { company: { name: string } };
}

export interface Applicant {
  id: string;
  status: ApplicationStatus;
  interviewDate: string | null;
  appliedAt: string;
  student: {
    fullName: string;
    phone: string | null;
    user: { email: string };
    educations: { institution: string; degree: string; cgpa: number | null }[];
    skills: { name: string; level: string }[];
    resume: { fileUrl: string; fileName: string } | null;
  };
}
