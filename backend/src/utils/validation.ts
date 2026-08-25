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
  fieldOfStudy: z.string().min(1),
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
  techStack: z.array(z.string()).default([]),
  projectUrl: z.url().optional(),
  githubUrl: z.url().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
