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
} from "@j5/component-library";
import { Trash2 } from "lucide-react";
import { Project } from "~/server/zod";
import { PostHog } from "posthog-js/react";
import { api } from "../../../convex/_generated/api";
import { ReactMutation } from "convex/react";
import { useState } from "react";
import { processError } from "~/lib/errors";

export interface DeleteProjectDialogProps {
  project: Project;
  deleteProjectMutation: ReactMutation<typeof api.projects.deleteProject>;
  postHog: PostHog;
}

export const DeleteProjectDialog = ({
  project,
  deleteProjectMutation,
  postHog,
}: DeleteProjectDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-11 hover:bg-destructive/80 hover:text-destructive-foreground h-9 w-9 p-0"
          dataTestId={`delete-project-${project._id}-trigger-button`}
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
                id: project._id,
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
                project_id: project._id,
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
