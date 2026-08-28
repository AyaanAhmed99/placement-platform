import { z } from "zod";

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["STUDENT", "RECRUITER"]), // no one self-registers as ADMIN
  fullName: z.string().min(1, "Full name is required"),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password is required"),
});

export const educationSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  fieldOfStudy: z.enum([
    "CSE",
    "IT",
    "ECE",
    "EEE",
    "MECH",
    "CIVIL",
    "CHEMICAL",
    "OTHER",
  ]),
  cgpa: z.number().min(0).max(10).optional(),
  startYear: z.number().int(),
  endYear: z.number().int().optional(),
});

export const skillSchema = z.object({
  name: z.string().min(1),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
});

export const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  techStack: z.array(z.string()).optional(),
  projectUrl: z.url().optional(),
  githubUrl: z.url().optional(),
});

export const companySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  website: z.url().optional(),
});

export const jobSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().optional(),
  jobType: z
    .enum(["FULL_TIME", "INTERNSHIP", "PART_TIME"])
    .default("FULL_TIME"),
  salaryMin: z.number().int().optional(),
  salaryMax: z.number().int().optional(),
  minCgpa: z.number().min(0).max(10).optional(),
  allowedBranches: z
    .array(
      z.enum(["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "CHEMICAL", "OTHER"]),
    )
    .optional(),
  maxBacklogs: z.number().int().min(0).optional(),
  eligibleBatch: z.number().int().optional(),
  requiredSkills: z.array(z.string()).optional(),
});

export const applySchema = z.object({
  jobId: z.string().min(1),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum([
    "APPLIED",
    "UNDER_REVIEW",
    "SHORTLISTED",
    "INTERVIEW_SCHEDULED",
    "SELECTED",
    "REJECTED",
  ]),
  interviewDate: z.iso.datetime().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type CompanyInput = z.infer<typeof companySchema>;
export type JobInput = z.infer<typeof jobSchema>;
