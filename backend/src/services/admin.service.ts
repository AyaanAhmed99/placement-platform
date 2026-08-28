import { prisma } from "../config/db";

export async function getDashboardStats() {
  const [
    totalStudents,
    totalRecruiters,
    approvedCompanies,
    pendingCompanies,
    activeJobs,
    pendingJobs,
    totalApplications,
    selectedApplications,
  ] = await Promise.all([
    prisma.studentProfile.count(),
    prisma.recruiterProfile.count(),
    prisma.company.count({ where: { approved: true } }),
    prisma.company.count({ where: { approved: false } }),
    prisma.job.count({ where: { approved: true } }),
    prisma.job.count({ where: { approved: false } }),
    prisma.application.count(),
    prisma.application.findMany({
      where: { status: "SELECTED" },
      select: { job: { select: { salaryMin: true, salaryMax: true } } },
    }),
  ]);

  const placementPercentage =
    totalStudents > 0
      ? Math.round((selectedApplications.length / totalStudents) * 100)
      : 0;

  const packages = selectedApplications
    .map((a) => {
      if (a.job.salaryMin && a.job.salaryMax)
        return (a.job.salaryMin + a.job.salaryMax) / 2;
      return null;
    })
    .filter((v): v is number => v !== null);

  const averagePackage =
    packages.length > 0
      ? Math.round(packages.reduce((sum, v) => sum + v, 0) / packages.length)
      : null;

  return {
    totalStudents,
    totalRecruiters,
    approvedCompanies,
    pendingCompanies,
    activeJobs,
    pendingJobs,
    totalApplications,
    selectedCount: selectedApplications.length,
    placementPercentage,
    averagePackage,
  };
}
