"use client";

import { Button, Input } from "@j5/component-library";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useEffect, useState } from "react";
import { useOrganization } from "@clerk/nextjs";
import { SortableTagList } from "./sortable-tag-list";

export function SourcesTab() {
  const { organization, isLoaded } = useOrganization();
  if (!isLoaded || !organization) return null;
  const orgId = organization.id;
  const sources = useQuery(api.sources.getSources, {
    orgId,
  });
  const filteredSources = sources?.map(
    ({ _creationTime, companyId, ...rest }) => ({
      ...rest,
    }),
  );
  const [localSources, setLocalSources] = useState(filteredSources);
  const addSource = useMutation(api.sources.addSource);
  const reorderSources = useMutation(api.sources.reorderSources);
  const deleteSource = useMutation(api.sources.deleteSource);

  const [sourceName, setSourceName] = useState("");

  useEffect(() => {
    setLocalSources(filteredSources);
  }, [filteredSources]);

  const handleAddSource = () => {
    if (!sourceName.trim()) return;
    addSource({ name: sourceName.trim(), orgId });
    setSourceName("");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Candidate Sources</h2>
      <p className="text-muted-foreground text-sm">
        Define the sources for your candidates
      </p>
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="New source name"
          value={sourceName}
          onChange={(e) => setSourceName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddSource()}
        />
        <Button onClick={handleAddSource} disabled={!sourceName.trim()}>
          Add Source
        </Button>
      </div>
      <div className="rounded-lg border p-4">
        <SortableTagList
          initialTags={
            localSources?.map(({ _id, name }) => ({ value: name, id: _id })) ||
            []
          }
          onTagsSorted={(newSources) => {
            const updatedSources = newSources.map(({ id, value }, i) => ({
              _id: id,
              name: value,
              order: i,
            }));
            setLocalSources(updatedSources);
            reorderSources({ sourceIds: updatedSources.map((s) => s._id) });
          }}
          onTagDeleted={(tagId) => deleteSource({ orgId, id: tagId })}
        />
      </div>
    </div>
  );
}
