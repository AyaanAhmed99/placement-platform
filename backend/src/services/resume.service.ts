import { prisma } from "../config/db";
import cloudinary from "../config/cloudinary";

async function getStudentProfileId(userId: string) {
  const profile = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!profile) throw new Error("STUDENT_PROFILE_NOT_FOUND");
  return profile.id;
}

export async function uploadResume(
  userId: string,
  fileBuffer: Buffer,
  originalFileName: string,
) {
  const studentId = await getStudentProfileId(userId);

  const uploadResult = await new Promise<{ secure_url: string }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          public_id: `resumes/${studentId}-${Date.now()}.pdf`,
          access_mode: "public",
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        },
      );
      stream.end(fileBuffer);
    },
  );

  return prisma.resume.upsert({
    where: { studentId },
    update: { fileUrl: uploadResult.secure_url, fileName: originalFileName },
    create: {
      studentId,
      fileUrl: uploadResult.secure_url,
      fileName: originalFileName,
    },
  });
}

export async function getResume(userId: string) {
  const studentId = await getStudentProfileId(userId);
  return prisma.resume.findUnique({ where: { studentId } });
}

export async function deleteResume(userId: string) {
  const studentId = await getStudentProfileId(userId);
  const existing = await prisma.resume.findUnique({ where: { studentId } });
  if (!existing) throw new Error("RESUME_NOT_FOUND");
  await prisma.resume.delete({ where: { studentId } });
}
