"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDeleteTodo, useUpdateTodo } from "@/components/todo/useTodos";

function formatDue(dueAt) {
  if (!dueAt) return null;
  const d = new Date(dueAt);
  if (isNaN(d.getTime())) return null;

  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  const isToday = d >= start && d <= end;
  const isOverdue = d < now;

  return { text: d.toLocaleString(), isToday, isOverdue };
}

function PriorityBadge({ p }) {
  const map = {
    low: { label: "Low", cls: "bg-muted text-foreground" },
    medium: { label: "Medium", cls: "bg-blue-600 text-white" },
    high: { label: "High", cls: "bg-orange-600 text-white" },
    urgent: { label: "Urgent", cls: "bg-red-600 text-white" },
  };
  const v = map[p] || { label: p, cls: "bg-muted text-foreground" };
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${v.cls}`}>{v.label}</span>
  );
}

function toLocalDT(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function TodoItem({ t }) {
  const update = useUpdateTodo();
  const del = useDeleteTodo();

  const id = t._id || t.id;
  const due = formatDue(t.dueAt);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(t.title || "");
  const [priority, setPriority] = useState(t.priority || "medium");
  const [dueAt, setDueAt] = useState(toLocalDT(t.dueAt));
  const [subTitle, setSubTitle] = useState("");

  async function save() {
    await update.mutateAsync({
      id,
      patch: {
        title,
        priority,
        dueAt: dueAt ? new Date(dueAt).toISOString() : null,
      },
    });
    setEditing(false);
  }

  async function toggleDone() {
    await update.mutateAsync({
      id,
      patch: { status: t.status === "done" ? "todo" : "done" },
    });
  }

  async function addSubtask() {
    const next = [
      ...(t.subtasks || []),
      { title: subTitle.trim(), done: false },
    ];
    setSubTitle("");
    await update.mutateAsync({ id, patch: { subtasks: next } });
  }

  async function toggleSub(i) {
    const next = (t.subtasks || []).map((s, idx) =>
      idx === i ? { ...s, done: !s.done } : s,
    );
    await update.mutateAsync({ id, patch: { subtasks: next } });
  }

  async function removeSub(i) {
    const next = (t.subtasks || []).filter((_, idx) => idx !== i);
    await update.mutateAsync({ id, patch: { subtasks: next } });
  }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {!editing ? (
              <h3
                className={`font-medium truncate ${t.status === "done" ? "line-through opacity-70" : ""}`}
              >
                {t.title}
              </h3>
            ) : (
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            )}

            <PriorityBadge p={t.priority} />

            {t.status !== "done" ? (
              <Badge>Active</Badge>
            ) : (
              <Badge variant="outline">Done</Badge>
            )}
          </div>

          {/* Due */}
          {!editing ? (
            due ? (
              <p
                className={`text-sm mt-1 ${due.isOverdue ? "text-red-600" : "text-muted-foreground"}`}
              >
                Due: {due.text}
                {due.isToday ? <span className="ml-2">• Today</span> : null}
                {due.isOverdue ? <span className="ml-2">• Overdue</span> : null}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">No due date</p>
            )
          ) : (
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="datetime-local"
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
              />
            </div>
          )}

          {/* Description */}
          {t.description ? (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {t.description}
            </p>
          ) : null}

          {/* Subtasks */}
          <div className="mt-4 space-y-2">
            <div className="text-sm font-medium">Subtasks</div>

            {(t.subtasks || []).length ? (
              <div className="space-y-2">
                {(t.subtasks || []).map((s, i) => (
                  <div key={s._id || i} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!s.done}
                      onChange={() => toggleSub(i)}
                    />
                    <div
                      className={`text-sm flex-1 ${s.done ? "line-through opacity-70" : ""}`}
                    >
                      {s.title}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSub(i)}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No subtasks</div>
            )}

            <div className="flex gap-2">
              <Input
                placeholder="Add subtask..."
                value={subTitle}
                onChange={(e) => setSubTitle(e.target.value)}
              />
              <Button
                type="button"
                onClick={addSubtask}
                disabled={!subTitle.trim() || update.isPending}
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={toggleDone}
            disabled={update.isPending}
          >
            {t.status === "done" ? "Undo" : "Done"}
          </Button>

          {!editing ? (
            <Button variant="secondary" onClick={() => setEditing(true)}>
              Edit
            </Button>
          ) : (
            <Button onClick={save} disabled={update.isPending}>
              Save
            </Button>
          )}

          <Button
            variant="destructive"
            onClick={() => del.mutate(id)}
            disabled={del.isPending}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
