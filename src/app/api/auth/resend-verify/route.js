import { NextResponse } from "next/server";
import crypto from "crypto";

import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { sendMail } from "@/lib/mailer";
import { verifyEmailTemplate } from "@/lib/emailTemplates";

function getAppUrl() {
    const url =
        process.env.NEXT_PUBLIC_APP_URL ||
        process.env.APP_URL ||
        "http://localhost:3000";

    return String(url).trim().replace(/\/+$/, "");
}

export async function POST(req) {
    try {
        await dbConnect();

        const body = await req.json().catch(() => ({}));
        const email = String(body?.email || "").trim().toLowerCase();

        if (!email) {
            return NextResponse.json(
                { ok: false, message: "Email required" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });

        // ✅ Security: don’t reveal if user exists
        if (!user) {
            return NextResponse.json({
                ok: true,
                message: "If account exists, verification email sent.",
            });
        }

        if (user.isEmailVerified) {
            return NextResponse.json({
                ok: true,
                message: "Email already verified ✅",
            });
        }

        const token = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

        // ✅ MODEL FIELD NAMES
        user.emailVerifyTokenHash = tokenHash;
        user.emailVerifyTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await user.save();

        const verifyUrl = `${getAppUrl()}/verify-email?token=${encodeURIComponent(
            token
        )}`;

        await sendMail({
            to: user.email,
            subject: "Verify your email",
            html: verifyEmailTemplate({ name: user.name, verifyUrl }),
        });

        return NextResponse.json({
            ok: true,
            message: "Verification email sent ✅ Please check inbox/spam.",
        });
    } catch (e) {
        return NextResponse.json(
            { ok: false, message: e?.message || "Failed to resend" },
            { status: 500 }
        );
    }
}