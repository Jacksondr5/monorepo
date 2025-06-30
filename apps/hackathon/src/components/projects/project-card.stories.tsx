import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within, fn, waitFor } from "storybook/test";
import React from "react";
import { ProjectCard } from "./project-card";
import type { ZodUser } from "../../server/zod/user";
import type { Project } from "../../server/zod/project";
import { mockApi, clearMockedApi, getMockedApi } from "../../lib/convex.mock";
import { api } from "../../../convex/_generated/api";
import { usePostHog } from "../../lib/posthog.mock";
import { Id } from "../../../convex/_generated/dataModel";
import { anchorTimestamp } from "../../utils/anchor-date";

// Mock data
const mockCurrentUser: ZodUser = {
  _id: "user-current" as Id<"users">,
  _creationTime: anchorTimestamp,
  firstName: "Jackson",
  lastName: "Miller",
  avatarUrl: "https://github.com/jacksondr5.png",
  clerkUserId: "clerk-jacksondr5",
  role: "USER",
};

const mockOtherUser: ZodUser = {
  _id: "user-other" as Id<"users">,
  _creationTime: anchorTimestamp,
  firstName: "Jane",
  lastName: "Smith",
  avatarUrl: "https://github.com/janesmith.png",
  clerkUserId: "clerk-jane",
  role: "USER",
};

const mockThirdUser: ZodUser = {
  _id: "user-third" as Id<"users">,
  _creationTime: anchorTimestamp,
  firstName: "Bob",
  lastName: "Wilson",
  avatarUrl: "https://github.com/bobwilson.png",
  clerkUserId: "clerk-bob",
  role: "USER",
};

const mockUserMap = new Map([
  ["user-current", mockCurrentUser],
  ["user-other", mockOtherUser],
  ["user-third", mockThirdUser],
]);

const baseProjectData = {
  title: "AI-Powered Task Manager",
  description:
    "A comprehensive task management application that uses artificial intelligence to prioritize tasks and provide productivity insights. Features include smart scheduling, automated categorization, and team collaboration tools.",
  hackathonEventId: "hackathon-123" as Id<"hackathonEvents">,
  _creationTime: anchorTimestamp - 86400000, // 1 day ago
  updatedAt: anchorTimestamp - 3600000, // 1 hour ago
  creatorUserId: mockOtherUser._id,
};

const mockProjectWithUpvotes: Project = {
  _id: "project-with-upvotes" as Id<"projects">,
  ...baseProjectData,
  upvotes: [
    { userId: mockCurrentUser._id, createdAt: anchorTimestamp - 1800000 },
    { userId: mockThirdUser._id, createdAt: anchorTimestamp - 900000 },
  ],
  comments: [
    {
      id: "comment-1",
      authorId: mockCurrentUser._id,
      createdAt: anchorTimestamp - 3600000,
      text: "This looks really promising! Great idea.",
      upvotes: [
        { userId: mockOtherUser._id, createdAt: anchorTimestamp - 1800000 },
      ],
    },
  ],
};

const mockProjectNoUpvotes: Project = {
  _id: "project-no-upvotes" as Id<"projects">,
  ...baseProjectData,
  upvotes: [],
  comments: [],
};

const mockProjectOthersUpvoted: Project = {
  _id: "project-others-upvoted" as Id<"projects">,
  ...baseProjectData,
  upvotes: [
    { userId: mockOtherUser._id, createdAt: anchorTimestamp - 1800000 },
    { userId: mockThirdUser._id, createdAt: anchorTimestamp - 900000 },
  ],
  comments: [
    {
      id: "comment-2",
      authorId: mockThirdUser._id,
      createdAt: anchorTimestamp - 2700000,
      text: "Really cool concept! Looking forward to seeing this develop.",
      upvotes: [],
    },
  ],
};

