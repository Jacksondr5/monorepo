"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { KanbanColumn } from "./KanbanColumn";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

export function KanbanBoard({ organizationId }: { organizationId: string }) {
  const stages = useQuery(api.kanbanStages.getKanbanStages, {
    orgId: organizationId,
  });
  const candidates = useQuery(api.candidates.listCandidates, {
    orgId: organizationId,
  });
  const updateCandidateStage = useMutation(api.candidates.updateCandidateStage);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || !active) return;

    // Validate that the dragged item is a candidate
    const candidateId = active.id;
    const newStageId = over.id;
    // Ensure the dragged item is actually a candidate
    const candidate = candidates?.find((c) => c._id === candidateId);
    if (!candidate) {
      console.warn("Dragged item is not a valid candidate");
      return;
    }
    // Ensure the drop target is a valid stage
    const targetStage = stages?.find((s) => s._id === newStageId);
    if (!targetStage) {
      console.warn("Drop target is not a valid kanban stage");
      return;
    }

    if (
      candidate &&
      stages?.some((s) => s._id === newStageId) &&
      candidate.kanbanStageId !== newStageId
    ) {
      updateCandidateStage({
        candidateId: candidateId as Id<"candidates">,
        kanbanStageId: newStageId as Id<"kanbanStages">,
      });
    }
  }

  if (stages === undefined || candidates === undefined) {
    return <div>Loading Kanban board...</div>;
  }

  if (!stages || stages.length === 0) {
    return (
      <div>
        No Kanban stages found for this organization. Please configure stages.
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] gap-4 overflow-x-auto p-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {stages.map((stage) => (
          <KanbanColumn
            key={stage._id}
            id={stage._id}
            title={stage.name}
            candidates={candidates.filter((c) => c.kanbanStageId === stage._id)}
          />
        ))}
      </DndContext>
    </div>
  );
}
