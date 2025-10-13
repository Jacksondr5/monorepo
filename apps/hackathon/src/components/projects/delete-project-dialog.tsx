"use client";

import {
  Dialog,
  DialogTrigger,
  Button,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@jacksondr5/component-library";
import { Trash2 } from "lucide-react";
import { ProjectId } from "~/server/zod";
import { usePostHog } from "#lib/posthog";
import { api } from "~/convex/_generated/api";
import { useMutation } from "#lib/convex";
import { useState } from "react";
import { processError } from "~/lib/errors";

export interface DeleteProjectDialogProps {
  projectId: ProjectId;
}

export const DeleteProjectDialog = ({
  projectId,
}: DeleteProjectDialogProps) => {
  const deleteProjectMutation = useMutation(api.projects.deleteProject);

  const [isOpen, setIsOpen] = useState(false);
  const postHog = usePostHog();
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-11 hover:bg-destructive/80 hover:text-destructive-foreground h-9 w-9 p-0"
          dataTestId={`delete-project-${projectId}-trigger-button`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
        </DialogHeader>
        <p className="py-4 text-center">
          Are you sure you want to delete this project? <br />
          This action cannot be undone.
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" dataTestId="delete-project-cancel-button">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={async () => {
              const deleteProjectResult = await deleteProjectMutation({
                id: projectId,
              });
              if (!deleteProjectResult.ok) {
                processError(
                  deleteProjectResult.error,
                  "Failed to delete project",
                );
                setIsOpen(false);
                return;
              }
              postHog.capture("project_deleted", {
                project_id: projectId,
              });
              setIsOpen(false);
            }}
            dataTestId="delete-project-confirm-button"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
