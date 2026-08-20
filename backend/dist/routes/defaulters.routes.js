"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const defaulter_service_1 = require("../services/defaulter.service");
const date_1 = require("../utils/date");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authenticate, auth_middleware_1.ownerOrAdmin, async (_req, res) => {
    try {
        res.json({ success: true, data: { month: (0, date_1.getCurrentMonth)(), year: (0, date_1.getCurrentYear)(), members: await (0, defaulter_service_1.getDefaulters)() } });
    }
    catch (error) {
        console.error("[DEFAULTERS ERROR]", error);
        res.status(500).json({ error: "Internal Server Error", message: "Failed to get defaulters" });
    }
});
exports.default = router;
//# sourceMappingURL=defaulters.routes.js.map