"use client";

import { Button, Input } from "@j5/component-library";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useEffect, useState } from "react";
import { SortableTagList } from "./sortable-tag-list";
import type { TargetTeam } from "../../../server/zod/targetTeam";

export function TargetTeamTab({ orgId }: { orgId: string }) {
  const [targetTeamName, setTargetTeamName] = useState("");
  const targetTeams = useQuery(api.targetTeams.getTargetTeams, { orgId }) || [];
  const [localTargetTeams, setLocalTargetTeams] =
    useState<TargetTeam[]>(targetTeams);
  const addTargetTeam = useMutation(api.targetTeams.addTargetTeam);
  const reorderTargetTeams = useMutation(api.targetTeams.reorderTargetTeams);
  const deleteTargetTeam = useMutation(api.targetTeams.deleteTargetTeam);

  useEffect(() => {
    setLocalTargetTeams(targetTeams);
  }, [targetTeams]);

  if (!orgId) return null;

  const handleAddTargetTeam = () => {
    if (!targetTeamName.trim()) return;
    addTargetTeam({ name: targetTeamName.trim(), orgId });
    setTargetTeamName("");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Target Teams</h2>
      <p className="text-muted-foreground text-sm">
        Define the target teams for your organization
      </p>
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="New target team name"
          value={targetTeamName}
          onChange={(e) => setTargetTeamName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTargetTeam()}
          dataTestId="target-team-name-input"
        />
        <Button
          onClick={handleAddTargetTeam}
          disabled={!targetTeamName.trim()}
          dataTestId="add-target-team-button"
        >
          Add Target Team
        </Button>
      </div>
      <div className="rounded-lg border p-4">
        <SortableTagList
          initialTags={
            localTargetTeams?.map(({ _id, name, ...rest }) => ({
              value: name,
              id: _id,
              ...rest,
            })) || []
          }
          onTagsSorted={(newTeams) => {
            const updatedTeams = newTeams.map(({ id, value, ...rest }, i) => {
              return {
                _id: id,
                name: value,
                ...rest,
                order: i,
              };
            });
            setLocalTargetTeams(updatedTeams);
            reorderTargetTeams({
              orgId,
              targetTeamIds: newTeams.map((t) => t.id),
            });
            // TODO: Add toast notification on success or failure
          }}
          onTagDeleted={(tagId) => deleteTargetTeam({ orgId, _id: tagId })}
        />
      </div>
    </div>
  );
}
