"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";

// Example candidate data
const initialCandidates = [
  { id: "1", name: "Alice Johnson", state: "Applied" },
  { id: "2", name: "Bob Smith", state: "Interviewing" },
  { id: "3", name: "Charlie Lee", state: "Offer" },
  { id: "4", name: "Dana White", state: "Applied" },
  { id: "5", name: "Evan Green", state: "Hired" },
];

const STATES = ["Applied", "Interviewing", "Offer", "Hired"];

export function KanbanBoard() {
  const [candidates, setCandidates] = useState(initialCandidates);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    // If dropped onto a column, move to that state
    if (STATES.includes(overId)) {
      setCandidates((prev) =>
        prev.map((c) => (c.id === activeId ? { ...c, state: overId } : c)),
      );
    }
  }

  return (
    <div className="flex min-h-[80vh] gap-4 overflow-x-auto p-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {STATES.map((state) => (
          <KanbanColumn
            key={state}
            id={state}
            title={state}
            candidates={candidates.filter((c) => c.state === state)}
          />
        ))}
      </DndContext>
    </div>
  );
}
