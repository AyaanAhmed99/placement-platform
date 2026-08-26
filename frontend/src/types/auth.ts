export type Role = "STUDENT" | "RECRUITER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
