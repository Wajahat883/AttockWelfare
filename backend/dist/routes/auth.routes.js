"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const prisma_1 = require("../lib/prisma");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const password_2 = require("../utils/password");
const login_rate_limit_1 = require("../middleware/login-rate-limit");
const router = (0, express_1.Router)();
// Public registration always creates a normal USER account. Roles are never accepted from the client.
router.post("/register", async (req, res) => {
    const { name, email, phone, password, fatherName, address } = req.body;
    if (typeof name !== "string" || !name.trim() || typeof phone !== "string" || !phone.trim() || typeof password !== "string" || password.length < 8) {
        res.status(400).json({ error: "Bad Request", message: "Name, phone, and a password of at least 8 characters are required" });
        return;
    }
    try {
        const user = await prisma_1.prisma.user.create({
            data: { name: name.trim(), email: typeof email === "string" && email.trim() ? email.trim().toLowerCase() : null, phone: phone.trim(), fatherName: typeof fatherName === "string" ? fatherName.trim() || null : null, address: typeof address === "string" ? address.trim() || null : null, passwordHash: await (0, password_2.hashPassword)(password), role: "USER", monthlyAmount: 0 },
            select: { id: true, name: true, email: true, phone: true, role: true },
        });
        const token = (0, jwt_1.generateToken)({ userId: user.id, role: "USER", phone: user.phone });
        res.status(201).json({ success: true, data: { token, user } });
    }
    catch (error) {
        if (typeof error === "object" && error && "code" in error && error.code === "P2002") {
            res.status(409).json({ error: "Conflict", message: "An account with this phone number already exists" });
            return;
        }
        console.error("[AUTH REGISTER ERROR]", error);
        res.status(500).json({ error: "Internal Server Error", message: "Registration failed" });
    }
});
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
        // Phone is the application's login identifier.
        const user = await prisma_1.prisma.user.findFirst({
            where: { phone: String(phone).trim() },
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
        (0, login_rate_limit_1.clearLoginAttempts)(req);
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
                    email: user.email,
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
                email: true,
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