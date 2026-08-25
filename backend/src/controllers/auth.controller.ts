import { Request, Response } from "express";
import { registerSchema } from "../utils/validation";
import { registerUser } from "../services/auth.service";
import { loginSchema } from "../utils/validation";
import { loginUser } from "../services/auth.service";
import { refreshAccessToken } from "../services/auth.service";

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.issues,
    });
  }

  try {
    const user = await registerUser(parsed.data);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    if (err instanceof Error && err.message === "EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.issues,
    });
  }

  try {
    const result = await loginUser(parsed.data);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    if (err instanceof Error && err.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: "Refresh token is required",
    });
  }

  try {
    const result = await refreshAccessToken(refreshToken);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
}
