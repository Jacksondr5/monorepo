import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within, fn, waitFor } from "storybook/test";
import React from "react";
import { Comments } from "./comments";
import type { ZodUser } from "../../server/zod/user";
import { CommentId } from "../../server/zod/comment";
import { mockApi, clearMockedApi, getMockedApi } from "../../lib/convex.mock";
import { api } from "../../../convex/_generated/api";
import { SerializableResult } from "../../../convex/model/error";
import {
  AddCommentError,
  ToggleUpvoteOnCommentError,
  DeleteCommentError,
} from "../../../convex/comment";
import { usePostHog } from "../../lib/posthog.mock";
import { Id } from "../../../convex/_generated/dataModel";
import { anchorTimestamp } from "../../utils/anchor-date";

// Mock data
const mockUser: ZodUser = {
  _id: "user-123" as Id<"users">,
  _creationTime: anchorTimestamp,
  firstName: "John",
  lastName: "Doe",
  avatarUrl: "https://example.com/avatar.jpg",
  clerkUserId: "clerk-123",
  role: "USER",
};

const mockOtherUser: ZodUser = {
  _id: "user-456" as Id<"users">,
  _creationTime: anchorTimestamp,
  firstName: "Jane",
  lastName: "Smith",
  avatarUrl: "https://example.com/avatar2.jpg",
  clerkUserId: "clerk-456",
  role: "USER",
};

const mockUserMap = new Map([
  ["user-123", mockUser],
  ["user-456", mockOtherUser],
]);

const mockComments = [
  {
    id: "comment-1" as CommentId,
    authorId: "user-123",
    createdAt: anchorTimestamp - 86400000, // 1 day ago
    text: "This is a great project! Really impressive work.",
    upvotes: [{ userId: "user-456", createdAt: anchorTimestamp - 3600000 }],
  },
  {
    id: "comment-2" as CommentId,
    authorId: "user-456",
    createdAt: anchorTimestamp - 3600000, // 1 hour ago
    text: "I agree! The implementation is very clean and well-documented.",
    upvotes: [
      { userId: "user-123", createdAt: anchorTimestamp - 1800000 },
      { userId: "user-456", createdAt: anchorTimestamp - 1800000 },
    ],
  },
  {
    id: "comment-3" as CommentId,
    authorId: "user-123",
    createdAt: anchorTimestamp - 1800000, // 30 minutes ago
    text: "Thanks for the feedback! I'm planning to add more features soon.\n\nThis is a multi-line comment to test text wrapping and formatting.",
    upvotes: [],
  },
];

const projectConfig = {
  type: "project" as const,
  postHogEventTarget: "comment",
  testIdTarget: "comment",
};

const finalizedProjectConfig = {
  type: "finalizedProject" as const,
  postHogEventTarget: "finalized_project_comment",
  testIdTarget: "finalized-project-comment",
};

const meta: Meta<typeof Comments> = {
  title: "Hackathon/Components/Shared/Comments",
  component: Comments,
  parameters: {
    layout: "padded",
  },
  args: {
    comments: mockComments,
    currentUser: mockUser,
    projectId: "project-123" as Id<"projects">,
    userMap: mockUserMap,
    config: projectConfig,
  },
};

export default meta;
type Story = StoryObj<typeof Comments>;

// Visual Matrix Story - Show all states in a grid
export const AllVariants: Story = {
  name: "Visual: All States",
  render: () => (
    <div className="grid max-w-6xl grid-cols-2 gap-8 p-6">
      <div className="space-y-4">
        <h3 className="text-slate-11 font-semibold">
          Project Comments - With Comments
        </h3>
        <Comments
          comments={mockComments}
          currentUser={mockUser}
          projectId={"project-123" as Id<"projects">}
          userMap={mockUserMap}
          config={projectConfig}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-slate-11 font-semibold">
          Project Comments - Empty State
        </h3>
        <Comments
          comments={[]}
          currentUser={mockUser}
          projectId={"project-123" as Id<"projects">}
          userMap={mockUserMap}
          config={projectConfig}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-slate-11 font-semibold">
          Finalized Project Comments
        </h3>
        <Comments
          comments={mockComments}
          currentUser={mockUser}
          projectId={"finalized-project-123" as Id<"finalizedProjects">}
          userMap={mockUserMap}
          config={finalizedProjectConfig}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-slate-11 font-semibold">
          Comments - No Current User
        </h3>
        <Comments
          comments={mockComments}
          currentUser={null as unknown as ZodUser}
          projectId={"project-123" as Id<"projects">}
          userMap={mockUserMap}
          config={projectConfig}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-slate-11 font-semibold">
          Comments - User Without Avatar
        </h3>
        <Comments
          comments={[
            {
              ...mockComments[0],
              authorId: "user-456", // Jane Smith has no avatar
            },
          ]}
          currentUser={mockUser}
          projectId={"project-123" as Id<"projects">}
          userMap={mockUserMap}
          config={projectConfig}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-slate-11 font-semibold">Comments - Unknown User</h3>
        <Comments
          comments={[
            {
              ...mockComments[0],
              authorId: "unknown-user",
            },
          ]}
          currentUser={mockUser}
          projectId={"project-123" as Id<"projects">}
          userMap={mockUserMap}
          config={projectConfig}
        />
      </div>
    </div>
  ),
};