const mockEditableProject: Project = {
  _id: "project-editable" as Id<"projects">,
  ...baseProjectData,
  creatorUserId: mockCurrentUser._id, // Current user is the creator
  upvotes: [
    { userId: mockOtherUser._id, createdAt: anchorTimestamp - 1800000 },
  ],
  comments: [],
};

const setupMocks = () => {
  clearMockedApi();
  mockApi(
    api.projects.updateProject,
    fn(() => ({
      ok: true,
      value: undefined,
    })).mockName("updateProject"),
  );
  mockApi(
    api.projects.upvoteProject,
    fn(() => ({
      ok: true,
      value: undefined,
    })).mockName("upvoteProject"),
  );
  mockApi(
    api.projects.removeUpvoteFromProject,
    fn(() => ({
      ok: true,
      value: undefined,
    })).mockName("removeUpvoteFromProject"),
  );
  mockApi(
    api.projects.deleteProject,
    fn(() => ({
      ok: true,
      value: undefined,
    })).mockName("deleteProject"),
  );
  mockApi(
    api.comment.addComment,
    fn(() => ({
      ok: true,
      value: undefined,
    })).mockName("addComment"),
  );
  mockApi(
    api.comment.toggleUpvoteOnComment,
    fn(() => ({
      ok: true,
      value: undefined,
    })).mockName("toggleUpvoteOnComment"),
  );
  mockApi(
    api.comment.deleteComment,
    fn(() => ({
      ok: true,
      value: undefined,
    })).mockName("deleteComment"),
  );
};

