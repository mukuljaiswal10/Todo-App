import { NextResponse } from "next/server";
import crypto from "crypto";
import  dbConnect  from "@/lib/dbConnect";
import User from "@/models/User";
import { refreshCookieName, accessCookieName } from "@/lib/cookies";

function sha256(input) {
    return crypto.createHash("sha256").update(input).digest("hex");
}

export async function POST(req) {
    try {
        const rt = req.cookies.get(refreshCookieName)?.value;

        if (rt) {
            await dbConnect();
            // best effort remove token
            const tokenHash = sha256(rt);
            await User.updateOne(
                { "refreshTokens.tokenHash": tokenHash },
                { $pull: { refreshTokens: { tokenHash } } }
            );
        }

        const res = NextResponse.json({ ok: true, message: "Logged out ✅" });
        res.cookies.delete(accessCookieName);
        res.cookies.delete(refreshCookieName);
        return res;
    } catch (err) {
        return NextResponse.json({ ok: false, message: err?.message || "Server error" }, { status: 500 });
    }
}