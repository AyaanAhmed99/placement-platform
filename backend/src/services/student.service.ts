import { prisma } from "../config/db";

export async function updateMyProfile(
  userId: string,
  data: { phone?: string; backlogs?: number },
) {
  const profile = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!profile) throw new Error("STUDENT_PROFILE_NOT_FOUND");

  return prisma.studentProfile.update({
    where: { userId },
    data,
  });
}
