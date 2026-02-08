import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
}

export async function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
}

// token to send in email (plain), but store only hash in DB
export function generateTokenPair() {
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    return { token, tokenHash };
}

export function minutesFromNow(min) {
    return new Date(Date.now() + Number(min) * 60 * 1000);
}