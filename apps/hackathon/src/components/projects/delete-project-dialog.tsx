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
import { captureException } from "@sentry/nextjs";

export interface DeleteProjectDialogProps {
  isOpen: boolean;
  setIsOpen: (newOpen: boolean) => void;
  project: Project;
  deleteProjectMutation: ReactMutation<typeof api.projects.deleteProject>;
  postHog: PostHog;
}

export const DeleteProjectDialog = ({
  isOpen,
  setIsOpen,
  project,
  deleteProjectMutation,
  postHog,
}: DeleteProjectDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-11 hover:bg-destructive/80 hover:text-destructive-foreground h-9 w-9 p-0"
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
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={async () => {
              try {
                await deleteProjectMutation({ id: project._id });
                postHog.capture("project_deleted", {
                  project_id: project._id,
                });
                setIsOpen(false);
                // Optionally, you might want to navigate the user away or refresh the list
              } catch (error) {
                console.error("Failed to delete project:", error);
                captureException(error);
                // TODO: use toast to show error
                setIsOpen(false);
              }
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
