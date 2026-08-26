import { Request, Response } from "express";
import { companySchema } from "../utils/validation";
import {
  createCompany,
  getMyCompany,
  listCompanies,
  approveCompany,
} from "../services/company.service";

export async function create(req: Request, res: Response) {
  const parsed = companySchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.issues });
  }

  try {
    const company = await createCompany(req.user!.userId, parsed.data);
    res.status(201).json({ success: true, data: company });
  } catch (err) {
    handleError(err, res);
  }
}

export async function mine(req: Request, res: Response) {
  try {
    const company = await getMyCompany(req.user!.userId);
    res.status(200).json({ success: true, data: company });
  } catch (err) {
    handleError(err, res);
  }
}

export async function listAll(_req: Request, res: Response) {
  const companies = await listCompanies();
  res.status(200).json({ success: true, data: companies });
}

export async function approve(req: Request, res: Response) {
  try {
    const company = await approveCompany(req.params.id);
    res.status(200).json({ success: true, data: company });
  } catch (err) {
    handleError(err, res);
  }
}

function handleError(err: unknown, res: Response) {
  if (err instanceof Error && err.message === "RECRUITER_PROFILE_NOT_FOUND") {
    return res
      .status(404)
      .json({ success: false, message: "Recruiter profile not found" });
  }
  if (err instanceof Error && err.message === "ALREADY_HAS_COMPANY") {
    return res
      .status(409)
      .json({ success: false, message: "You already have a company linked" });
  }
  if (err instanceof Error && err.message === "NO_COMPANY_YET") {
    return res
      .status(404)
      .json({ success: false, message: "You haven't created a company yet" });
  }
  if (err instanceof Error && err.message === "COMPANY_NOT_FOUND") {
    return res
      .status(404)
      .json({ success: false, message: "Company not found" });
  }
  console.error(err);
  res.status(500).json({ success: false, message: "Something went wrong" });
}
