import axios, { AxiosInstance } from "axios";
import { ApiResponse, AuthResponse, CreateMemberFormData, RecordPaymentFormData, User, Payment, DashboardSummary, MemberWithPayments, YearlyReport } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (phone: string, password: string) =>
    api.post<AuthResponse>("/auth/login", { phone, password }),
  register: (data: { name: string; fatherName?: string; address?: string; phone: string; email?: string; password: string }) =>
    api.post<AuthResponse>("/auth/register", data),
  
  getMe: () =>
    api.get<ApiResponse<User>>("/auth/me"),
};

export const membersApi = {
  getAll: () =>
    api.get<ApiResponse<MemberWithPayments[]>>("/members"),
  
  getById: (id: number) =>
    api.get<ApiResponse<MemberWithPayments>>(`/members/${id}`),
  
  create: (data: CreateMemberFormData & { password?: string }) =>
    api.post<ApiResponse<User>>("/members", data),
  
  update: (id: number, data: Partial<CreateMemberFormData>) =>
    api.put<ApiResponse<User>>(`/members/${id}`, data),
  
  delete: (id: number) =>
    api.delete<ApiResponse<void>>(`/members/${id}`),
  
  search: (query: string) =>
    api.get<ApiResponse<MemberWithPayments[]>>(`/members/search/${encodeURIComponent(query)}`),
};

export const paymentsApi = {
  getByUserId: (userId: number) =>
    api.get<ApiResponse<Payment[]>>(`/payments/${userId}`),
  
  create: (data: RecordPaymentFormData) =>
    api.post<ApiResponse<Payment>>("/payments", data),
  
  delete: (id: number) =>
    api.delete<ApiResponse<void>>(`/payments/${id}`),
  
  getByMonth: (month: string, year: number) =>
    api.get<ApiResponse<Payment[]>>(`/payments/month/${month}/year/${year}`),
};

export const defaultersApi = {
  getCurrent: () => api.get<ApiResponse<{ month: string; year: number; members: User[] }>>("/defaulters"),
};

export const dashboardApi = {
  getSummary: () =>
    api.get<ApiResponse<DashboardSummary>>("/dashboard/summary"),
  
  getDefaulters: () =>
    api.get<ApiResponse<MemberWithPayments[]>>("/dashboard/defaulters"),
  
  getYearlyReport: (year: number) =>
    api.get<ApiResponse<unknown>>(`/dashboard/yearly-report/${year}`),
};

export const reportsApi = {
  monthly: (month: string, year: number) => api.get<ApiResponse<{ month: string; year: number; totalMembers: number; collected: number; pending: number; payments: Payment[] }>>(`/reports/monthly/${month}/${year}`),
  yearly: (year: number) => api.get<ApiResponse<YearlyReport>>(`/reports/yearly/${year}`),
  whatsapp: (id: number) => api.get<ApiResponse<{ url: string; message: string }>>(`/reports/whatsapp/${id}`),
};

export const adminsApi = {
  getAll: () => api.get<ApiResponse<User[]>>("/admins"),
  create: (data: { name: string; phone: string; password: string }) => api.post<ApiResponse<User>>("/admins", data),
  remove: (id: number) => api.delete(`/admins/${id}`),
};

export default api;
