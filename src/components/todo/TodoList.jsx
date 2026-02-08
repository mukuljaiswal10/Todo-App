"use client";

import TodoItem from "@/components/todo/TodoItem";

export default function TodoList({ items }) {
  if (!items?.length) {
    return (
      <div className="text-sm text-muted-foreground">
        No todos yet. Create your first one 👆
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((t) => (
        <TodoItem key={t._id || t.id} t={t} />
      ))}
    </div>
  );
}
