import { Button } from '@j5/component-library';

export function SeniorityTab() {
  // TODO: Implement seniority levels management
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Seniority Levels</h2>
        <Button>Add Level</Button>
      </div>
      <div className="border rounded-lg p-4">
        <p className="text-muted-foreground">Seniority levels will be displayed here</p>
      </div>
    </div>
  );
}
