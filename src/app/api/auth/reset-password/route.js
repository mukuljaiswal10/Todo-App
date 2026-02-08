import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { token, password } = await req.json();
        if (!token || !password) {
            return NextResponse.json({ ok: false, message: "Token & password required" }, { status: 400 });
        }

        await dbConnect();

        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetTokenHash: tokenHash,
            resetTokenExp: { $gt: new Date() },
        });

        if (!user) {
            return NextResponse.json({ ok: false, message: "Token invalid or expired" }, { status: 400 });
        }

        user.passwordHash = await bcrypt.hash(password, 10);
        user.resetTokenHash = null;
        user.resetTokenExp = null;
        await user.save();

        return NextResponse.json({ ok: true, message: "Password updated ✅" });
    } catch (e) {
        console.log("RESET_PASSWORD_ERROR:", e);
        return NextResponse.json({ ok: false, message: "Reset failed" }, { status: 500 });
    }
}