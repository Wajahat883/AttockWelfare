// User roles
export type UserRole = "OWNER" | "ADMIN" | "USER";

// User interface
export interface User {
  id: number;
  name: string;
  fatherName?: string;
  address?: string;
  phone: string;
  role: UserRole;
  monthlyAmount: number;
  isActive: boolean;
  createdAt: string;
}

// The minimal, non-sensitive user data stored with a browser session.
export type AuthenticatedUser = Pick<User, "id" | "name" | "phone" | "role">;

// Authentication
export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: AuthenticatedUser;
  };
}

// Payment status
export type PaymentStatus = "paid" | "unpaid" | "partial";

// Payment
export interface Payment {
  id: number;
  userId: number;
  month: string; // "YYYY-MM"
  year: number;
  amount: number;
  status: PaymentStatus;
  paidDate?: string;
  addedBy: number;
  createdAt: string;
  updatedAt: string;
}

// Member with payments
export interface MemberWithPayments extends User {
  payments?: Payment[];
}

// Dashboard summary
export interface DashboardSummary {
  currentMonth: string;
  currentYear: number;
  totalMembers: number;
  collectedThisMonth: number;
  pendingThisMonth: number;
  defaulterCount: number;
}

// API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Login form data
export interface LoginFormData {
  phone: string;
  password: string;
}

// Create member form
export interface CreateMemberFormData {
  name: string;
  fatherName?: string;
  address?: string;
  phone: string;
  monthlyAmount: number;
}

// Record payment form
export interface RecordPaymentFormData {
  userId: number;
  amount: number;
  status: PaymentStatus;
  month?: string;
  year?: number;
}
