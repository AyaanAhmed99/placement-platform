import { Request, Response } from "express";
import { projectSchema } from "../utils/validation";
import {
  addProject,
  getProjects,
  updateProject,
  deleteProject,
} from "../services/project.service";

export async function createProject(req: Request, res: Response) {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.issues });
  }

  try {
    const project = await addProject(req.user!.userId, parsed.data);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    handleError(err, res);
  }
}

export async function listProjects(req: Request, res: Response) {
  try {
    const projects = await getProjects(req.user!.userId);
    res.status(200).json({ success: true, data: projects });
  } catch (err) {
    handleError(err, res);
  }
}

export async function editProject(req: Request, res: Response) {
  const parsed = projectSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.issues });
  }

  try {
    const project = await updateProject(
      req.user!.userId,
      req.params.id,
      parsed.data,
    );
    res.status(200).json({ success: true, data: project });
  } catch (err) {
    handleError(err, res);
  }
}

export async function removeProject(req: Request, res: Response) {
  try {
    await deleteProject(req.user!.userId, req.params.id);
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
  if (err instanceof Error && err.message === "PROJECT_NOT_FOUND") {
    return res
      .status(404)
      .json({ success: false, message: "Project not found" });
  }
  console.error(err);
  res.status(500).json({ success: false, message: "Something went wrong" });
}
