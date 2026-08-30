import { Request, Response } from "express";
import { educationSchema } from "../utils/validation";
import {
  addEducation,
  getEducations,
  updateEducation,
  deleteEducation,
} from "../services/education.service";

export async function createEducation(req: Request, res: Response) {
  const parsed = educationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.issues });
  }

  try {
    const education = await addEducation(req.user!.userId, parsed.data);
    res.status(201).json({ success: true, data: education });
  } catch (err) {
    handleError(err, res);
  }
}

export async function listEducations(req: Request, res: Response) {
  try {
    const educations = await getEducations(req.user!.userId);
    res.status(200).json({ success: true, data: educations });
  } catch (err) {
    handleError(err, res);
  }
}

export async function editEducation(req: Request, res: Response) {
  const parsed = educationSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.issues });
  }

  try {
    const education = await updateEducation(
      req.user!.userId,
      String(req.params.id),
      parsed.data,
    );
    res.status(200).json({ success: true, data: education });
  } catch (err) {
    handleError(err, res);
  }
}

export async function removeEducation(req: Request, res: Response) {
  try {
    await deleteEducation(req.user!.userId, String(req.params.id));
    res.status(204).send();
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
  if (err instanceof Error && err.message === "EDUCATION_NOT_FOUND") {
    return res
      .status(404)
      .json({ success: false, message: "Education record not found" });
  }
  console.error(err);
  res.status(500).json({ success: false, message: "Something went wrong" });
}
