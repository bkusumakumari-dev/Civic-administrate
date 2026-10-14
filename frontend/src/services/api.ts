export const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) || 'http://localhost:8082';

export type Role = 'ADMIN' | 'CANDIDATE';

export interface User {
  id: string;
  username: string;
  role: Role;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  preferredLanguage: string | null;
}

export interface Application {
  id: string;
  trackingId: string;
  serviceType: string;
  applicantName: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  remarks: string | null;
  ownerId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Grievance {
  id: string;
  trackingId: string;
  category: string;
  subject: string;
  description: string;
  relatedTrackingId: string | null;
  status: string;
  resolutionNote: string | null;
  ownerId: string | null;
  createdAt: string;
  updatedAt: string;
  dueAt: string | null;
}

export interface HistoryItem {
  id: string;
  status: string;
  note: string | null;
  changedBy: string | null;
  changedAt: string;
}

export interface AdminStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalGrievances: number;
  openGrievances: number;
  overdueGrievances: number;
  totalCandidates: number;
}

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new ApiError('network', 0);
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (typeof body.message === 'string') {
        message = body.message;
      }
    } catch {
      // no parseable body
    }
    throw new ApiError(message, response.status);
  }
  return (await response.json()) as T;
}

const body = (data: unknown): RequestInit => ({ body: JSON.stringify(data) });

export const api = {
  login: (username: string, password: string) =>
    request<User>('/api/auth/login', { method: 'POST', ...body({ username, password }) }),
  register: (data: { username: string; password: string; fullName: string; email: string; phone: string }) =>
    request<User>('/api/auth/register', { method: 'POST', ...body(data) }),
  updateProfile: (id: string, data: { fullName: string; email: string; phone: string; preferredLanguage: string }) =>
    request<User>(`/api/auth/profile/${id}`, { method: 'PATCH', ...body(data) }),

  getApplications: (ownerId?: string) =>
    request<Application[]>(ownerId ? `/api/applications?ownerId=${ownerId}` : '/api/applications'),
  getApplication: (trackingId: string) => request<Application>(`/api/applications/${trackingId}`),
  createApplication: (data: object) => request<Application>('/api/applications', { method: 'POST', ...body(data) }),
  updateApplicationStatus: (id: string, status: string, note: string, changedBy: string) =>
    request<Application>(`/api/applications/${id}/status`, {
      method: 'PATCH',
      ...body({ status, note, changedBy }),
    }),
  getApplicationHistory: (trackingId: string) =>
    request<HistoryItem[]>(`/api/applications/${trackingId}/history`),

  getGrievances: (ownerId?: string) =>
    request<Grievance[]>(ownerId ? `/api/grievances?ownerId=${ownerId}` : '/api/grievances'),
  getGrievance: (trackingId: string) => request<Grievance>(`/api/grievances/${trackingId}`),
  createGrievance: (data: object) => request<Grievance>('/api/grievances', { method: 'POST', ...body(data) }),
  updateGrievanceStatus: (id: string, status: string, note: string, changedBy: string) =>
    request<Grievance>(`/api/grievances/${id}/status`, {
      method: 'PATCH',
      ...body({ status, note, changedBy }),
    }),
  getGrievanceHistory: (trackingId: string) => request<HistoryItem[]>(`/api/grievances/${trackingId}/history`),

  getAdminStats: () => request<AdminStats>('/api/admin/stats'),
};

/** Is the request an ApiError caused by the backend being unreachable? */
export function isNetworkError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 0;
}