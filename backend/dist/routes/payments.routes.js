"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// TODO: Implement payment routes
// GET /api/payments/:userId - Get user payments
router.get("/:userId", auth_middleware_1.authenticate, async (req, res) => {
    res.json({ message: "Get payments - Coming soon" });
});
// POST /api/payments - Record new payment (Owner/Admin only)
router.post("/", auth_middleware_1.authenticate, auth_middleware_1.ownerOrAdmin, async (req, res) => {
    res.json({ message: "Create payment - Coming soon" });
});
exports.default = router;
//# sourceMappingURL=payments.routes.js.map