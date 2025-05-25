"use client";

import React from "react";
import { KanbanBoard } from "./KanbanBoard";
import { useOrganization } from "@clerk/nextjs";

export default function KanbanPage() {
  const { organization } = useOrganization();
  const organizationId = organization?.id;
  if (!organizationId) {
    return null;
  }
  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Candidate Kanban Board</h1>
      <KanbanBoard organizationId={organizationId} />
    </main>
  );
}
