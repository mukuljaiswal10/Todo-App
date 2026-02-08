import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import User from "@/models/User";
import { sendMail } from "@/lib/mailer";
import { forgotPasswordEmail } from "@/lib/emailTemplates";
import crypto from "crypto";

export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { ok: false, message: "Email is required" },
                { status: 400 }
            );
        }

        await dbConnect();

        const user = await User.findOne({
            email: email.toLowerCase(),
        });

        // ✅ Security: always return success
        if (!user) {
            return NextResponse.json({
                ok: true,
                message: "If account exists, reset link sent",
            });
        }

        const token = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        user.resetTokenHash = tokenHash;
        user.resetTokenExp = new Date(
            Date.now() + Number(process.env.RESET_TOKEN_EXP || 3600000)
        );

        await user.save();


        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://localhost:3000";

        const resetUrl = `${baseUrl}/reset-password?token=${token}`;

        await sendMail({
            to: user.email,
            subject: "Reset your password",
            html: forgotPasswordEmail(resetUrl),
        });

        return NextResponse.json({
            ok: true,
            message: "If account exists, reset link sent",
        });
    } catch (err) {
        console.error("FORGOT PASSWORD ERROR:", err);
        return NextResponse.json(
            { ok: false, message: "Something went wrong" },
            { status: 500 }
        );
    }
}