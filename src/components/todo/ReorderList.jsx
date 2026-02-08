"use client";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import TodoItem from "@/components/todo/TodoItem";
import { useUpdateTodo } from "@/components/todo/useTodos";

export default function ReorderList({ items }) {
  const update = useUpdateTodo();
  const [local, setLocal] = useState(items);

  // keep in sync when server changes
  useMemo(() => setLocal(items), [items]);

  function onDragEnd(e) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const oldIndex = local.findIndex((x) => (x._id || x.id) === active.id);
    const newIndex = local.findIndex((x) => (x._id || x.id) === over.id);

    const next = arrayMove(local, oldIndex, newIndex);
    setLocal(next);

    // Persist orderIndex (server needs it)
    next.forEach((todo, idx) => {
      update.mutate({
        id: todo._id || todo.id,
        patch: { orderIndex: idx + 1 },
      });
    });
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext
        items={local.map((t) => t._id || t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {local.map((t) => (
            <TodoItem key={t._id || t.id} t={t} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
