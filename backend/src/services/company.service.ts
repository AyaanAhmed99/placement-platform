import { prisma } from "../config/db";
import { CompanyInput } from "../utils/validation";

async function getRecruiterProfileId(userId: string) {
  const profile = await prisma.recruiterProfile.findUnique({
    where: { userId },
  });
  if (!profile) throw new Error("RECRUITER_PROFILE_NOT_FOUND");
  return profile;
}

export async function createCompany(userId: string, input: CompanyInput) {
  const recruiter = await getRecruiterProfileId(userId);

  if (recruiter.companyId) {
    throw new Error("ALREADY_HAS_COMPANY");
  }

  const company = await prisma.company.create({ data: input });

  await prisma.recruiterProfile.update({
    where: { id: recruiter.id },
    data: { companyId: company.id },
  });

  return company;
}

export async function getMyCompany(userId: string) {
  const recruiter = await getRecruiterProfileId(userId);

  if (!recruiter.companyId) {
    throw new Error("NO_COMPANY_YET");
  }

  return prisma.company.findUnique({ where: { id: recruiter.companyId } });
}

export async function listCompanies() {
  return prisma.company.findMany({
    include: { recruiters: { select: { fullName: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function approveCompany(companyId: string) {
  const company = await prisma.company.findUnique({ where: { id: companyId } });
  if (!company) throw new Error("COMPANY_NOT_FOUND");

  return prisma.company.update({
    where: { id: companyId },
    data: { approved: true },
  });
}
