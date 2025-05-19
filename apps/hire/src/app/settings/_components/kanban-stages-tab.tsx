import { Button } from "@j5/component-library";

export function KanbanStagesTab() {
  // TODO: Implement kanban stages management
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Kanban Stages</h2>
          <p className="text-muted-foreground text-sm">
            Define the stages for your hiring pipeline
          </p>
        </div>
        <Button>Add Stage</Button>
      </div>
      <div className="rounded-lg border p-4">
        <p className="text-muted-foreground">
          Kanban stages will be displayed here
        </p>
      </div>
    </div>
  );
}
