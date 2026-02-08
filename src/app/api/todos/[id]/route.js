import { NextResponse } from "next/server";
import  dbConnect from "@/lib/dbConnect";
import Todo from "@/models/Todo";
import { getUserIdFromRequest } from "@/lib/requireUser";
import { todoUpdateSchema } from "@/lib/validators";

function toDateOrUndefined(v) {
    if (v === null) return null;
    if (typeof v === "undefined") return undefined;
    const d = new Date(v);
    return isNaN(d.getTime()) ? undefined : d;
}

async function getId(ctx) {
    const p = await ctx.params;      // ✅ Next.js 16 fix
    return p.id;
}

export async function PATCH(req, ctx) {
    try {
        const userId = getUserIdFromRequest(req);
        if (!userId) return NextResponse.json({ ok: false, message: "Unauthenticated" }, { status: 401 });

        const id = await getId(ctx);

        const body = await req.json();
        const parsed = todoUpdateSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ ok: false, message: "Validation error", errors: parsed.error.flatten() }, { status: 400 });
        }

        const d = parsed.data;

        const update = {};
        if (typeof d.title !== "undefined") update.title = d.title;
        if (typeof d.description !== "undefined") update.description = d.description;
        if (typeof d.status !== "undefined") {
            update.status = d.status;
            update.completedAt = d.status === "done" ? new Date() : null;
        }
        if (typeof d.priority !== "undefined") update.priority = d.priority;
        if (typeof d.tags !== "undefined") update.tags = d.tags;
        if (typeof d.subtasks !== "undefined") update.subtasks = d.subtasks;

        const due = toDateOrUndefined(d.dueAt);
        if (typeof due !== "undefined") update.dueAt = due;

        const rem = toDateOrUndefined(d.reminderAt);
        if (typeof rem !== "undefined") update.reminderAt = rem;

        await dbConnect();

        const item = await Todo.findOneAndUpdate(
            { _id: id, userId, archived: false },
            { $set: update },
            { new: true }
        );

        if (!item) return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });

        return NextResponse.json({ ok: true, item });
    } catch (err) {
        return NextResponse.json({ ok: false, message: err?.message || "Server error" }, { status: 500 });
    }
}

export async function DELETE(req, ctx) {
    try {
        const userId = getUserIdFromRequest(req);
        if (!userId) return NextResponse.json({ ok: false, message: "Unauthenticated" }, { status: 401 });

        const id = await getId(ctx);

        await dbConnect();

        const item = await Todo.findOneAndUpdate(
            { _id: id, userId, archived: false },
            { $set: { archived: true } },
            { new: true }
        );

        if (!item) return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });

        return NextResponse.json({ ok: true, message: "Deleted ✅" });
    } catch (err) {
        return NextResponse.json({ ok: false, message: err?.message || "Server error" }, { status: 500 });
    }
}