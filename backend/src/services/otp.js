import bcrypt from "bcryptjs";
import crypto from "crypto";
import db from "../db.js";

const OTP_LENGTH = 6;
const OTP_EXPIRY_MS = (Number(process.env.OTP_EXPIRY_MINUTES) || 5) * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

export function generateOtpCode() {
    const min = 10 ** (OTP_LENGTH - 1);
    const max = 10 ** OTP_LENGTH - 1;
    return String(crypto.randomInt(min, max));
}

export function canResendOtp(email) {
    const latest = db
        .prepare("SELECT createdAt FROM otps WHERE email = ? ORDER BY createdAt DESC LIMIT 1")
        .get(email);

    if (!latest) return true;
    return Date.now() - latest.createdAt > RESEND_COOLDOWN_MS;
}

export async function createOtp(email) {
    const code = generateOtpCode();
    const codeHash = await bcrypt.hash(code, 10);
    const now = Date.now();

    db.prepare(
        "INSERT INTO otps (email, codeHash, expiresAt, attempts, createdAt) VALUES (?, ?, ?, 0, ?)"
    ).run(email, codeHash, now + OTP_EXPIRY_MS, now);

    return code;
}

export async function verifyOtp(email, code) {
    const record = db
        .prepare("SELECT * FROM otps WHERE email = ? ORDER BY createdAt DESC LIMIT 1")
        .get(email);

    if (!record) {
        return { valid: false, reason: "No verification code was requested for this email." };
    }

    if (record.attempts >= MAX_ATTEMPTS) {
        return { valid: false, reason: "Too many incorrect attempts. Request a new code." };
    }

    if (Date.now() > record.expiresAt) {
        return { valid: false, reason: "This code has expired. Request a new one." };
    }

    const matches = await bcrypt.compare(code, record.codeHash);

    if (!matches) {
        db.prepare("UPDATE otps SET attempts = attempts + 1 WHERE id = ?").run(record.id);
        return { valid: false, reason: "Incorrect code." };
    }

    db.prepare("DELETE FROM otps WHERE email = ?").run(email);
    return { valid: true };
}