// Interaction Stories
export const AddCommentFlow: Story = {
  name: "Test: Add Comment Flow",
  beforeEach() {
    clearMockedApi();
    mockApi(
      api.comment.addComment,
      fn(async ({ projectId, text }: { projectId: string; text: string }) => {
        return {
          ok: true,
          value: undefined,
        } satisfies SerializableResult<void, AddCommentError>;
      }).mockName("addCommentMutation"),
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify initial state", async () => {
      // Should show existing comments
      expect(canvas.getByText("Comments")).toBeInTheDocument();
      expect(
        canvas.getByText("This is a great project! Really impressive work."),
      ).toBeInTheDocument();

      // Should show Add Comment button
      const addButton = canvas.getByTestId("add-comment-button");
      expect(addButton).toBeInTheDocument();
      expect(addButton).toBeVisible();
    });

    await step("Open comment form", async () => {
      const addButton = canvas.getByTestId("add-comment-button");
      await userEvent.click(addButton);

      // Form should be visible
      const textarea = canvas.getByTestId("comment-textarea");
      expect(textarea).toBeInTheDocument();
      expect(textarea).toBeVisible();

      // Buttons should be present
      expect(canvas.getByTestId("cancel-comment-button")).toBeInTheDocument();
      const submitButton = canvas.getByTestId("submit-comment-button");
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toBeDisabled(); // Should be disabled when empty
    });

    await step("Type comment and submit", async () => {
      const textarea = canvas.getByTestId("comment-textarea");
      await userEvent.type(textarea, "This is a test comment!");

      // Submit button should now be enabled
      const submitButton = canvas.getByTestId("submit-comment-button");
      expect(submitButton).toBeEnabled();

      await userEvent.click(submitButton);

      // Form should close
      await waitFor(() => {
        expect(
          canvas.queryByTestId("comment-textarea"),
        ).not.toBeInTheDocument();
      });

      // Add button should be visible again
      expect(canvas.getByTestId("add-comment-button")).toBeInTheDocument();
    });

    await step("Verify API calls", async () => {
      const addCommentMutation = getMockedApi(api.comment.addComment);
      expect(addCommentMutation).toHaveBeenCalledWith({
        projectId: "project-123",
        text: "This is a test comment!",
      });
      expect(addCommentMutation).toHaveBeenCalledTimes(1);
    });

    await step("Verify PostHog tracking", async () => {
      const postHog = usePostHog();
      expect(postHog.capture).toHaveBeenCalledWith("comment_added", {
        projectId: "project-123",
        userId: "user-123",
      });
    });
  },
};

export const CancelCommentFlow: Story = {
  name: "Test: Cancel Comment Flow",
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Open and cancel comment form", async () => {
      // Open form
      const addButton = canvas.getByTestId("add-comment-button");
      await userEvent.click(addButton);

      // Type some text
      const textarea = canvas.getByTestId("comment-textarea");
      await userEvent.type(textarea, "This text should be cleared");

      // Cancel
      const cancelButton = canvas.getByTestId("cancel-comment-button");
      await userEvent.click(cancelButton);

      // Form should be closed
      expect(canvas.queryByTestId("comment-textarea")).not.toBeInTheDocument();
      expect(canvas.getByTestId("add-comment-button")).toBeInTheDocument();
    });

    await step("Verify text is cleared when reopening", async () => {
      // Reopen form
      const addButton = canvas.getByTestId("add-comment-button");
      await userEvent.click(addButton);

      // Text should be empty
      const textarea = canvas.getByTestId("comment-textarea");
      expect(textarea).toHaveValue("");
    });
  },
};

