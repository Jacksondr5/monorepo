import { Button } from '@j5/component-library';

export function RolesTab() {
  // TODO: Implement roles management
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Job Roles</h2>
        <Button>Add Role</Button>
      </div>
      <div className="border rounded-lg p-4">
        <p className="text-muted-foreground">Roles list will be displayed here</p>
      </div>
    </div>
  );
}
