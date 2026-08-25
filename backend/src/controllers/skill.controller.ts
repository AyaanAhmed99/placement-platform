import { Request, Response } from "express";
import { skillSchema } from "../utils/validation";
import {
  addSkill,
  getSkills,
  updateSkill,
  deleteSkill,
} from "../services/skill.service";

export async function createSkill(req: Request, res: Response) {
  const parsed = skillSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.issues });
  }

  try {
    const skill = await addSkill(req.user!.userId, parsed.data);
    res.status(201).json({ success: true, data: skill });
  } catch (err) {
    handleError(err, res);
  }
}

export async function listSkills(req: Request, res: Response) {
  try {
    const skills = await getSkills(req.user!.userId);
    res.status(200).json({ success: true, data: skills });
  } catch (err) {
    handleError(err, res);
  }
}

export async function editSkill(req: Request, res: Response) {
  const parsed = skillSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.issues });
  }

  try {
    const skill = await updateSkill(
      req.user!.userId,
      req.params.id,
      parsed.data,
    );
    res.status(200).json({ success: true, data: skill });
  } catch (err) {
    handleError(err, res);
  }
}

export async function removeSkill(req: Request, res: Response) {
  try {
    await deleteSkill(req.user!.userId, req.params.id);
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
  if (err instanceof Error && err.message === "SKILL_NOT_FOUND") {
    return res.status(404).json({ success: false, message: "Skill not found" });
  }
  console.error(err);
  res.status(500).json({ success: false, message: "Something went wrong" });
}
