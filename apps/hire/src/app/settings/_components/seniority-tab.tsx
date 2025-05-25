"use client";

import { Button, Input } from "@j5/component-library";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useEffect, useState } from "react";
import { SortableTagList } from "./sortable-tag-list";

export function SeniorityTab({ orgId }: { orgId: string }) {
  const [seniorityName, setSeniorityName] = useState("");
  const seniorities = useQuery(api.seniorities.getSeniorities, { orgId }) || [];
  const [localSeniorities, setLocalSeniorities] = useState(seniorities);
  const addSeniority = useMutation(api.seniorities.addSeniority);
  const reorderSeniorities = useMutation(api.seniorities.reorderSeniorities);
  const deleteSeniority = useMutation(api.seniorities.deleteSeniority);

  useEffect(() => {
    setLocalSeniorities(seniorities);
  }, [seniorities]);

  if (!orgId) return null;

  const handleAddSeniority = () => {
    if (!seniorityName.trim()) return;
    addSeniority({ name: seniorityName.trim(), orgId });
    setSeniorityName("");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Seniority Levels</h2>
      <p className="text-muted-foreground text-sm">
        Define the seniority levels for your organization
      </p>
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="New seniority level"
          value={seniorityName}
          onChange={(e) => setSeniorityName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddSeniority()}
        />
        <Button onClick={handleAddSeniority} disabled={!seniorityName.trim()}>
          Add Level
        </Button>
      </div>
      <div className="rounded-lg border p-4">
        <SortableTagList
          initialTags={
            localSeniorities?.map(({ _id, name, ...rest }) => ({
              value: name,
              id: _id,
              ...rest,
            })) || []
          }
          onTagsSorted={(newSeniorities) => {
            const updatedSeniorities = newSeniorities.map(
              ({ id, value, ...rest }, i) => {
                return {
                  _id: id,
                  name: value,
                  ...rest,
                  order: i,
                };
              },
            );
            setLocalSeniorities(updatedSeniorities);
            reorderSeniorities({
              seniorityIds: newSeniorities.map((s) => s.id),
            });
          }}
          onTagDeleted={(tagId) => deleteSeniority({ orgId, _id: tagId })}
        />
      </div>
    </div>
  );
}
