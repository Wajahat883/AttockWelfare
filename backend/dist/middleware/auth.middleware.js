"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = exports.ownerOrAdmin = exports.ownerOnly = exports.requireRole = exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const prisma_1 = require("../lib/prisma");
const authMiddleware = async (req, res, next) => {
    try {
        const token = (0, jwt_1.extractTokenFromHeader)(req.headers.authorization);
        if (!token) {
            res.status(401).json({
                error: "Unauthorized",
                message: "No token provided",
            });
            return;
        }
        const payload = (0, jwt_1.verifyToken)(token);
        if (!payload) {
            res.status(401).json({
                error: "Unauthorized",
                message: "Invalid or expired token",
            });
            return;
        }
        const user = await prisma_1.prisma.user.findUnique({ where: { id: payload.userId }, select: { role: true, phone: true, isActive: true } });
        if (!user || !user.isActive || user.role !== payload.role) {
            res.status(401).json({ error: "Unauthorized", message: "Account is inactive or no longer valid" });
            return;
        }
        req.user = { ...payload, role: user.role, phone: user.phone };
        next();
    }
    catch (error) {
        res.status(401).json({
            error: "Unauthorized",
            message: "Authentication failed",
        });
    }
};
exports.authMiddleware = authMiddleware;
// Require specific roles
const requireRole = (...roles) => {
    return (req, res, next) => {
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
exports.requireRole = requireRole;
// Owner-only middleware
exports.ownerOnly = (0, exports.requireRole)("OWNER");
// Owner or Admin
exports.ownerOrAdmin = (0, exports.requireRole)("OWNER", "ADMIN");
// Any authenticated user
exports.authenticate = exports.authMiddleware;
//# sourceMappingURL=auth.middleware.js.map