const meta: Meta<typeof ProjectCard> = {
  title: "Hackathon/Components/Projects/ProjectCard",
  component: ProjectCard,
  parameters: {
    layout: "padded",
  },
  args: {
    currentUser: mockCurrentUser,
    project: mockProjectWithUpvotes,
    userMap: mockUserMap,
    isEditable: false,
  },
  beforeEach() {
    setupMocks();
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Visual Matrix Story
export const AllVariants: Story = {
  name: "Visual Matrix: All Project Card States",
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
  render: (args) => {
    return (
      <div className="flex flex-col gap-8 p-6">
        {/* Basic Project States */}
        <div>
          <h2 className="text-slate-11 mb-4 border-b pb-2 text-lg font-semibold">
            Basic Project States
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-slate-11 mb-2 text-sm font-medium">
                Project with Upvotes (User Has Upvoted)
              </h3>
              <ProjectCard
                {...args}
                project={mockProjectWithUpvotes}
                isEditable={false}
              />
            </div>
            <div>
              <h3 className="text-slate-11 mb-2 text-sm font-medium">
                Project with No Upvotes
              </h3>
              <ProjectCard
                {...args}
                project={mockProjectNoUpvotes}
                isEditable={false}
              />
            </div>
            <div>
              <h3 className="text-slate-11 mb-2 text-sm font-medium">
                Project with Others&apos; Upvotes (User Hasn&apos;t Upvoted)
              </h3>
              <ProjectCard
                {...args}
                project={mockProjectOthersUpvoted}
                isEditable={false}
              />
            </div>
          </div>
        </div>

        {/* Editable vs Non-Editable */}
        <div>
          <h2 className="text-slate-11 mb-4 border-b pb-2 text-lg font-semibold">
            Editable vs Non-Editable
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-slate-11 mb-2 text-sm font-medium">
                Editable (User is Creator)
              </h3>
              <ProjectCard
                {...args}
                project={mockEditableProject}
                isEditable={true}
              />
            </div>
            <div>
              <h3 className="text-slate-11 mb-2 text-sm font-medium">
                Non-Editable (User is Not Creator)
              </h3>
              <ProjectCard
                {...args}
                project={mockProjectWithUpvotes}
                isEditable={false}
              />
            </div>
          </div>
        </div>

        {/* Different Content Lengths */}
        <div>
          <h2 className="text-slate-11 mb-4 border-b pb-2 text-lg font-semibold">
            Content Variations
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-slate-11 mb-2 text-sm font-medium">
                Short Description
              </h3>
              <ProjectCard
                {...args}
                project={{
                  ...mockProjectNoUpvotes,
                  title: "Quick Tool",
                  description: "A simple utility app.",
                }}
                isEditable={false}
              />
            </div>
            <div>
              <h3 className="text-slate-11 mb-2 text-sm font-medium">
                Long Multi-line Description
              </h3>
              <ProjectCard
                {...args}
                project={{
                  ...mockProjectNoUpvotes,
                  title: "Complex Enterprise Solution",
                  description:
                    "This is a comprehensive enterprise-grade solution that addresses multiple business challenges.\n\nKey features include:\n- Advanced analytics dashboard\n- Real-time collaboration\n- Automated workflow management\n- Integration with existing systems\n\nThe application is built using modern technologies and follows industry best practices for scalability and security.",
                }}
                isEditable={false}
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// Interaction Stories

export const UpvoteProject: Story = {
  name: "Test: Upvote Project",
  args: {
    project: mockProjectOthersUpvoted, // User hasn't upvoted initially
    isEditable: false,
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Upvote project", async () => {
      const posthog = usePostHog();
      const upvoteButton = canvas.getByTestId(
        `upvote-project-${args.project._id}-button`,
      );

      // Button should not be filled initially (user hasn't upvoted)
      const thumbsUpIcon = upvoteButton.querySelector("svg");
      expect(thumbsUpIcon).not.toHaveClass("fill-grass-9");

      // Verify accessibility attributes
      expect(upvoteButton).toHaveAttribute(
        "aria-label",
        expect.stringContaining("Upvote"),
      );
      expect(upvoteButton).toHaveAttribute("aria-pressed", "false");

      await userEvent.click(upvoteButton);

      // Verify mutation was called
      const upvoteMutation = getMockedApi(api.projects.upvoteProject);
      expect(upvoteMutation).toHaveBeenCalledWith({
        projectId: args.project._id,
      });

      // Verify PostHog was called
      expect(posthog.capture).toHaveBeenCalledWith("project_upvote_added", {
        projectId: args.project._id,
        userId: args.currentUser._id,
      });
    });
  },
};

export const RemoveUpvote: Story = {
  name: "Test: Remove Upvote from Project",
  args: {
    project: mockProjectWithUpvotes, // User has upvoted initially
    isEditable: false,
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Remove upvote from project", async () => {
      const posthog = usePostHog();
      const upvoteButton = canvas.getByTestId(
        `upvote-project-${args.project._id}-button`,
      );

      // Button should be filled initially (user has upvoted)
      const thumbsUpIcon = upvoteButton.querySelector("svg");
      expect(thumbsUpIcon).toHaveClass("fill-grass-9");

      // Verify accessibility attributes
      expect(upvoteButton).toHaveAttribute(
        "aria-label",
        expect.stringContaining("Remove upvote"),
      );
      expect(upvoteButton).toHaveAttribute("aria-pressed", "true");

      await userEvent.click(upvoteButton);

      // Verify remove mutation was called
      const removeUpvoteMutation = getMockedApi(
        api.projects.removeUpvoteFromProject,
      );
      expect(removeUpvoteMutation).toHaveBeenCalledWith({
        projectId: args.project._id,
      });

      // Verify PostHog was called
      expect(posthog.capture).toHaveBeenCalledWith("project_upvote_removed", {
        projectId: args.project._id,
        userId: args.currentUser._id,
      });
    });
  },
};

export const EditProject: Story = {
  name: "Test: Edit Project",
  args: {
    project: mockEditableProject, // User is the creator
    isEditable: true,
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Click edit button to enter edit mode", async () => {
      const editButton = canvas.getByTestId(
        `edit-project-${args.project._id}-button`,
      );
      expect(editButton).toBeInTheDocument();

      await userEvent.click(editButton);

      // Should now show the project submission form
      await waitFor(() => {
        expect(canvas.getByTestId("title-input")).toBeInTheDocument();
        expect(canvas.getByTestId("description-textarea")).toBeInTheDocument();
      });
    });

    await step("Update project details", async () => {
      const posthog = usePostHog();
      const titleInput = canvas.getByTestId("title-input");
      const descriptionInput = canvas.getByTestId("description-textarea");
      const submitButton = canvas.getByTestId("submit-button");

      // Verify form is pre-filled with existing data
      expect(titleInput).toHaveValue(args.project.title);
      expect(descriptionInput).toHaveValue(args.project.description);

      // Update the fields
      await userEvent.clear(titleInput);
      await userEvent.type(titleInput, "Updated AI Task Manager");

      await userEvent.clear(descriptionInput);
      await userEvent.type(
        descriptionInput,
        "Updated description with new features and improvements.",
      );

      // Submit the form
      await userEvent.click(submitButton);

      // Verify update mutation was called
      const updateMutation = getMockedApi(api.projects.updateProject);
      expect(updateMutation).toHaveBeenCalledWith({
        id: args.project._id,
        values: {
          title: "Updated AI Task Manager",
          description:
            "Updated description with new features and improvements.",
        },
      });

      // Verify PostHog was called
      expect(posthog.capture).toHaveBeenCalledWith("project_updated", {
        project_id: args.project._id,
        title: "Updated AI Task Manager",
      });
    });
  },
};

