import { Request, Response, NextFunction } from "express";
export interface AuthRequest extends Request {
    user?: {
        userId: number;
        role: "OWNER" | "ADMIN" | "USER";
        phone: string;
    };
}
export declare const authMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const requireRole: (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const ownerOnly: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const ownerOrAdmin: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const authenticate: typeof authMiddleware;
//# sourceMappingURL=auth.middleware.d.ts.map