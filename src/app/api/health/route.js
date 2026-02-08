import { NextResponse } from "next/server";
import  dbConnect  from "@/lib/dbConnect";

export async function GET() {
    await dbConnect();
    return NextResponse.json({ ok: true, message: "DB connected ✅" });
}