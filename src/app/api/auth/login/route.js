import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { loginSchema } from "@/lib/validators";
import { verifyPassword } from "@/lib/auth";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import crypto from "crypto";
import {
    accessCookieName,
    refreshCookieName,
    accessCookieOpts,
    refreshCookieOpts,
} from "@/lib/cookies";

function sha256(input) {
    return crypto.createHash("sha256").update(input).digest("hex");
}

function getClientIp(req) {
    const xff = req.headers.get("x-forwarded-for") || "";
    // x-forwarded-for can be "client, proxy1, proxy2"
    const first = xff.split(",")[0].trim();
    return first || "";
}

export async function POST(req) {
    try {
        const body = await req.json().catch(() => ({}));
        const parsed = loginSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { ok: false, message: "Validation error" },
                { status: 400 }
            );
        }

        // ✅ normalize email (important)
        const email = String(parsed.data.email || "").trim().toLowerCase();
        const password = String(parsed.data.password || "");

        await dbConnect();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { ok: false, message: "Invalid credentials" },
                { status: 401 }
            );
        }

        const ok = await verifyPassword(password, user.passwordHash);
        if (!ok) {
            return NextResponse.json(
                { ok: false, message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // ✅ block until verified (your requirement)
        if (!user.isEmailVerified) {
            return NextResponse.json(
                {
                    ok: false,
                    code: "EMAIL_NOT_VERIFIED",
                    message: "Please verify your email first.",
                    // optional: frontend can show resend UI using this
                    email: user.email,
                },
                { status: 403 }
            );
        }

        const payload = { sub: String(user._id), email: user.email };

        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);

        // ✅ keep refreshTokens clean: remove expired tokens (prevents array growth)
        const now = new Date();
        user.refreshTokens = (user.refreshTokens || []).filter(
            (t) => t?.expiresAt && new Date(t.expiresAt) > now
        );

        // store hashed refresh token in DB
        const ttlDays = 30;
        user.refreshTokens.push({
            tokenHash: sha256(refreshToken),
            expiresAt: new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000),
            userAgent: req.headers.get("user-agent") || "",
            ip: getClientIp(req),
        });

        user.lastLoginAt = now;
        await user.save();

        const res = NextResponse.json({ ok: true, message: "Logged in ✅" });

        res.cookies.set(accessCookieName, accessToken, accessCookieOpts());
        res.cookies.set(refreshCookieName, refreshToken, refreshCookieOpts());

        return res;
    } catch (err) {
        return NextResponse.json(
            { ok: false, message: err?.message || "Server error" },
            { status: 500 }
        );
    }
}