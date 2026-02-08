import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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

function makeVerifyToken() {
    const token = crypto.randomBytes(32).toString("hex"); // raw
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex"); // store hash
    const tokenExp = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    return { token, tokenHash, tokenExp };
}

export async function POST(req) {
    try {
        await dbConnect();

        const body = await req.json().catch(() => ({}));
        const name = String(body?.name || "").trim();
        const email = String(body?.email || "").trim().toLowerCase();
        const password = String(body?.password || "");

        if (!name || !email || !password) {
            return NextResponse.json(
                { ok: false, message: "All fields are required" },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });

        // ✅ Exists + verified -> block
        if (existingUser && existingUser.isEmailVerified) {
            return NextResponse.json(
                { ok: false, message: "User already exists" },
                { status: 400 }
            );
        }

        // ✅ Exists but NOT verified -> regenerate token and resend
        if (existingUser && !existingUser.isEmailVerified) {
            const { token, tokenHash, tokenExp } = makeVerifyToken();

            // ✅ MODEL FIELD NAMES (IMPORTANT)
            existingUser.emailVerifyTokenHash = tokenHash;
            existingUser.emailVerifyTokenExpiresAt = tokenExp;
            await existingUser.save();

            const verifyUrl = `${getAppUrl()}/verify-email?token=${encodeURIComponent(
                token
            )}`;

            await sendMail({
                to: existingUser.email,
                subject: "Verify your email",
                html: verifyEmailTemplate({ name: existingUser.name, verifyUrl }),
            });

            return NextResponse.json({
                ok: true,
                needsVerification: true,
                message:
                    "Email already registered but not verified. Verification email sent again ✅",
            });
        }

        // ✅ New user create
        const passwordHash = await bcrypt.hash(password, 10);
        const { token, tokenHash, tokenExp } = makeVerifyToken();

        const user = await User.create({
            name,
            email,
            passwordHash,
            isEmailVerified: false,

            // ✅ MODEL FIELD NAMES
            emailVerifyTokenHash: tokenHash,
            emailVerifyTokenExpiresAt: tokenExp,
        });

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
            needsVerification: true,
            message: "Account created ✅ Verify your email to continue",
        });
    } catch (err) {
        console.error("REGISTER ERROR:", err);
        return NextResponse.json(
            { ok: false, message: err?.message || "Server error" },
            { status: 500 }
        );
    }
}