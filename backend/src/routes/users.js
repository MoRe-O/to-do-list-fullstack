import { Router } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import db from "../db.js";
import { createOtp, verifyOtp, canResendOtp } from "../services/otp.js";
import { sendOtpEmail } from "../services/mailer.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/send-otp", async (req, res) => {
    const { email } = req.body;

    if (!email || !EMAIL_REGEX.test(email)) {
        return res.status(400).json({ success: false, message: "A valid email is required." });
    }

    if (!canResendOtp(email)) {
        return res.status(429).json({ success: false, message: "Please wait a moment before requesting another code." });
    }

    const code = await createOtp(email);
    await sendOtpEmail(email, code);

    res.json({ success: true, message: "Verification code sent." });
});

router.post("/verify-otp", async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ success: false, message: "Email and code are required." });
    }

    const result = await verifyOtp(email, code);
    if (!result.valid) {
        return res.status(400).json({ success: false, message: result.reason });
    }

    let user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user) {
        user = {
            id: crypto.randomUUID(),
            email,
            createdAt: new Date().toISOString(),
        };
        db.prepare("INSERT INTO users (id, email, createdAt) VALUES (?, ?, ?)").run(
            user.id,
            user.email,
            user.createdAt
        );
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "30d" });

    res.json({ success: true, token });
});

router.get("/", requireAuth, (req, res) => {
    const user = db.prepare("SELECT id, email FROM users WHERE id = ?").get(req.userId);

    if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
    }

    res.json({ success: true, email: user.email });
});

export default router;