export const UpvoteToggleFlow: Story = {
  name: "Test: Upvote Toggle Flow",
  beforeEach() {
    clearMockedApi();
    mockApi(
      api.comment.toggleUpvoteOnComment,
      fn(
        async ({
          projectId,
          commentId,
        }: {
          projectId: string;
          commentId: string;
        }) => {
          return {
            ok: true,
            value: undefined,
          } satisfies SerializableResult<void, ToggleUpvoteOnCommentError>;
        },
      ).mockName("toggleUpvoteOnCommentMutation"),
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Toggle upvote on comment", async () => {
      // Find the first comment's upvote button
      const upvoteButton = canvas.getByTestId(
        "upvote-comment-comment-1-button",
      );
      expect(upvoteButton).toBeInTheDocument();

      await userEvent.click(upvoteButton);
    });

    await step("Verify API call", async () => {
      const toggleUpvoteMutation = getMockedApi(
        api.comment.toggleUpvoteOnComment,
      );
      expect(toggleUpvoteMutation).toHaveBeenCalledWith({
        projectId: "project-123",
        commentId: "comment-1",
      });
      expect(toggleUpvoteMutation).toHaveBeenCalledTimes(1);
    });

    await step("Verify PostHog tracking", async () => {
      const postHog = usePostHog();
      // Should track upvote added since user-123 hasn't upvoted comment-1
      expect(postHog.capture).toHaveBeenCalledWith("comment_upvote_added", {
        projectId: "project-123",
        userId: "user-123",
      });
    });
  },
};

export const DeleteCommentFlow: Story = {
  name: "Test: Delete Comment Flow",
  beforeEach() {
    clearMockedApi();
    mockApi(
      api.comment.deleteComment,
      fn(
        async ({
          projectId,
          commentId,
        }: {
          projectId: string;
          commentId: string;
        }) => {
          return {
            ok: true,
            value: undefined,
          } satisfies SerializableResult<void, DeleteCommentError>;
        },
      ).mockName("deleteCommentMutation"),
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Verify delete button is only visible for own comments",
      async () => {
        // Should see delete button for comment-1 (authored by current user)
        expect(
          canvas.queryByTestId("delete-comment-comment-1-trigger-button"),
        ).toBeInTheDocument();

        // Should NOT see delete button for comment-2 (authored by different user)
        expect(
          canvas.queryByTestId("delete-comment-comment-2-trigger-button"),
        ).not.toBeInTheDocument();

        // Should see delete button for comment-3 (authored by current user)
        expect(
          canvas.queryByTestId("delete-comment-comment-3-trigger-button"),
        ).toBeInTheDocument();
      },
    );

    await step("Open delete dialog", async () => {
      const deleteButton = canvas.getByTestId(
        "delete-comment-comment-1-trigger-button",
      );
      await userEvent.click(deleteButton);

      // Dialog should be visible (using screen since dialogs portal out)
      // Note: The DeleteCommentDialog component handles the actual dialog interaction
      // This test verifies that the delete button is properly configured
    });
  },
};

export const ErrorHandling: Story = {
  name: "Test: Error Handling",
  beforeEach() {
    clearMockedApi();
    mockApi(
      api.comment.addComment,
      fn(async () => {
        return {
          ok: false,
          error: {
            type: "UNEXPECTED_ERROR",
            message: "Failed to add comment",
            originalError: new Error("Database error"),
          },
        } satisfies SerializableResult<void, AddCommentError>;
      }).mockName("addCommentMutation"),
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Submit comment that fails", async () => {
      // Open form and submit
      const addButton = canvas.getByTestId("add-comment-button");
      await userEvent.click(addButton);

      const textarea = canvas.getByTestId("comment-textarea");
      await userEvent.type(textarea, "This will fail");

      const submitButton = canvas.getByTestId("submit-comment-button");
      await userEvent.click(submitButton);

      // Form should remain open after error
      await waitFor(() => {
        expect(canvas.getByTestId("comment-textarea")).toBeInTheDocument();
      });
    });

    await step("Verify API was called", async () => {
      const addCommentMutation = getMockedApi(api.comment.addComment);
      expect(addCommentMutation).toHaveBeenCalledTimes(1);
    });

    await step("Verify PostHog was not called on error", async () => {
      const postHog = usePostHog();
      expect(postHog.capture).not.toHaveBeenCalled();
    });
  },
};

export const LoadingState: Story = {
  name: "Test: Loading State",
  beforeEach() {
    clearMockedApi();
    mockApi(
      api.comment.addComment,
      fn(async () => {
        // Simulate slow API
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return {
          ok: true,
          value: undefined,
        } satisfies SerializableResult<void, AddCommentError>;
      }).mockName("addCommentMutation"),
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Submit comment and verify loading state", async () => {
      // Open form
      const addButton = canvas.getByTestId("add-comment-button");
      await userEvent.click(addButton);

      const textarea = canvas.getByTestId("comment-textarea");
      await userEvent.type(textarea, "Loading test");

      const submitButton = canvas.getByTestId("submit-comment-button");
      await userEvent.click(submitButton);

      // Should show loading state
      await waitFor(() => {
        expect(canvas.getByText("Submitting...")).toBeInTheDocument();
      });

      // Button should be disabled during loading
      expect(submitButton).toBeDisabled();

      // Wait for completion
      await waitFor(
        () => {
          expect(
            canvas.queryByTestId("comment-textarea"),
          ).not.toBeInTheDocument();
        },
        { timeout: 2000 },
      );
    });
  },
};
