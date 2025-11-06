// backend/routes/payments.js
import express from "express";
import Payment from "../models/Payment.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { requireRoles } from "../middleware/roleMiddleware.js";
import { validatePaymentPayload, validateStatusUpdate } from "../middleware/validation.js";

const router = express.Router();

/**
 * Create payment (customer)
 * POST /api/payments/create
 */
router.post(
    "/create",
    authMiddleware,
    requireRoles(["customer"]),
    validatePaymentPayload,
    async (req, res) => {
        try {
            const payment = await Payment.create({
                userId: req.user.id,
                amount: req.body.amount,
                currency: req.body.currency,
                provider: req.body.provider,
                recipientAccount: req.body.recipientAccount,
                swiftCode: req.body.swiftCode,
                reference: req.body.reference || "N/A",
                status: "pending",
            });

            res.status(201).json({ message: "Payment created successfully.", payment });
        } catch (err) {
            console.error("Payment creation error:", err);
            res.status(500).json({ message: "Failed to create payment." });
        }
    }
);

/**
 * Payment history (customer)
 * GET /api/payments/history
 */
router.get(
    "/history",
    authMiddleware,
    requireRoles(["customer"]),
    async (req, res) => {
        try {
            const payments = await Payment.find({ userId: req.user.id }).sort({ createdAt: -1 });
            res.json(payments);
        } catch (err) {
            console.error("Fetch payment history error:", err);
            res.status(500).json({ message: "Failed to fetch payment history." });
        }
    }
);

/**
 * All payments (admin/employee)
 * GET /api/payments/all
 */
router.get(
    "/all",
    authMiddleware,
    requireRoles(["employee", "admin"]),
    async (_req, res) => {
        try {
            const payments = await Payment.find()
                .populate("userId", "fullName accountNumber")
                .sort({ createdAt: -1 });
            res.json(payments);
        } catch (err) {
            console.error("Fetch all payments error:", err);
            res.status(500).json({ message: "Failed to fetch payments." });
        }
    }
);

/**
 * Update status (admin/employee)
 * PUT /api/payments/:id/status
 */
router.put(
    "/:id/status",
    authMiddleware,
    requireRoles(["employee", "admin"]),
    validateStatusUpdate,
    async (req, res) => {
        try {
            const updated = await Payment.findByIdAndUpdate(
                req.params.id,
                { status: req.body.status },
                { new: true }
            );
            if (!updated) {
                res.status(404).json({ message: "Payment not found." });
                return;
            }
            res.json({ message: "Payment status updated.", payment: updated });
        } catch (err) {
            console.error("Update payment status error:", err);
            res.status(500).json({ message: "Failed to update payment status." });
        }
    }
);

export default router;
