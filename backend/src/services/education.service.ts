import { prisma } from "../config/db";
import { EducationInput } from "../utils/validation";

async function getStudentProfileId(userId: string) {
  const profile = await prisma.studentProfile.findUnique({
    where: { userId },
  });
  if (!profile) throw new Error("STUDENT_PROFILE_NOT_FOUND");
  return profile.id;
}

export async function addEducation(userId: string, input: EducationInput) {
  const studentId = await getStudentProfileId(userId);
  return prisma.education.create({
    data: { ...input, studentId },
  });
}

export async function getEducations(userId: string) {
  const studentId = await getStudentProfileId(userId);
  return prisma.education.findMany({
    where: { studentId },
    orderBy: { startYear: "desc" },
  });
}

export async function updateEducation(
  userId: string,
  educationId: string,
  input: Partial<EducationInput>,
) {
  const studentId = await getStudentProfileId(userId);

  const education = await prisma.education.findUnique({
    where: { id: educationId },
  });

  if (!education || education.studentId !== studentId) {
    throw new Error("EDUCATION_NOT_FOUND");
  }

  return prisma.education.update({
    where: { id: educationId },
    data: input,
  });
}

export async function deleteEducation(userId: string, educationId: string) {
  const studentId = await getStudentProfileId(userId);

  const education = await prisma.education.findUnique({
    where: { id: educationId },
  });

  if (!education || education.studentId !== studentId) {
    throw new Error("EDUCATION_NOT_FOUND");
  }

  await prisma.education.delete({ where: { id: educationId } });
}
