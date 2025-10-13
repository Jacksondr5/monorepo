"use client";

import { useOrganization } from "@clerk/nextjs";
import { KanbanBoard } from "../../../components/kanban/KanbanBoard";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { use } from "react";
import Link from "next/link";
import { Button } from "@jacksondr5/component-library";

export default function BoardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { organization, isLoaded: isOrgLoaded } = useOrganization();
  const organizationId = organization?.id;
  const { slug } = use(params);
  const boardWithData = useQuery(
    api.boards.getBoardWithData,
    organizationId ? { slug, orgId: organizationId } : "skip",
  );

  if (
    !isOrgLoaded ||
    organizationId === undefined ||
    boardWithData === undefined
  ) {
    return (
      <div className="p-6">
        <div>Loading board data...</div>
      </div>
    );
  }

  // Handle case where orgId might be available but stages/candidates are null (e.g. no data for org)
  if (boardWithData === null) {
    return (
      <div className="p-6">
        <div>
          Could not load board data. Please check if the board exists and has
          stages/candidates, or try again later.
        </div>
      </div>
    );
  }

  const { board, stages, candidates, targetTeams } = boardWithData;

  // Filter stages based on the board's configuration
  const configuredStages = stages.filter((stage) =>
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
        <Link href={`/settings`}>
          <Button
            variant="default"
            className="mt-4"
            dataTestId="configure-stages-button"
          >
            Configure Stages
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">{board.name}</h1>
      <KanbanBoard
        stages={configuredStages}
        candidates={candidates}
        organizationId={organizationId}
        targetTeams={targetTeams}
      />
    </div>
  );
}
