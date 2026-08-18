"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const prisma_1 = require("../lib/prisma");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const router = (0, express_1.Router)();
// POST /api/auth/login - User login
router.post("/login", async (req, res) => {
    try {
        const { phone, password } = req.body;
        if (!phone || !password) {
            res.status(400).json({
                error: "Bad Request",
                message: "Phone and password are required",
            });
            return;
        }
        // Find user by phone
        const user = await prisma_1.prisma.user.findUnique({
            where: { phone },
        });
        if (!user || !user.isActive) {
            res.status(401).json({
                error: "Unauthorized",
                message: "Invalid phone or password",
            });
            return;
        }
        // Compare passwords
        const isPasswordValid = await (0, password_1.comparePasswords)(password, user.passwordHash);
        if (!isPasswordValid) {
            res.status(401).json({
                error: "Unauthorized",
                message: "Invalid phone or password",
            });
            return;
        }
        // Generate JWT token
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            role: user.role,
            phone: user.phone,
        });
        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    phone: user.phone,
                    role: user.role,
                },
            },
        });
    }
    catch (error) {
        console.error("[AUTH LOGIN ERROR]", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Login failed",
        });
    }
});
// POST /api/auth/me - Get current user info
router.get("/me", auth_middleware_1.authenticate, async (req, res) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                name: true,
                phone: true,
                role: true,
                fatherName: true,
                address: true,
                monthlyAmount: true,
                isActive: true,
                createdAt: true,
            },
        });
        if (!user) {
            res.status(404).json({
                error: "Not Found",
                message: "User not found",
            });
            return;
        }
        res.json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        console.error("[GET ME ERROR]", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Failed to get user info",
        });
    }
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map