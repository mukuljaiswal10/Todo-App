import { NextResponse } from "next/server";
import crypto from "crypto";
import  dbConnect  from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyRefreshToken, signAccessToken, signRefreshToken } from "@/lib/jwt";
import {
    accessCookieName,
    refreshCookieName,
    accessCookieOpts,
    refreshCookieOpts,
} from "@/lib/cookies";

function sha256(input) {
    return crypto.createHash("sha256").update(input).digest("hex");
}

export async function POST(req) {
    try {
        const rt = req.cookies.get(refreshCookieName)?.value;
        if (!rt) return NextResponse.json({ ok: false, message: "No refresh token" }, { status: 401 });

        let payload;
        try {
            payload = verifyRefreshToken(rt); // { sub, email, iat, exp }
        } catch {
            return NextResponse.json({ ok: false, message: "Invalid refresh token" }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findById(payload.sub);
        if (!user) return NextResponse.json({ ok: false, message: "User not found" }, { status: 401 });

        const oldHash = sha256(rt);

        // old refresh token must exist in DB
        const idx = user.refreshTokens.findIndex((t) => t.tokenHash === oldHash);
        if (idx === -1) {
            // token reuse detected -> revoke all sessions
            user.refreshTokens = [];
            await user.save();
            const res = NextResponse.json({ ok: false, message: "Session revoked" }, { status: 401 });
            res.cookies.delete(accessCookieName);
            res.cookies.delete(refreshCookieName);
            return res;
        }

        // remove old token (rotation)
        user.refreshTokens.splice(idx, 1);

        const newPayload = { sub: String(user._id), email: user.email };
        const newAT = signAccessToken(newPayload);
        const newRT = signRefreshToken(newPayload);

        // store new refresh token
        const ttlDays = 30;
        user.refreshTokens.push({
            tokenHash: sha256(newRT),
            expiresAt: new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000),
            userAgent: req.headers.get("user-agent") || "",
            ip: req.headers.get("x-forwarded-for") || "",
        });

        await user.save();

        const res = NextResponse.json({ ok: true, message: "Refreshed ✅" });
        res.cookies.set(accessCookieName, newAT, accessCookieOpts());
        res.cookies.set(refreshCookieName, newRT, refreshCookieOpts());
        return res;
    } catch (err) {
        return NextResponse.json({ ok: false, message: err?.message || "Server error" }, { status: 500 });
    }
}