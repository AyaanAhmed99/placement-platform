import bcrypt from "bcrypt";
import { prisma } from "../config/db";
import { RegisterInput } from "../utils/validation";
import { LoginInput } from "../utils/validation";
import { signAccessToken, signRefreshToken } from "../utils/jwt";
import { verifyToken } from "../utils/jwt";

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      password: hashedPassword,
      role: input.role,
      ...(input.role === "STUDENT"
        ? { studentProfile: { create: { fullName: input.fullName } } }
        : { recruiterProfile: { create: { fullName: input.fullName } } }),
    },
    include: {
      studentProfile: true,
      recruiterProfile: true,
    },
  });

  const { password, ...safeUser } = user;
  return safeUser;
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);

  if (!isPasswordValid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const payload = { userId: user.id, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const { password, ...safeUser } = user;

  return { user: safeUser, accessToken, refreshToken };
}

export async function refreshAccessToken(refreshToken: string) {
  let payload;

  try {
    payload = verifyToken(refreshToken);
  } catch (err) {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  const newAccessToken = signAccessToken({ userId: user.id, role: user.role });

  return { accessToken: newAccessToken };
}
