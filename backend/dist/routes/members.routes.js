"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// TODO: Implement member routes
// GET /api/members - List all members (Owner/Admin only)
router.get("/", auth_middleware_1.authenticate, auth_middleware_1.ownerOrAdmin, async (req, res) => {
    res.json({ message: "Get members - Coming soon" });
});
// POST /api/members - Create new member (Owner/Admin only)
router.post("/", auth_middleware_1.authenticate, auth_middleware_1.ownerOrAdmin, async (req, res) => {
    res.json({ message: "Create member - Coming soon" });
});
// GET /api/members/:id - Get member details
router.get("/:id", auth_middleware_1.authenticate, async (req, res) => {
    res.json({ message: "Get member details - Coming soon" });
});
exports.default = router;
//# sourceMappingURL=members.routes.js.map