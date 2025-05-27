"use client";

import React, { memo } from "react";
import { useDraggable } from "@dnd-kit/core";
import { ZodCandidate } from "~/server/zod/candidate";
import type { TargetTeam } from "~/server/zod/targetTeam";

export const KanbanCard = memo(function KanbanCard({
  candidate,
  onClick,
  targetTeams,
}: {
  candidate: ZodCandidate;
  onClick: (candidate: ZodCandidate) => void;
  targetTeams: TargetTeam[];
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: candidate._id });
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  const targetTeamName = candidate.targetTeamId
    ? targetTeams.find((tt) => tt._id === candidate.targetTeamId)?.name
    : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onClick(candidate)}
      className="cursor-pointer select-none rounded border border-[var(--color-slate-7)] bg-[var(--color-olive-3)] p-3 text-[var(--color-slate-12)] shadow transition-colors hover:border-[var(--color-grass-9)]"
    >
      <span className="font-medium text-[var(--color-slate-12)]">
        {candidate.name}
      </span>
      {targetTeamName && (
        <span className="mt-1 block text-xs text-[var(--color-slate-11)]">
          {targetTeamName}
        </span>
      )}
    </div>
  );
});