export const CancelEdit: Story = {
  name: "Test: Cancel Project Edit",
  args: {
    project: mockEditableProject,
    isEditable: true,
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Enter edit mode", async () => {
      const editButton = canvas.getByTestId(
        `edit-project-${args.project._id}-button`,
      );
      await userEvent.click(editButton);

      // Should now show the project submission form
      await waitFor(() => {
        expect(canvas.getByTestId("title-input")).toBeInTheDocument();
      });
    });

    await step("Cancel editing", async () => {
      const cancelButton = canvas.getByTestId(
        "project-submission-cancel-button",
      );
      await userEvent.click(cancelButton);

      // Should return to card view
      await waitFor(() => {
        expect(canvas.queryByTestId("title-input")).not.toBeInTheDocument();
        expect(canvas.getByText(args.project.title)).toBeInTheDocument();
      });

      // No mutations should have been called
      const updateMutation = getMockedApi(api.projects.updateProject);
      expect(updateMutation).not.toHaveBeenCalled();
    });
  },
};

export const NonEditableProject: Story = {
  name: "Test: Non-Editable Project Has No Edit Controls",
  args: {
    project: mockProjectWithUpvotes, // User is not the creator
    isEditable: false,
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify no edit controls are visible", async () => {
      // Edit button should not be present
      expect(
        canvas.queryByTestId(`edit-project-${args.project._id}-button`),
      ).not.toBeInTheDocument();

      // Delete dialog should not be present
      expect(
        canvas.queryByTestId(`delete-project-${args.project._id}-button`),
      ).not.toBeInTheDocument();
    });
  },
};

export const UpvoteError: Story = {
  name: "Test: Upvote Error Handling",
  beforeEach() {
    clearMockedApi();
    // Mock upvote mutation to return an error
    mockApi(
      api.projects.upvoteProject,
      fn(() => ({
        ok: false,
        error: {
          type: "UNEXPECTED_ERROR",
          message: "Network error occurred",
        },
      })).mockName("upvoteProject"),
    );
  },
  args: {
    project: mockProjectNoUpvotes,
    isEditable: false,
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Attempt to upvote with error", async () => {
      const posthog = usePostHog();
      const upvoteButton = canvas.getByTestId(
        `upvote-project-${args.project._id}-button`,
      );

      await userEvent.click(upvoteButton);

      // Verify mutation was called
      const upvoteMutation = getMockedApi(api.projects.upvoteProject);
      expect(upvoteMutation).toHaveBeenCalledWith({
        projectId: args.project._id,
      });

      // PostHog should not be called on error
      expect(posthog.capture).not.toHaveBeenCalled();
    });
  },
};
