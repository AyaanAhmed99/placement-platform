import { Request, Response } from "express";
import { uploadResume, getResume } from "../services/resume.service";

export async function upload(req: Request, res: Response) {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  try {
    const resume = await uploadResume(
      req.user!.userId,
      req.file.buffer,
      req.file.originalname,
    );
    res.status(200).json({ success: true, data: resume });
  } catch (err) {
    handleError(err, res);
  }
}

export async function getMyResume(req: Request, res: Response) {
  try {
    const resume = await getResume(req.user!.userId);
    if (!resume) {
      return res
        .status(404)
        .json({ success: false, message: "No resume uploaded yet" });
    }
    res.status(200).json({ success: true, data: resume });
  } catch (err) {
    handleError(err, res);
  }
}

function handleError(err: unknown, res: Response) {
  if (err instanceof Error && err.message === "STUDENT_PROFILE_NOT_FOUND") {
    return res
      .status(404)
      .json({ success: false, message: "Student profile not found" });
  }
  console.error(err);
  res.status(500).json({ success: false, message: "Something went wrong" });
}

export async function remove(req: Request, res: Response) {
  try {
    await deleteResume(req.user!.userId);
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ success: false, message: "No resume to remove" });
  }
}
