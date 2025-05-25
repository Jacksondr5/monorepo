"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";

interface Candidate {
  id: string;
  name: string;
  state: string;
}

export function KanbanCard({ candidate }: { candidate: Candidate }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: candidate.id });
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="select-none rounded border p-3 shadow transition-colors
        border-[var(--color-slate-7)] bg-[var(--color-olive-3)]
        text-[var(--color-slate-12)]
        hover:border-[var(--color-grass-9)]"
    >
      <span className="font-medium text-[var(--color-slate-12)]">{candidate.name}</span>
    </div>
  );
}
