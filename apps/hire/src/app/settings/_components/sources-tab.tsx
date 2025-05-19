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
  const [localSources, setLocalSources] = useState(sources);
  const addSource = useMutation(api.sources.addSource);
  const reorderSources = useMutation(api.sources.reorderSources);
  const deleteSource = useMutation(api.sources.deleteSource);

  const [sourceName, setSourceName] = useState("");

  useEffect(() => {
    setLocalSources(sources);
  }, [sources]);

  console.log(localSources);
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Candidate Sources</h2>
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="New source name"
          value={sourceName}
          onChange={(e) => setSourceName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addSource({ name: sourceName, orgId });
              setSourceName("");
            }
          }}
        />
        <Button
          onClick={() => {
            addSource({ name: sourceName, orgId });
            setSourceName("");
          }}
        >
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
            setLocalSources(
              newSources.map(({ id, value }, i) => ({
                _id: id,
                name: value,
                order: i,
              })),
            );
            reorderSources({ sourceIds: newSources.map((s) => s.id) });
          }}
          onTagDeleted={(tagId) => deleteSource({ orgId, _id: tagId })}
        />
      </div>
    </div>
  );
}
