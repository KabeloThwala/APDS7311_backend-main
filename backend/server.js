// backend/server.js
import fs from "fs";
import path from "path";
import https from "https";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import paymentRoutes from "./routes/payments.js";
import systemRoutes from "./routes/system.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);

// Global rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// CORS
const allowedOrigins = (
    process.env.ALLOWED_ORIGINS ||
    "https://localhost:3000,http://localhost:3000,http://localhost"
)
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

app.use(
    cors({
        origin(origin, cb) {
            if (!origin || allowedOrigins.includes(origin)) cb(null, origin);
            else cb(new Error("Origin not allowed by CORS"));
        },
        credentials: true,
    })
);

// Security headers
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                connectSrc: ["'self'", ...allowedOrigins],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "blob:"],
            },
        },
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: { policy: "cross-origin" },
        frameguard: { action: "deny" },
        hsts: { maxAge: 31536000, preload: true },
    })
);

// Request parsing + light sanitization
app.use(express.json({ limit: "10kb" }));

app.use(morgan("combined"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/system", systemRoutes);
app.get("/", (_req, res) => res.send("✅ API running securely"));

// DB
async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bankapp", {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
}

// HTTPS with fallback to HTTP
function startServer() {
    const PORT = process.env.PORT || 5000;
    const certDirectory = process.env.CERT_DIR || path.resolve("./certs");
    const keyPath = process.env.SSL_KEY || path.join(certDirectory, "key.pem");
    const certPath = process.env.SSL_CERT || path.join(certDirectory, "cert.pem");

    try {
        const httpsServer = https.createServer(
            {
                key: fs.readFileSync(keyPath),
                cert: fs.readFileSync(certPath),
            },
            app
        );
        httpsServer.listen(PORT, () =>
            console.log(`🚀 Secure server running at https://localhost:${PORT}`)
        );
    } catch (err) {
        console.error("Failed to start HTTPS server. Ensure certificates are present.", err);
        console.log("Falling back to HTTP (development only).");
        app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
    }
}

connectToDatabase().then(startServer);
