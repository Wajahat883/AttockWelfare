import { Request, Response, NextFunction } from "express";
import { verifyToken, extractTokenFromHeader } from "../utils/jwt";
import { prisma } from "../lib/prisma";

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: "OWNER" | "ADMIN" | "USER";
    phone: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) {
      res.status(401).json({
        error: "Unauthorized",
        message: "No token provided",
      });
      return;
    }

    const payload = verifyToken(token);
    if (!payload) {
      res.status(401).json({
        error: "Unauthorized",
        message: "Invalid or expired token",
      });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId }, select: { role: true, phone: true, isActive: true } });
    if (!user || !user.isActive || user.role !== payload.role) {
      res.status(401).json({ error: "Unauthorized", message: "Account is inactive or no longer valid" });
      return;
    }
    req.user = { ...payload, role: user.role as "OWNER" | "ADMIN" | "USER", phone: user.phone };
    next();
  } catch (error) {
    res.status(401).json({
      error: "Unauthorized",
      message: "Authentication failed",
    });
  }
};

// Require specific roles
export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        error: "Forbidden",
        message: `This action requires one of these roles: ${roles.join(", ")}`,
        requiredRoles: roles,
        userRole: req.user?.role,
      });
      return;
    }
    next();
  };
};

// Owner-only middleware
export const ownerOnly = requireRole("OWNER");

// Owner or Admin
export const ownerOrAdmin = requireRole("OWNER", "ADMIN");

// Any authenticated user
export const authenticate = authMiddleware;
