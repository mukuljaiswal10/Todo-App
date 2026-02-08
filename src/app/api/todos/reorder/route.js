import { NextResponse } from "next/server";
import  dbConnect  from "@/lib/dbConnect";
import Todo from "@/models/Todo";
import { getUserIdFromRequest } from "@/lib/requireUser";

export async function PATCH(req) {
    try {
        const userId = getUserIdFromRequest(req);
        if (!userId) return NextResponse.json({ ok: false, message: "Unauthenticated" }, { status: 401 });

        const { orderedIds } = await req.json();
        if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
            return NextResponse.json({ ok: false, message: "orderedIds required" }, { status: 400 });
        }

        await dbConnect();

        const ops = orderedIds.map((id, idx) => ({
            updateOne: {
                filter: { _id: id, userId, archived: false },
                update: { $set: { orderIndex: idx + 1 } },
            },
        }));

        await Todo.bulkWrite(ops);

        return NextResponse.json({ ok: true, message: "Reordered ✅" });
    } catch (err) {
        return NextResponse.json({ ok: false, message: err?.message || "Server error" }, { status: 500 });
    }
}