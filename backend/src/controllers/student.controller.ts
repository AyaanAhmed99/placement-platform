import { Request, Response } from "express";
import { z } from "zod";
import { updateMyProfile } from "../services/student.service";

const updateSchema = z.object({
  phone: z.string().optional(),
  backlogs: z.number().int().min(0).optional(),
});

export async function updateProfile(req: Request, res: Response) {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.issues });
  }
  try {
    const profile = await updateMyProfile(req.user!.userId, parsed.data);
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    res
      .status(404)
      .json({ success: false, message: "Student profile not found" });
  }
}
