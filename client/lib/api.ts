import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("ayush_skillsync_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type Role = "student" | "institution" | "employer" | "mentor" | "admin";
export type User = { id: string; name: string; email: string; role: Role };
export type MatchBreakdown = { skillFit: number; domainFit: number; eligibility: number; locationFit: number; availability: number };
export type Opportunity = { _id: string; title: string; description?: string; type: string; disciplines: string[]; location?: string; remote: boolean; stipend?: number; requiredSkills?: Array<{ _id: string; skillNode: string; discipline: string }>; employerId?: { _id: string; name: string }; status?: string };
export type Match = { _id: string; score: number; breakdown: MatchBreakdown; explanation?: string; opportunity: Opportunity };

export async function getTaxonomy(discipline?: string) {
  const response = await api.get("/taxonomy", { params: discipline ? { discipline } : {} });
  return response.data;
}

export async function login(email: string, password: string) {
  const response = await api.post("/auth/login", { email, password });
  if (typeof window !== "undefined") {
    window.localStorage.setItem("ayush_skillsync_token", response.data.token);
    window.localStorage.setItem("ayush_skillsync_user", JSON.stringify(response.data.user));
    window.dispatchEvent(new Event("ayush-auth-changed"));
  }
  return response.data;
}

export async function register(payload: { name: string; email: string; password: string; role: Role }) {
  const response = await api.post("/auth/register", payload);
  if (typeof window !== "undefined") {
    window.localStorage.setItem("ayush_skillsync_token", response.data.token);
    window.localStorage.setItem("ayush_skillsync_user", JSON.stringify(response.data.user));
    window.dispatchEvent(new Event("ayush-auth-changed"));
  }
  return response.data;
}

async function request<T>(promise: Promise<{ data: T }>) {
  try { return (await promise).data; } catch (error) { const message = axios.isAxiosError(error) ? error.response?.data?.message || "The request could not be completed" : "The request could not be completed"; throw new Error(message); }
}

export function getOpportunities(filters: Record<string, string | boolean | undefined> = {}) { return request<{ opportunities: Opportunity[] }>(api.get('/opportunities', { params: filters })); }
export function getOpportunity(id: string) { return request<{ opportunity: Opportunity }>(api.get(`/opportunities/${id}`)); }
export function createOpportunity(payload: Partial<Opportunity>) { return request<{ opportunity: Opportunity }>(api.post('/opportunities', payload)); }
export function updateOpportunity(id: string, payload: Partial<Opportunity>) { return request<{ opportunity: Opportunity }>(api.patch(`/opportunities/${id}`, payload)); }
export function applyToOpportunity(opportunityId: string, coverNote: string) { return request(api.post('/applications', { opportunityId, coverNote })); }
export function getMyApplications() { return request(api.get('/applications/me')); }
export function getApplicationsForOpportunity(id: string) { return request(api.get(`/applications/opportunity/${id}`)); }
export function updateApplicationStatus(id: string, status: string) { return request(api.patch(`/applications/${id}/status`, { status })); }
export function getMyMatches() { return request<{ matches: Match[]; weights: Record<string, number> }>(api.get('/matching/opportunities')); }
export function getMatch(id: string) { return request<{ match: Match }>(api.post(`/matching/${id}`)); }
export function getMyProfile() { return request<{ profile: Record<string, unknown> | null }>(api.get('/profile')); }
export function updateMyProfile(payload: Record<string, unknown>) { return request(api.put('/profile', payload)); }
export function uploadEvidence(formData: FormData) { return request(api.post('/profile/evidence', formData, { headers: { 'Content-Type': 'multipart/form-data' } })); }
export type VerificationItem = { _id: string; title: string; studentUserId: string; student?: { name: string }; issuer?: string };
export function getVerificationQueue() { return request<{ queue: VerificationItem[] }>(api.get('/verification/queue')); }
export function reviewEvidence(studentId: string, evidenceId: string, payload: { status: string; reviewNote?: string }) { return request(api.patch(`/verification/${studentId}/${evidenceId}`, payload)); }
export function searchCandidates(filters: Record<string, string | undefined> = {}) { return request(api.get('/candidates/search', { params: filters })); }
export type AdminReport = { placementRate: number; pendingVerification: number; usersByRole: Array<{ _id: string; count: number }> };
export function getAdminReport() { return request<AdminReport>(api.get('/admin/report')); }
export function getInstitutionReport(code: string) { return request<{ report: Record<string, unknown> }>(api.get(`/institutions/${code}/report`)); }