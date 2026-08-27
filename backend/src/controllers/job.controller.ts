import { Request, Response } from "express";
import { jobSchema } from "../utils/validation";
import {
  createJob,
  getMyJobs,
  getPublicJobs,
  getJobById,
  updateJob,
  deleteJob,
  getPendingJobs,
  approveJob,
} from "../services/job.service";

export async function create(req: Request, res: Response) {
  const parsed = jobSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.issues });
  }
  try {
    const job = await createJob(req.user!.userId, parsed.data);
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    handleError(err, res);
  }
}

export async function mine(req: Request, res: Response) {
  try {
    const jobs = await getMyJobs(req.user!.userId);
    res.status(200).json({ success: true, data: jobs });
  } catch (err) {
    handleError(err, res);
  }
}

export async function listPublic(_req: Request, res: Response) {
  const jobs = await getPublicJobs();
  res.status(200).json({ success: true, data: jobs });
}

export async function getOne(req: Request, res: Response) {
  try {
    const job = await getJobById(req.params.id);
    res.status(200).json({ success: true, data: job });
  } catch (err) {
    handleError(err, res);
  }
}

export async function edit(req: Request, res: Response) {
  const parsed = jobSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.issues });
  }
  try {
    const job = await updateJob(req.user!.userId, req.params.id, parsed.data);
    res.status(200).json({ success: true, data: job });
  } catch (err) {
    handleError(err, res);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    await deleteJob(req.user!.userId, req.params.id);
    res.status(204).send();
  } catch (err) {
    handleError(err, res);
  }
}

export async function pending(_req: Request, res: Response) {
  const jobs = await getPendingJobs();
  res.status(200).json({ success: true, data: jobs });
}

export async function approve(req: Request, res: Response) {
  try {
    const job = await approveJob(req.params.id);
    res.status(200).json({ success: true, data: job });
  } catch (err) {
    handleError(err, res);
  }
}

function handleError(err: unknown, res: Response) {
  const map: Record<string, [number, string]> = {
    RECRUITER_PROFILE_NOT_FOUND: [404, "Recruiter profile not found"],
    NO_COMPANY_LINKED: [400, "You must create a company before posting jobs"],
    COMPANY_NOT_APPROVED: [
      403,
      "Your company must be approved before posting jobs",
    ],
    JOB_NOT_FOUND: [404, "Job not found"],
  };
  if (err instanceof Error && map[err.message]) {
    const [status, message] = map[err.message];
    return res.status(status).json({ success: false, message });
  }
  console.error(err);
  res.status(500).json({ success: false, message: "Something went wrong" });
}
