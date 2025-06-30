import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within, screen, fn, waitFor } from "storybook/test";
import React from "react";
import { DeleteCommentDialog } from "./delete-comment-dialog";
import { mockApi, clearMockedApi, getMockedApi } from "../../lib/convex.mock";
import { usePostHog } from "../../lib/posthog.mock";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { anchorTimestamp } from "../../utils/anchor-date";
import { ZodUser } from "../../server/zod/user";

const mockUser = {
  _id: "user123" as Id<"users">,
  _creationTime: anchorTimestamp,
  firstName: "John",
  lastName: "Doe",
  avatarUrl: "https://github.com/shadcn.png",
  role: "USER",
  clerkUserId: "clerk_user_123",
} satisfies ZodUser;

const mockProjectId = "project123" as Id<"projects">;
const mockCommentId = "comment123";

const setupMocks = () => {
  clearMockedApi();
  mockApi(
    api.comment.deleteComment,
    fn(() => ({
      ok: true,
      value: undefined,
    })).mockName("deleteComment"),
  );
};

const meta: Meta<typeof DeleteCommentDialog> = {
  title: "Hackathon/Components/Shared/DeleteCommentDialog",
  component: DeleteCommentDialog,
  parameters: {
    layout: "centered",
  },
  args: {
    projectId: mockProjectId,
    commentId: mockCommentId,
    currentUser: mockUser,
    postHogEventName: "comment_deleted",
    testIdPrefix: "delete-comment",
  },
  beforeEach() {
    setupMocks();
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Visual Matrix Stories
export const VisualMatrix: Story = {
  name: "Visual Matrix: All Delete Dialog States",
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
  render: (args) => (
    <div className="grid grid-cols-2 gap-8 p-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Closed Dialog</h3>
        <DeleteCommentDialog {...args} testIdPrefix="closed-dialog" />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Open Dialog</h3>
        <DeleteCommentDialog {...args} testIdPrefix="open-dialog" />
      </div>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Open the second dialog", async () => {
      const triggerButton = canvas.getByTestId("open-dialog-trigger-button");
      await userEvent.click(triggerButton);
    });
  },
};

// Interaction Test Stories
export const DeleteComment: Story = {
  name: "Test: Delete Comment",
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Open delete dialog", async () => {
      const triggerButton = canvas.getByTestId("delete-comment-trigger-button");
      await userEvent.click(triggerButton);

      // Verify dialog is open (dialog is rendered in portal, so use screen)
      expect(screen.getByText("Delete Comment")).toBeInTheDocument();
      expect(
        screen.getByText(/Are you sure you want to delete this comment\?/),
      ).toBeInTheDocument();
    });

    await step("Confirm deletion", async () => {
      const posthog = usePostHog();

      const confirmButton = screen.getByTestId("delete-comment-confirm-button");
      await userEvent.click(confirmButton);

      // Verify mutation was called with correct parameters
      const deleteCommentMutation = getMockedApi(api.comment.deleteComment);
      expect(deleteCommentMutation).toHaveBeenCalledWith({
        projectId: args.projectId,
        commentId: args.commentId,
      });

      // Verify PostHog tracking
      expect(posthog.capture).toHaveBeenCalledWith(args.postHogEventName, {
        projectId: args.projectId,
        commentId: args.commentId,
        userId: args.currentUser._id,
      });
    });
  },
};

export const CancelDeletion: Story = {
  name: "Test: Cancel Deletion",
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Open delete dialog", async () => {
      const triggerButton = canvas.getByTestId("delete-comment-trigger-button");
      await userEvent.click(triggerButton);

      // Verify dialog is open
      expect(screen.getByText("Delete Comment")).toBeInTheDocument();
    });

    await step("Cancel deletion", async () => {
      const cancelButton = screen.getByTestId("delete-comment-cancel-button");
      await userEvent.click(cancelButton);

      // Verify mutation was not called
      const deleteCommentMutation = getMockedApi(api.comment.deleteComment);
      expect(deleteCommentMutation).not.toHaveBeenCalled();

      // Verify dialog is closed
      await waitFor(() =>
        expect(screen.queryByText("Delete Comment")).not.toBeInTheDocument(),
      );
    });
  },
};

export const DeletingState: Story = {
  name: "Test: Deleting State",
  beforeEach() {
    clearMockedApi();
    // Mock a delayed response to show loading state
    mockApi(
      api.comment.deleteComment,
      fn(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ ok: true, value: undefined }), 2000),
          ),
      ).mockName("deleteComment"),
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Open delete dialog", async () => {
      const triggerButton = canvas.getByTestId("delete-comment-trigger-button");
      await userEvent.click(triggerButton);
    });

    await step("Show deleting state", async () => {
      const confirmButton = screen.getByTestId("delete-comment-confirm-button");
      await userEvent.click(confirmButton);

      // Verify loading state
      expect(screen.getByText("Deleting...")).toBeInTheDocument();

      // Verify buttons are disabled during deletion
      expect(screen.getByTestId("delete-comment-cancel-button")).toBeDisabled();
      expect(
        screen.getByTestId("delete-comment-confirm-button"),
      ).toBeDisabled();
    });
  },
};

export const DeleteError: Story = {
  name: "Test: Delete Error Handling",
  beforeEach() {
    clearMockedApi();
    // Mock error response
    mockApi(
      api.comment.deleteComment,
      fn(() => ({
        ok: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Not authorized to delete comment",
        },
      })).mockName("deleteComment"),
    );
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Open delete dialog", async () => {
      const triggerButton = canvas.getByTestId("delete-comment-trigger-button");
      await userEvent.click(triggerButton);
    });

    await step("Handle deletion error", async () => {
      const posthog = usePostHog();

      const confirmButton = screen.getByTestId("delete-comment-confirm-button");
      await userEvent.click(confirmButton);

      // Verify mutation was called
      const deleteCommentMutation = getMockedApi(api.comment.deleteComment);
      expect(deleteCommentMutation).toHaveBeenCalledWith({
        projectId: args.projectId,
        commentId: args.commentId,
      });

      // Verify PostHog was not called on error
      expect(posthog.capture).not.toHaveBeenCalled();

      // Verify dialog remains open on error
      expect(screen.getByText("Delete Comment")).toBeInTheDocument();

      // Verify buttons are re-enabled after error
      expect(
        screen.getByTestId("delete-comment-cancel-button"),
      ).not.toBeDisabled();
      expect(
        screen.getByTestId("delete-comment-confirm-button"),
      ).not.toBeDisabled();
    });
  },
};
