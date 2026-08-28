import { prisma } from "../config/db";

async function getStudentProfileId(userId: string) {
  const profile = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!profile) throw new Error("STUDENT_PROFILE_NOT_FOUND");
  return profile.id;
}

async function getRecruiterProfileId(userId: string) {
  const profile = await prisma.recruiterProfile.findUnique({
    where: { userId },
  });
  if (!profile) throw new Error("RECRUITER_PROFILE_NOT_FOUND");
  return profile.id;
}

export async function applyToJob(userId: string, jobId: string) {
  const studentId = await getStudentProfileId(userId);

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { company: true },
  });

  if (!job || !job.approved || !job.company.approved) {
    throw new Error("JOB_NOT_AVAILABLE");
  }

  const existing = await prisma.application.findUnique({
    where: { studentId_jobId: { studentId, jobId } },
  });

  if (existing) {
    throw new Error("ALREADY_APPLIED");
  }

  return prisma.application.create({
    data: { studentId, jobId },
  });
}

export async function getMyApplications(userId: string) {
  const studentId = await getStudentProfileId(userId);

  return prisma.application.findMany({
    where: { studentId },
    include: {
      job: {
        include: { company: { select: { name: true } } },
      },
    },
    orderBy: { appliedAt: "desc" },
  });
}

export async function getApplicantsForJob(userId: string, jobId: string) {
  const recruiterId = await getRecruiterProfileId(userId);

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job || job.postedById !== recruiterId) {
    throw new Error("JOB_NOT_FOUND");
  }

  return prisma.application.findMany({
    where: { jobId },
    include: {
      student: {
        select: {
          fullName: true,
          phone: true,
          user: { select: { email: true } },
          educations: true,
          skills: true,
          resume: { select: { fileUrl: true, fileName: true } },
        },
      },
    },
    orderBy: { appliedAt: "asc" },
  });
}

export async function updateApplicationStatus(
  userId: string,
  applicationId: string,
  status: string,
  interviewDate?: string,
) {
  const recruiterId = await getRecruiterProfileId(userId);

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { job: true },
  });

  if (!application || application.job.postedById !== recruiterId) {
    throw new Error("APPLICATION_NOT_FOUND");
  }

  return prisma.application.update({
    where: { id: applicationId },
    data: {
      status: status as any,
      ...(interviewDate ? { interviewDate: new Date(interviewDate) } : {}),
    },
  });
}
