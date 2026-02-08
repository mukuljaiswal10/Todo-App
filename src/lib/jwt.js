import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
    throw new Error("❌ Missing JWT secrets in env");
}

export function signAccessToken(payload) {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_TTL || "15m" });
}

export function signRefreshToken(payload) {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_TTL || "30d" });
}

export function verifyAccessToken(token) {
    return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_SECRET);
}