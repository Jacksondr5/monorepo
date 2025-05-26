"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { KanbanColumn } from "./KanbanColumn";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type {
  CandidateId,
  ZodCandidate,
  ZodUpdateCandidate,
} from "~/server/zod/candidate";
import { KanbanStageId, ZodKanbanStage } from "~/server/zod/kanbanStage";
import { EditCandidateSheet } from "../candidate/edit-candidate-sheet";

interface KanbanBoardProps {
  stages: ZodKanbanStage[];
  candidates: ZodCandidate[];
  organizationId: string;
}

export function KanbanBoard({
  stages,
  candidates,
  organizationId,
}: KanbanBoardProps) {
  const updateCandidateStage = useMutation(api.candidates.updateCandidateStage);
  // TODO: Replace with your actual update candidate mutation
  const updateCandidateDetails = useMutation(api.candidates.updateCandidate);

  const [selectedCandidateForEdit, setSelectedCandidateForEdit] =
    useState<ZodCandidate | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || !active) return;

    const candidateId = active.id as CandidateId;
    const newStageId = over.id as KanbanStageId;

    const candidate = candidates.find((c) => c._id === candidateId);
    if (!candidate) {
      console.warn("Dragged item is not a valid candidate");
      return;
    }

    const targetStage = stages.find((s) => s._id === newStageId);
    if (!targetStage) {
      console.warn("Drop target is not a valid kanban stage");
      return;
    }

    if (candidate.kanbanStageId !== newStageId) {
      // TODO: Add loading and error state handling
      updateCandidateStage({
        candidateId: candidateId,
        kanbanStageId: newStageId,
      });
    }
  }

  const handleCardClick = (candidate: ZodCandidate) => {
    setSelectedCandidateForEdit(candidate);
    setIsEditSheetOpen(true);
  };

  const handleCloseEditSheet = () => {
    setIsEditSheetOpen(false);
  };

  const handleUpdateCandidate = async (values: ZodUpdateCandidate) => {
    if (!selectedCandidateForEdit) return;

    try {
      await updateCandidateDetails({
        orgId: organizationId,
        updateCandidate: {
          ...values,
        },
      });
      handleCloseEditSheet(); // Close sheet on successful update
    } catch (error) {
      console.error("Failed to update candidate:", error);
      // Optionally, provide user feedback (e.g., toast notification)
    }
  };

  if (stages.length === 0) {
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
            onCardClick={handleCardClick}
          />
        ))}
      </DndContext>
      {selectedCandidateForEdit && (
        <EditCandidateSheet
          candidate={selectedCandidateForEdit}
          isOpen={isEditSheetOpen}
          onOpenChange={handleCloseEditSheet}
          organizationId={organizationId}
          onSubmit={handleUpdateCandidate}
        />
      )}
    </div>
  );
}
