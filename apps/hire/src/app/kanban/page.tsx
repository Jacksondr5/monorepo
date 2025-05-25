import React from "react";
import { KanbanBoard } from "./KanbanBoard";

export default function KanbanPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Candidate Kanban Board</h1>
      <KanbanBoard />
    </main>
  );
}
