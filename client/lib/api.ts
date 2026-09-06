import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("nadi_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type Role = "student" | "institution" | "employer" | "mentor";
export type MatchBreakdown = { skillFit: number; domainFit: number; locationFit: number };

export async function getTaxonomy(discipline?: string) {
  const response = await api.get("/taxonomy", { params: discipline ? { discipline } : {} });
  return response.data;
}

export async function login(email: string, password: string) {
  const response = await api.post("/auth/login", { email, password });
  if (typeof window !== "undefined") window.localStorage.setItem("nadi_token", response.data.token);
  return response.data;
}

export async function register(payload: { name: string; email: string; password: string; role: Role }) {
  const response = await api.post("/auth/register", payload);
  if (typeof window !== "undefined") window.localStorage.setItem("nadi_token", response.data.token);
  return response.data;
}