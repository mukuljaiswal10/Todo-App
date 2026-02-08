import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";

export async function GET() {
    await sendMail({
        to: process.env.SMTP_USER,
        subject: "Test Email ✅",
        html: "<h2>Email working ✅</h2>",
    });

    return NextResponse.json({ ok: true });
}