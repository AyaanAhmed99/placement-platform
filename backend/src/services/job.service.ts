import { prisma } from "../config/db";
import { JobInput } from "../utils/validation";
import { checkEligibility } from "./eligibility.service";

async function getRecruiterWithCompany(userId: string) {
  const recruiter = await prisma.recruiterProfile.findUnique({
    where: { userId },
    include: { company: true },
  });
  if (!recruiter) throw new Error("RECRUITER_PROFILE_NOT_FOUND");
  if (!recruiter.companyId || !recruiter.company)
    throw new Error("NO_COMPANY_LINKED");
  if (!recruiter.company.approved) throw new Error("COMPANY_NOT_APPROVED");
  return recruiter;
}

export async function createJob(userId: string, input: JobInput) {
  const recruiter = await getRecruiterWithCompany(userId);

  return prisma.job.create({
    data: {
      ...input,
      allowedBranches: input.allowedBranches ?? [],
      requiredSkills: input.requiredSkills ?? [],
      companyId: recruiter.companyId!,
      postedById: recruiter.id,
    },
  });
}

export async function getMyJobs(userId: string) {
  const recruiter = await getRecruiterWithCompany(userId);
  return prisma.job.findMany({
    where: { postedById: recruiter.id },
    orderBy: { createdAt: "desc" },
  });
}

// Public browse — students only ever see approved jobs from approved companies
export async function getPublicJobs(studentUserId?: string) {
  const jobs = await prisma.job.findMany({
    where: { approved: true, company: { approved: true } },
    include: {
      company: { select: { name: true, industry: true, location: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!studentUserId) return jobs;

  const student = await prisma.studentProfile.findUnique({
    where: { userId: studentUserId },
    include: { educations: true, skills: true },
  });

  if (!student) return jobs;

  return jobs.map((job) => ({
    ...job,
    eligibility: checkEligibility(job, student),
  }));
}

export async function getJobById(jobId: string) {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      company: { select: { name: true, industry: true, location: true } },
    },
  });
  if (!job) throw new Error("JOB_NOT_FOUND");
  return job;
}

export async function updateJob(
  userId: string,
  jobId: string,
  input: Partial<JobInput>,
) {
  const recruiter = await getRecruiterWithCompany(userId);
  const job = await prisma.job.findUnique({ where: { id: jobId } });

  if (!job || job.postedById !== recruiter.id) {
    throw new Error("JOB_NOT_FOUND");
  }

  return prisma.job.update({ where: { id: jobId }, data: input });
}

export async function deleteJob(userId: string, jobId: string) {
  const recruiter = await getRecruiterWithCompany(userId);
  const job = await prisma.job.findUnique({ where: { id: jobId } });

  if (!job || job.postedById !== recruiter.id) {
    throw new Error("JOB_NOT_FOUND");
  }

  await prisma.job.delete({ where: { id: jobId } });
}

// Admin
export async function getPendingJobs() {
  return prisma.job.findMany({
    where: { approved: false },
    include: { company: { select: { name: true } } },
    orderBy: { createdAt: "asc" },
  });
}

export async function approveJob(jobId: string) {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new Error("JOB_NOT_FOUND");

  return prisma.job.update({ where: { id: jobId }, data: { approved: true } });
}
