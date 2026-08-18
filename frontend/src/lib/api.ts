import axios, { AxiosInstance } from "axios";
import { ApiResponse, AuthResponse, User, Payment, DashboardSummary, MemberWithPayments } from "../types";

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
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (phone: string, password: string) =>
    api.post<AuthResponse>("/auth/login", { phone, password }),
  
  getMe: () =>
    api.get<ApiResponse<User>>("/auth/me"),
};

// Members API (TODO: Implement)
export const membersApi = {
  getAll: () =>
    api.get<ApiResponse<MemberWithPayments[]>>("/members"),
  
  getById: (id: number) =>
    api.get<ApiResponse<MemberWithPayments>>(`/members/${id}`),
  
  create: (data: unknown) =>
    api.post<ApiResponse<User>>("/members", data),
  
  update: (id: number, data: unknown) =>
    api.put<ApiResponse<User>>(`/members/${id}`, data),
  
  delete: (id: number) =>
    api.delete<ApiResponse<void>>(`/members/${id}`),
  
  search: (query: string) =>
    api.get<ApiResponse<MemberWithPayments[]>>(`/members/search/${query}`),
};

// Payments API (TODO: Implement)
export const paymentsApi = {
  getByUserId: (userId: number) =>
    api.get<ApiResponse<Payment[]>>(`/payments/${userId}`),
  
  create: (data: unknown) =>
    api.post<ApiResponse<Payment>>("/payments", data),
  
  delete: (id: number) =>
    api.delete<ApiResponse<void>>(`/payments/${id}`),
  
  getByMonth: (month: string, year: number) =>
    api.get<ApiResponse<Payment[]>>(`/payments/month/${month}/year/${year}`),
};

// Dashboard API (TODO: Implement)
export const dashboardApi = {
  getSummary: () =>
    api.get<ApiResponse<DashboardSummary>>("/dashboard/summary"),
  
  getDefaulters: () =>
    api.get<ApiResponse<MemberWithPayments[]>>("/dashboard/defaulters"),
  
  getYearlyReport: (year: number) =>
    api.get<ApiResponse<unknown>>(`/dashboard/yearly-report/${year}`),
};

export default api;
