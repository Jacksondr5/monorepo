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
} from "@j5/component-library";
import { ZodUser } from "../../server/zod/user";
import { PostHog } from "posthog-js/react";
import { ReactMutation } from "convex/react";
import { CommentId } from "~/server/zod";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { processError } from "~/lib/errors";

export interface DeleteCommentDialogProps<TProjectId> {
  projectId: TProjectId;
  commentId: CommentId;
  currentUser: ZodUser;
  postHog: PostHog;
  deleteCommentMutation: ReactMutation<any>;
  postHogEventName: string;
  testIdPrefix?: string;
}

export const DeleteCommentDialog = <TProjectId,>({
  projectId,
  commentId,
  currentUser,
  postHog,
  deleteCommentMutation,
  postHogEventName,
  testIdPrefix = "delete-comment",
}: DeleteCommentDialogProps<TProjectId>) => {
  const [isOpen, setIsOpen] = useState(false);

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
            >
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="destructive"
              dataTestId={`${testIdPrefix}-confirm-button`}
              onClick={async () => {
                const result = await deleteCommentMutation({
                  projectId,
                  commentId,
                });
                if (!result.ok) {
                  processError(result.error, "Failed to delete comment");
                  setIsOpen(false);
                  return;
                }
                postHog.capture(postHogEventName, {
                  projectId,
                  commentId,
                  userId: currentUser._id,
                });
                setIsOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
