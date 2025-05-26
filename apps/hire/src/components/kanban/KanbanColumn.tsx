"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanCard } from "./KanbanCard";
import { ZodCandidate } from "~/server/zod/candidate";

interface KanbanColumnProps {
  id: string;
  title: string;
  candidates: ZodCandidate[];
  onCardClick: (candidate: ZodCandidate) => void;
}

const getColumnStyles = (isOver: boolean) => {
  const baseClasses =
    "transition-border flex min-w-[250px] max-w-[300px] flex-1 flex-col rounded-md border-2 p-2 shadow-md";
  const hoverClasses = isOver
    ? "border-[var(--color-grass-9)] bg-[var(--color-olive-3)]"
    : "border-[var(--color-slate-7)] bg-[var(--color-olive-2)]";
  return `${baseClasses} ${hoverClasses}`;
};

export function KanbanColumn({
  id,
  title,
  candidates,
  onCardClick,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={getColumnStyles(isOver)}>
      <h2 className="mb-2 text-center text-lg font-bold text-[var(--color-slate-12)]">
        {title}
      </h2>
      <SortableContext
        items={candidates.map((c) => c._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          {candidates.map((candidate) => (
            <KanbanCard
              key={candidate._id}
              candidate={candidate}
              onClick={() => onCardClick(candidate)}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
