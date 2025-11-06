// backend/routes/admin.js
import express from "express";
import User from "../models/User.js";
import Payment from "../models/Payment.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { requireRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * Admin / employee dashboard metrics
 * GET /api/admin/dashboard
 */
router.get(
    "/dashboard",
    authMiddleware,
    requireRoles(["employee", "admin"]),
    async (_req, res) => {
        try {
            const [pending, verified, submitted, rejected] = await Promise.all([
                Payment.countDocuments({ status: "pending" }),
                Payment.countDocuments({ status: "verified" }),
                Payment.countDocuments({ status: "submitted" }),
                Payment.countDocuments({ status: "rejected" }),
            ]);
            res.json({ metrics: { pending, verified, submitted, rejected } });
        } catch (err) {
            console.error("Admin dashboard error:", err);
            res.status(500).json({ message: "Failed to load dashboard." });
        }
    }
);

/**
 * Get all users (admin only)
 * GET /api/admin/users
 */
router.get(
    "/users",
    authMiddleware,
    requireRoles(["admin"]),
    async (_req, res) => {
        try {
            const users = await User.find({}, "-password").sort({ createdAt: -1 });
            res.json(users);
        } catch (err) {
            console.error("Error fetching users:", err);
            res.status(500).json({ message: "Failed to fetch users." });
        }
    }
);

/**
 * Delete user by ID (admin only)
 * DELETE /api/admin/users/:id
 */
router.delete(
    "/users/:id",
    authMiddleware,
    requireRoles(["admin"]),
    async (req, res) => {
        try {
            const deleted = await User.findByIdAndDelete(req.params.id);
            if (!deleted) {
                res.status(404).json({ message: "User not found." });
                return;
            }
            res.json({ message: "User deleted successfully." });
        } catch (err) {
            console.error("Delete error:", err);
            res.status(500).json({ message: "Failed to delete user." });
        }
    }
);

/**
 * Promote user to admin (admin only)
 * POST /api/admin/users/:id/promote
 */
router.post(
    "/users/:id/promote",
    authMiddleware,
    requireRoles(["admin"]),
    async (req, res) => {
        try {
            const user = await User.findByIdAndUpdate(
                req.params.id,
                { role: "admin" },
                { new: true }
            );
            if (!user) {
                res.status(404).json({ message: "User not found." });
                return;
            }
            res.json({ message: `User ${user.fullName} promoted to admin.`, user });
        } catch (err) {
            console.error("Promotion error:", err);
            res.status(500).json({ message: "Failed to promote user." });
        }
    }
);

/**
 * Demote user to customer (admin only)
 * POST /api/admin/users/:id/demote
 */
router.post(
    "/users/:id/demote",
    authMiddleware,
    requireRoles(["admin"]),
    async (req, res) => {
        try {
            const user = await User.findByIdAndUpdate(
                req.params.id,
                { role: "customer" },
                { new: true }
            );
            if (!user) {
                res.status(404).json({ message: "User not found." });
                return;
            }
            res.json({ message: `User ${user.fullName} demoted to customer.`, user });
        } catch (err) {
            console.error("Demotion error:", err);
            res.status(500).json({ message: "Failed to demote user." });
        }
    }
);

/**
 * Full payments list (admin / employee)
 * GET /api/admin/payments/summary
 */
router.get(
    "/payments/summary",
    authMiddleware,
    requireRoles(["employee", "admin"]),
    async (_req, res) => {
        try {
            const payments = await Payment.find()
                .populate("userId", "fullName accountNumber")
                .sort({ createdAt: -1 });
            res.json(payments);
        } catch (err) {
            console.error("Error fetching payments summary:", err);
            res.status(500).json({ message: "Failed to fetch payments summary." });
        }
    }
);

export default router;
