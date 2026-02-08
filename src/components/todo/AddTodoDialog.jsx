"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateTodo } from "@/components/todo/useTodos";

function toISO(localValue) {
  // local datetime-local -> ISO
  return localValue ? new Date(localValue).toISOString() : null;
}

export default function AddTodoDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueAt, setDueAt] = useState("");
  const [tags, setTags] = useState("");
  const create = useCreateTodo();

  function setQuickDue(type) {
    const d = new Date();
    if (type === "today") d.setHours(23, 59, 0, 0);
    if (type === "tomorrow") d.setDate(d.getDate() + 1);
    if (type === "week") d.setDate(d.getDate() + 7);
    // convert to datetime-local string
    const pad = (n) => String(n).padStart(2, "0");
    const v = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    setDueAt(v);
  }

  async function submit(e) {
    e.preventDefault();

    const tagArr = tags
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    await create.mutateAsync({
      title,
      description,
      priority,
      dueAt: toISO(dueAt),
      tags: tagArr,
    });

    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueAt("");
    setTags("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Todo</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create new todo</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <Input
            placeholder="Todo title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              title="Due date"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setQuickDue("today")}
            >
              Today
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setQuickDue("tomorrow")}
            >
              Tomorrow
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setQuickDue("week")}
            >
              +7 Days
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setDueAt("")}
            >
              Clear due
            </Button>
          </div>

          <Input
            placeholder="Tags (comma separated) e.g. work, personal"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          <Button disabled={create.isPending} className="w-full">
            {create.isPending ? "Creating..." : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
