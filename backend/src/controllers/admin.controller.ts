import { Request, Response } from "express";
import { getDashboardStats } from "../services/admin.service";

export async function stats(_req: Request, res: Response) {
  const data = await getDashboardStats();
  res.status(200).json({ success: true, data });
}
