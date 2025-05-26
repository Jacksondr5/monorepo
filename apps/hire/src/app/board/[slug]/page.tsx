"use client";

import { useOrganization } from "@clerk/nextjs";
import { KanbanBoard } from "../../../components/kanban/KanbanBoard";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function BoardPage({ params }: { params: { slug: string } }) {
  const { organization, isLoaded: isOrgLoaded } = useOrganization();
  const organizationId = organization?.id;

  const board = useQuery(
    api.boards.getBySlug,
    organizationId ? { slug: params.slug, orgId: organizationId } : "skip",
  );

  const allStages = useQuery(
    api.kanbanStages.getKanbanStages,
    organizationId ? { orgId: organizationId } : "skip",
  );

  const candidates = useQuery(
    api.candidates.listCandidates,
    organizationId ? { orgId: organizationId } : "skip",
  );

  if (
    !isOrgLoaded ||
    organizationId === undefined ||
    allStages === undefined ||
    candidates === undefined ||
    board === undefined
  ) {
    return (
      <div className="p-6">
        <div>Loading board data...</div>
      </div>
    );
  }

  // Handle case where orgId might be available but stages/candidates are null (e.g. no data for org)
  if (!allStages || !candidates || !board) {
    // Check if loading is complete (board !== undefined) and board is null (not found)
    if (board === null && board !== undefined) {
      return (
        <div className="p-6">
          <div>Board not found.</div>
        </div>
      );
    }
    // Otherwise, it's a general data loading issue for stages/candidates or board still loading
    return (
      <div className="p-6">
        <div>
          Could not load board data. Please check if the board exists and has
          stages/candidates, or try again later.
        </div>
      </div>
    );
  }

  // Filter stages based on the board's configuration
  const configuredStages = allStages.filter((stage) =>
    board.kanbanStageIds.includes(stage._id),
  );

  if (configuredStages.length === 0 && board.kanbanStageIds.length > 0) {
    // This means the board has stage IDs configured, but none of them match the stages fetched for the org.
    // This could indicate a data consistency issue or that the referenced stages were deleted.
    return (
      <div className="p-6">
        <h1 className="mb-6 text-2xl font-bold">{board.name}</h1>
        <div>
          Warning: This board has stages configured, but they could not be
          found. Please check the board configuration or contact support.
        </div>
      </div>
    );
  } else if (configuredStages.length === 0) {
    // No stages configured for this board, or no stages exist for the company that match.
    return (
      <div className="p-6">
        <h1 className="mb-6 text-2xl font-bold">{board.name}</h1>
        <div>This board has no stages configured yet.</div>
        {/* Optionally, add a link/button to configure stages for this board */}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">{board.name}</h1>
      <KanbanBoard stages={configuredStages} candidates={candidates} />
    </div>
  );
}
