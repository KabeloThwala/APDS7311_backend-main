// backend/routes/system.js
import express from "express";

const router = express.Router();

/**
 * Health check
 * GET /api/system/health
 */
router.get("/health", (_req, res) => {
    res.json({
        status: "OK",
        message: "Server is healthy",
        time: new Date().toISOString(),
    });
});

export default router;
