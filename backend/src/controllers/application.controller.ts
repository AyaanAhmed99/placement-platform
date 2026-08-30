import { Request, Response } from "express";
import {
  applySchema,
  updateApplicationStatusSchema,
} from "../utils/validation";
import {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
} from "../services/application.service";

export async function apply(req: Request, res: Response) {
  const parsed = applySchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.issues });
  }
  try {
    const application = await applyToJob(req.user!.userId, parsed.data.jobId);
    res.status(201).json({ success: true, data: application });
  } catch (err) {
    handleError(err, res);
  }
}

export async function mine(req: Request, res: Response) {
  try {
    const applications = await getMyApplications(req.user!.userId);
    res.status(200).json({ success: true, data: applications });
  } catch (err) {
    handleError(err, res);
  }
}

export async function applicants(req: Request, res: Response) {
  try {
    const list = await getApplicantsForJob(
      req.user!.userId,
      String(req.params.jobId),
    );
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    handleError(err, res);
  }
}

export async function updateStatus(req: Request, res: Response) {
  const parsed = updateApplicationStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.issues });
  }
  try {
    const application = await updateApplicationStatus(
      req.user!.userId,
      String(req.params.id),
      parsed.data.status,
      parsed.data.interviewDate,
    );
    res.status(200).json({ success: true, data: application });
  } catch (err) {
    handleError(err, res);
  }
}

function handleError(err: unknown, res: Response) {
  const map: Record<string, [number, string]> = {
    STUDENT_PROFILE_NOT_FOUND: [404, "Student profile not found"],
    RECRUITER_PROFILE_NOT_FOUND: [404, "Recruiter profile not found"],
    JOB_NOT_AVAILABLE: [404, "This job is not available for applications"],
    ALREADY_APPLIED: [409, "You have already applied to this job"],
    JOB_NOT_FOUND: [404, "Job not found"],
    APPLICATION_NOT_FOUND: [404, "Application not found"],
  };
  if (err instanceof Error && map[err.message]) {
    const [status, message] = map[err.message];
    return res.status(status).json({ success: false, message });
  }
  console.error(err);
  res.status(500).json({ success: false, message: "Something went wrong" });
}
