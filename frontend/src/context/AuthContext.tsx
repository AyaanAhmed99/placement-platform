import { createContext, useContext, useState, ReactNode } from "react";
import api from "../api/axios";
import type { User, AuthResponse } from "../types/auth";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    role: "STUDENT" | "RECRUITER",
    fullName: string,
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  function saveSession(data: AuthResponse) {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  }

  async function login(email: string, password: string) {
    const res = await api.post<{ data: AuthResponse }>("/auth/login", {
      email,
      password,
    });
    saveSession(res.data.data);
  }

  async function register(
    email: string,
    password: string,
    role: "STUDENT" | "RECRUITER",
    fullName: string,
  ) {
    await api.post("/auth/register", { email, password, role, fullName });
    await login(email, password);
  }

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
