"use client";

import { Button, Input } from "@j5/component-library";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useEffect, useState, useMemo } from "react";
import { SortableTagList } from "./sortable-tag-list";

export function RolesTab({ orgId }: { orgId: string }) {
  const [roleName, setRoleName] = useState("");
  const rolesData = useQuery(api.roles.getRoles, { orgId });
  const roles = useMemo(() => rolesData || [], [rolesData]);
  const [localRoles, setLocalRoles] = useState(roles);
  const addRole = useMutation(api.roles.addRole);
  const reorderRoles = useMutation(api.roles.reorderRoles);
  const deleteRole = useMutation(api.roles.deleteRole);

  useEffect(() => {
    setLocalRoles(roles);
  }, [roles]);

  const handleAddRole = () => {
    if (!roleName.trim()) return;
    addRole({ name: roleName.trim(), orgId });
    setRoleName("");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Job Roles</h2>
      <p className="text-muted-foreground text-sm">
        Define the job roles for your organization
      </p>
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="New role name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddRole()}
          dataTestId="role-name-input"
        />
        <Button
          onClick={handleAddRole}
          disabled={!roleName.trim()}
          dataTestId="add-role-button"
        >
          Add Role
        </Button>
      </div>
      <div className="rounded-lg border p-4">
        <SortableTagList
          initialTags={
            localRoles?.map(({ _id, name, ...rest }) => ({
              value: name,
              id: _id,
              ...rest,
            })) || []
          }
          onTagsSorted={(newRoles) => {
            const updatedRoles = newRoles.map(({ id, value, ...rest }, i) => {
              return {
                _id: id,
                name: value,
                ...rest,
                order: i,
              };
            });
            setLocalRoles(updatedRoles);
            reorderRoles({ orgId, roleIds: newRoles.map((r) => r.id) });
          }}
          onTagDeleted={(tagId) => deleteRole({ orgId, _id: tagId })}
        />
      </div>
    </div>
  );
}
