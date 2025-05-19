"use client";

import { Button, Input, Tag } from "@j5/component-library";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { useOrganization } from "@clerk/nextjs";
import { SortableList } from "@j5/component-library";

export function SourcesTab() {
  const { organization, isLoaded } = useOrganization();
  if (!isLoaded || !organization) return null;
  const orgId = organization.id;
  const sources = useQuery(api.sources.getSources, {
    orgId,
  });
  const [sourceIds, setSourceIds] = useState(
    sources?.map((s) => ({ id: s._id })) || [],
  );
  const addSource = useMutation(api.sources.addSource);
  const updateSource = useMutation(api.sources.updateSource);
  const deleteSource = useMutation(api.sources.deleteSource);

  const [sourceName, setSourceName] = useState("");

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Candidate Sources</h2>
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Source name"
          value={sourceName}
          onChange={(e) => setSourceName(e.target.value)}
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
      <div className="flex flex-col gap-2 rounded-lg border p-4">
        <SortableList
          items={sourceIds}
          // strategy={verticalListSortingStrategy}
          onChange={setSourceIds}
          renderItem={(item) =>
            item.map(({ id, name }) => (
              <SortableList.Item key={id} id={id}>
                <Tag onDismiss={() => deleteSource({ orgId, _id: id })}>
                  <SortableList.DragHandle />
                  {name}
                </Tag>
              </SortableList.Item>
            ))
          }
        />
      </div>
    </div>
  );
}
