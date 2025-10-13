"use client";

import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  Button,
  Dialog,
  DialogTrigger,
} from "@jacksondr5/component-library";
import { ZodUser } from "~/server/zod/user";
import { CommentId } from "~/server/zod";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { processError } from "~/lib/errors";
import { Id } from "~/convex/_generated/dataModel";
import { usePostHog } from "#lib/posthog";
import { useMutation } from "#lib/convex";
import { api } from "~/convex/_generated/api";

export interface DeleteCommentDialogProps<
  TProjectId extends Id<"projects" | "finalizedProjects">,
> {
  projectId: TProjectId;
  commentId: CommentId;
  currentUser: ZodUser;
  postHogEventName: string;
  testIdPrefix: string;
}

export const DeleteCommentDialog = <
  TProjectId extends Id<"projects" | "finalizedProjects">,
>({
  projectId,
  commentId,
  currentUser,
  postHogEventName,
  testIdPrefix,
}: DeleteCommentDialogProps<TProjectId>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const postHog = usePostHog();
  const deleteCommentMutation = useMutation(api.comment.deleteComment);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteCommentMutation({
        projectId,
        commentId,
      });

      if (!result.ok) {
        processError(result.error, "Failed to delete comment");
        return;
      }

      postHog.capture(postHogEventName, {
        projectId,
        commentId,
        userId: currentUser._id,
      });

      // Only close dialog on successful deletion
      setIsOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive-foreground hover:bg-destructive/80 hover:text-destructive-foreground h-auto p-1"
          dataTestId={`${testIdPrefix}-trigger-button`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Comment</DialogTitle>
        </DialogHeader>
        <p className="py-4 text-center">
          Are you sure you want to delete this comment? <br />
          This action cannot be undone.
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              dataTestId={`${testIdPrefix}-cancel-button`}
              disabled={isDeleting}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            dataTestId={`${testIdPrefix}-confirm-button`}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
