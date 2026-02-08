import { NextResponse } from "next/server";
import crypto from "crypto";

import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET(req) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const token = String(searchParams.get("token") || "").trim();

        if (!token) {
            return NextResponse.json(
                { ok: false, message: "Token missing" },
                { status: 400 }
            );
        }

        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            // ✅ MODEL FIELD NAMES
            emailVerifyTokenHash: tokenHash,
            emailVerifyTokenExpiresAt: { $gt: new Date() },
        });

        if (!user) {
            return NextResponse.json(
                { ok: false, message: "Invalid or expired token" },
                { status: 400 }
            );
        }

        if (user.isEmailVerified) {
            return NextResponse.json({
                ok: true,
                message: "Email already verified ✅",
            });
        }

        user.isEmailVerified = true;

        // ✅ Clear token after use
        user.emailVerifyTokenHash = null;
        user.emailVerifyTokenExpiresAt = null;

        await user.save();

        return NextResponse.json({ ok: true, message: "Email verified ✅" });
    } catch (e) {
        return NextResponse.json(
            { ok: false, message: e?.message || "Verification failed" },
            { status: 500 }
        );
    }
}