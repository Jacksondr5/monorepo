"use client";

import { Button, Input } from "@j5/component-library";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useEffect, useState } from "react";
import { useOrganization } from "@clerk/nextjs";
import { SortableTagList } from "./sortable-tag-list";

export function KanbanStagesTab() {
  const { organization, isLoaded } = useOrganization();
  const [stageName, setStageName] = useState("");

  if (!isLoaded || !organization) return null;

  const orgId = organization.id;
  const stages = useQuery(api.kanbanStages.getKanbanStages, { orgId }) || [];
  const [localStages, setLocalStages] = useState(stages);
  const addStage = useMutation(api.kanbanStages.addKanbanStage);
  const reorderStages = useMutation(api.kanbanStages.reorderKanbanStages);
  const deleteStage = useMutation(api.kanbanStages.deleteKanbanStage);

  useEffect(() => {
    setLocalStages(stages);
  }, [stages]);

  const handleAddStage = () => {
    if (!stageName.trim()) return;
    addStage({ name: stageName.trim(), orgId });
    setStageName("");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Kanban Stages</h2>
      <p className="text-muted-foreground text-sm">
        Define the stages for your hiring pipeline
      </p>
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="New stage name"
          value={stageName}
          onChange={(e) => setStageName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddStage()}
        />
        <Button onClick={handleAddStage} disabled={!stageName.trim()}>
          Add Stage
        </Button>
      </div>
      <div className="rounded-lg border p-4">
        <SortableTagList
          initialTags={
            localStages?.map(({ _id, name }) => ({ value: name, id: _id })) ||
            []
          }
          onTagsSorted={(newStages) => {
            // Find the original stage to get all required fields
            const updatedStages = newStages.map(({ id, value }, i) => {
              const originalStage = localStages.find((s) => s._id === id);
              return {
                ...originalStage!,
                _id: id,
                name: value,
                order: i,
              };
            });
            setLocalStages(updatedStages);
            reorderStages({ stageIds: newStages.map((s) => s.id) });
          }}
          onTagDeleted={(tagId) => deleteStage({ orgId, _id: tagId })}
        />
      </div>
    </div>
  );
}
