import { NextResponse } from "next/server";
import  dbConnect  from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyAccessToken } from "@/lib/jwt";
import { accessCookieName } from "@/lib/cookies";

export async function GET(req) {
    try {
        const at = req.cookies.get(accessCookieName)?.value;
        if (!at) return NextResponse.json({ ok: false, message: "Unauthenticated" }, { status: 401 });

        let payload;
        try {
            payload = verifyAccessToken(at);
        } catch {
            return NextResponse.json({ ok: false, message: "Access token expired" }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findById(payload.sub).select("_id name email isEmailVerified createdAt").lean();
        if (!user) return NextResponse.json({ ok: false, message: "User not found" }, { status: 401 });

        return NextResponse.json({ ok: true, user });
    } catch (err) {
        return NextResponse.json({ ok: false, message: err?.message || "Server error" }, { status: 500 });
    }
}