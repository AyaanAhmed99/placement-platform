import { prisma } from "../config/db";
import { ProjectInput } from "../utils/validation";

async function getStudentProfileId(userId: string) {
  const profile = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!profile) throw new Error("STUDENT_PROFILE_NOT_FOUND");
  return profile.id;
}

export async function addProject(userId: string, input: ProjectInput) {
  const studentId = await getStudentProfileId(userId);
  return prisma.project.create({ data: { ...input, studentId } });
}

export async function getProjects(userId: string) {
  const studentId = await getStudentProfileId(userId);
  return prisma.project.findMany({ where: { studentId } });
}

export async function updateProject(
  userId: string,
  projectId: string,
  input: Partial<ProjectInput>,
) {
  const studentId = await getStudentProfileId(userId);
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project || project.studentId !== studentId) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  return prisma.project.update({ where: { id: projectId }, data: input });
}

export async function deleteProject(userId: string, projectId: string) {
  const studentId = await getStudentProfileId(userId);
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project || project.studentId !== studentId) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  await prisma.project.delete({ where: { id: projectId } });
}
