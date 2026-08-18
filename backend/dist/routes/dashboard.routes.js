"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// TODO: Implement dashboard routes
// GET /api/dashboard/summary - Dashboard summary stats
router.get("/summary", auth_middleware_1.authenticate, async (req, res) => {
    res.json({ message: "Dashboard summary - Coming soon" });
});
// GET /api/dashboard/defaulters - List defaulters for current month
router.get("/defaulters", auth_middleware_1.authenticate, async (req, res) => {
    res.json({ message: "Defaulters list - Coming soon" });
});
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map