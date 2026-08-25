import { prisma } from "../config/db";
import { SkillInput } from "../utils/validation";

async function getStudentProfileId(userId: string) {
  const profile = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!profile) throw new Error("STUDENT_PROFILE_NOT_FOUND");
  return profile.id;
}

export async function addSkill(userId: string, input: SkillInput) {
  const studentId = await getStudentProfileId(userId);
  return prisma.skill.create({ data: { ...input, studentId } });
}

export async function getSkills(userId: string) {
  const studentId = await getStudentProfileId(userId);
  return prisma.skill.findMany({ where: { studentId } });
}

export async function updateSkill(
  userId: string,
  skillId: string,
  input: Partial<SkillInput>,
) {
  const studentId = await getStudentProfileId(userId);
  const skill = await prisma.skill.findUnique({ where: { id: skillId } });

  if (!skill || skill.studentId !== studentId) {
    throw new Error("SKILL_NOT_FOUND");
  }

  return prisma.skill.update({ where: { id: skillId }, data: input });
}

export async function deleteSkill(userId: string, skillId: string) {
  const studentId = await getStudentProfileId(userId);
  const skill = await prisma.skill.findUnique({ where: { id: skillId } });

  if (!skill || skill.studentId !== studentId) {
    throw new Error("SKILL_NOT_FOUND");
  }

  await prisma.skill.delete({ where: { id: skillId } });
}
