import { NextResponse } from "next/server";
import  dbConnect  from "@/lib/dbConnect";
import Todo from "@/models/Todo";
import { getUserIdFromRequest } from "@/lib/requireUser";
import { todoCreateSchema } from "@/lib/validators";

function toDateOrNull(v) {
    if (!v) return null;
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
}

export async function GET(req) {
    try {
        const userId = getUserIdFromRequest(req);
        if (!userId) return NextResponse.json({ ok: false, message: "Unauthenticated" }, { status: 401 });

        const { searchParams } = new URL(req.url);

        const q = (searchParams.get("q") || "").trim();
        const status = searchParams.get("status"); // todo/doing/done
        const priority = searchParams.get("priority"); // low/medium/high/urgent
        const tag = searchParams.get("tag");
        const view = searchParams.get("view"); // today/upcoming/overdue/completed
        const page = Number(searchParams.get("page") || 1);
        const limit = Math.min(Number(searchParams.get("limit") || 20), 50);

        const filter = { userId, archived: false };

        if (q) filter.title = { $regex: q, $options: "i" };
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (tag) filter.tags = tag;

        const now = new Date();

        if (view === "completed") filter.status = "done";
        if (view === "overdue") {
            filter.status = { $ne: "done" };
            filter.dueAt = { $lt: now };
        }
        if (view === "today") {
            const start = new Date(now); start.setHours(0, 0, 0, 0);
            const end = new Date(now); end.setHours(23, 59, 59, 999);
            filter.dueAt = { $gte: start, $lte: end };
        }
        if (view === "upcoming") {
            filter.status = { $ne: "done" };
            filter.dueAt = { $gte: now };
        }

        await dbConnect();

        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            Todo.find(filter).sort({ orderIndex: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
            Todo.countDocuments(filter),
        ]);

        return NextResponse.json({
            ok: true,
            items,
            meta: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (err) {
        return NextResponse.json({ ok: false, message: err?.message || "Server error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const userId = getUserIdFromRequest(req);
        if (!userId) return NextResponse.json({ ok: false, message: "Unauthenticated" }, { status: 401 });

        const body = await req.json();
        const parsed = todoCreateSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ ok: false, message: "Validation error", errors: parsed.error.flatten() }, { status: 400 });
        }

        const data = parsed.data;

        await dbConnect();

        // orderIndex = last + 1
        const last = await Todo.findOne({ userId, archived: false }).sort({ orderIndex: -1 }).select("orderIndex").lean();
        const nextOrder = (last?.orderIndex ?? 0) + 1;

        const todo = await Todo.create({
            userId,
            title: data.title,
            description: data.description || "",
            status: data.status,
            priority: data.priority,
            tags: data.tags,
            dueAt: toDateOrNull(data.dueAt),
            reminderAt: toDateOrNull(data.reminderAt),
            subtasks: data.subtasks,
            orderIndex: nextOrder,
        });

        return NextResponse.json({ ok: true, item: todo });
    } catch (err) {
        return NextResponse.json({ ok: false, message: err?.message || "Server error" }, { status: 500 });
    }
}