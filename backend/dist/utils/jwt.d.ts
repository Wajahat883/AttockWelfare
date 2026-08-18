interface TokenPayload {
    userId: number;
    role: "OWNER" | "ADMIN" | "USER";
    phone: string;
}
export declare const generateToken: (payload: TokenPayload) => string;
export declare const verifyToken: (token: string) => TokenPayload | null;
export declare const extractTokenFromHeader: (authHeader?: string) => string | null;
export {};
//# sourceMappingURL=jwt.d.ts.map