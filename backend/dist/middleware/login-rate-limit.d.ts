import { Request, Response, NextFunction } from "express";
export declare function loginAttemptKey(req: Request): string;
export declare function loginRateLimit(req: Request, res: Response, next: NextFunction): void;
export declare function clearLoginAttempts(req: Request): void;
//# sourceMappingURL=login-rate-limit.d.ts.map