"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_middleware_1 = require("../middleware/auth.middleware");
const password_1 = require("../utils/password");
const router = (0, express_1.Router)();
const memberFields = { id: true, name: true, email: true, fatherName: true, address: true, phone: true, role: true, monthlyAmount: true, isActive: true, createdAt: true };
function memberData(body, creating = false) {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const monthlyAmount = Number(body.monthlyAmount);
    if ((creating && (!name || !phone)) || (!Number.isFinite(monthlyAmount) && body.monthlyAmount !== undefined) || monthlyAmount < 0)
        return null;
    return { ...(name ? { name } : {}), ...(phone ? { phone } : {}), ...(typeof body.email === "string" ? { email: body.email.trim().toLowerCase() || null } : {}), ...(typeof body.fatherName === "string" ? { fatherName: body.fatherName.trim() || null } : {}), ...(typeof body.address === "string" ? { address: body.address.trim() || null } : {}), ...(body.monthlyAmount !== undefined ? { monthlyAmount } : {}) };
}
router.get("/search/:query", auth_middleware_1.authenticate, auth_middleware_1.ownerOrAdmin, async (req, res) => {
    try {
        const query = typeof req.params.query === "string" ? req.params.query.trim() : "";
        if (!query) {
            res.status(400).json({ error: "Bad Request", message: "Search query is required" });
            return;
        }
        const members = await prisma_1.prisma.user.findMany({ where: { role: "USER", OR: [{ name: { contains: query } }, { fatherName: { contains: query } }, { phone: { contains: query } }] }, select: memberFields, orderBy: { name: "asc" } });
        res.json({ success: true, data: members });
    }
    catch (error) {
        console.error("[MEMBER SEARCH ERROR]", error);
        res.status(500).json({ error: "Internal Server Error", message: "Failed to search members" });
    }
});
router.get("/", auth_middleware_1.authenticate, auth_middleware_1.ownerOrAdmin, async (_req, res) => {
    try {
        res.json({ success: true, data: await prisma_1.prisma.user.findMany({ where: { role: "USER" }, select: memberFields, orderBy: { name: "asc" } }) });
    }
    catch (error) {
        console.error("[MEMBERS ERROR]", error);
        res.status(500).json({ error: "Internal Server Error", message: "Failed to get members" });
    }
});
router.post("/", auth_middleware_1.authenticate, auth_middleware_1.ownerOrAdmin, async (req, res) => {
    const data = memberData(req.body, true);
    if (!data || !data.name || !data.phone || data.monthlyAmount === undefined) {
        res.status(400).json({ error: "Bad Request", message: "Name, phone, and a valid monthly amount are required" });
        return;
    }
    try {
        const password = typeof req.body.password === "string" && req.body.password.length >= 8 ? req.body.password : "password123";
        const member = await prisma_1.prisma.user.create({ data: { ...data, name: data.name, phone: data.phone, monthlyAmount: data.monthlyAmount, passwordHash: await (0, password_1.hashPassword)(password), role: "USER" }, select: memberFields });
        res.status(201).json({ success: true, data: member });
    }
    catch (error) {
        if (typeof error === "object" && error && "code" in error && error.code === "P2002") {
            res.status(409).json({ error: "Conflict", message: "A member with this phone number already exists" });
            return;
        }
        console.error("[CREATE MEMBER ERROR]", error);
        res.status(500).json({ error: "Internal Server Error", message: "Failed to create member" });
    }
});
router.get("/:id", auth_middleware_1.authenticate, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        res.status(400).json({ error: "Bad Request", message: "Invalid member ID" });
        return;
    }
    if (req.user.role === "USER" && req.user.userId !== id) {
        res.status(403).json({ error: "Forbidden", message: "You can only view your own profile" });
        return;
    }
    try {
        const member = await prisma_1.prisma.user.findUnique({ where: { id }, select: { ...memberFields, payments: { orderBy: { month: "desc" } } } });
        if (!member) {
            res.status(404).json({ error: "Not Found", message: "Member not found" });
            return;
        }
        res.json({ success: true, data: member });
    }
    catch (error) {
        console.error("[MEMBER ERROR]", error);
        res.status(500).json({ error: "Internal Server Error", message: "Failed to get member" });
    }
});
router.put("/:id", auth_middleware_1.authenticate, auth_middleware_1.ownerOrAdmin, async (req, res) => {
    const id = Number(req.params.id);
    const data = memberData(req.body);
    if (!Number.isInteger(id) || !data || Object.keys(data).length === 0) {
        res.status(400).json({ error: "Bad Request", message: "Provide a valid member ID and at least one valid field" });
        return;
    }
    try {
        res.json({ success: true, data: await prisma_1.prisma.user.update({ where: { id }, data, select: memberFields }) });
    }
    catch (error) {
        if (typeof error === "object" && error && "code" in error && error.code === "P2025") {
            res.status(404).json({ error: "Not Found", message: "Member not found" });
            return;
        }
        if (typeof error === "object" && error && "code" in error && error.code === "P2002") {
            res.status(409).json({ error: "Conflict", message: "A member with this phone number already exists" });
            return;
        }
        console.error("[UPDATE MEMBER ERROR]", error);
        res.status(500).json({ error: "Internal Server Error", message: "Failed to update member" });
    }
});
router.delete("/:id", auth_middleware_1.authenticate, auth_middleware_1.ownerOnly, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        res.status(400).json({ error: "Bad Request", message: "Invalid member ID" });
        return;
    }
    try {
        const member = await prisma_1.prisma.user.findUnique({ where: { id }, select: { role: true } });
        if (!member) {
            res.status(404).json({ error: "Not Found", message: "Member not found" });
            return;
        }
        if (member.role !== "USER") {
            res.status(403).json({ error: "Forbidden", message: "Only member accounts can be removed here" });
            return;
        }
        await prisma_1.prisma.user.update({ where: { id }, data: { isActive: false } });
        res.status(204).send();
    }
    catch (error) {
        console.error("[DELETE MEMBER ERROR]", error);
        res.status(500).json({ error: "Internal Server Error", message: "Failed to remove member" });
    }
});
exports.default = router;
//# sourceMappingURL=members.routes.js.map