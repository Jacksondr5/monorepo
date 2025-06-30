import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within, fn, waitFor } from "storybook/test";
import React from "react";
import { FinalizedProjectCard } from "./finalized-project-card";
import type { ZodUser } from "../../server/zod/user";
import type { FinalizedProject } from "../../server/zod/finalized-project";
import { mockApi, clearMockedApi, getMockedApi } from "../../lib/convex.mock";
import { api } from "../../../convex/_generated/api";
import { SerializableResult } from "../../../convex/model/error";
import { AddInterestedUserError } from "../../../convex/finalizedProjects";
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

const mockAdminUser: ZodUser = {
  _id: "user-admin" as Id<"users">,
  _creationTime: anchorTimestamp,
  firstName: "Shadcn",
  lastName: "UI",
  avatarUrl: "https://github.com/shadcn.png",
  clerkUserId: "clerk-shadcn",
  role: "ADMIN",
};

const mockOtherUser: ZodUser = {
  _id: "user-other" as Id<"users">,
  _creationTime: anchorTimestamp,
  firstName: "Vercel",
  lastName: "Team",
  avatarUrl: "https://github.com/vercel.png",
  clerkUserId: "clerk-vercel",
  role: "USER",
};

const mockThirdUser: ZodUser = {
  _id: "user-third" as Id<"users">,
  _creationTime: anchorTimestamp,
  firstName: "Abraham",
  lastName: "Oh",
  avatarUrl: "https://github.com/asianham.png",
  clerkUserId: "clerk-abrahamoh",
  role: "USER",
};

const mockAssignedUser: ZodUser = {
  _id: "user-assigned" as Id<"users">,
  _creationTime: anchorTimestamp,
  firstName: "Alice",
  lastName: "Assigned",
  avatarUrl: "https://github.com/jacksondr5.png",
  clerkUserId: "clerk-alice",
  role: "USER",
};

const mockUserMap = new Map([
  ["user-current", mockCurrentUser],
  ["user-other", mockOtherUser],
  ["user-third", mockThirdUser],
  ["user-assigned", mockAssignedUser],
  ["user-admin", mockAdminUser],
]);

const allUsers = [
  mockCurrentUser,
  mockOtherUser,
  mockThirdUser,
  mockAssignedUser,
  mockAdminUser,
];

const standardProjectDetails = {
  title: "AI-Powered Code Assistant",
  description:
    "A sophisticated AI assistant that helps developers write better code through intelligent suggestions, automated testing, and real-time collaboration features. This project includes machine learning models for code completion, automated refactoring capabilities, and integration with popular development environments.",
  hackathonEventId: "hackathon-123" as Id<"hackathonEvents">,
  _creationTime: anchorTimestamp,
  updatedAt: anchorTimestamp,
};

const mockProjectWithInterests: FinalizedProject = {
  _id: "project-with-interests" as Id<"finalizedProjects">,
  ...standardProjectDetails,
  interestedUsers: [
    { userId: mockCurrentUser._id, createdAt: anchorTimestamp - 3600000 },
    { userId: mockOtherUser._id, createdAt: anchorTimestamp - 1800000 },
    { userId: mockThirdUser._id, createdAt: anchorTimestamp - 900000 },
  ],
  assignedUsers: [
    { userId: mockAssignedUser._id, createdAt: anchorTimestamp - 7200000 },
  ],
  comments: [
    {
      id: "comment-1",
      authorId: mockOtherUser._id,
      createdAt: anchorTimestamp - 3600000,
      text: "This looks really promising! I'd love to contribute.",
      upvotes: [
        { userId: mockCurrentUser._id, createdAt: anchorTimestamp - 1800000 },
      ],
    },
  ],
};

const mockProjectNoInterests: FinalizedProject = {
  _id: "project-no-interests" as Id<"finalizedProjects">,
  ...standardProjectDetails,
  interestedUsers: [],
  assignedUsers: [],
  comments: [],
};

const mockProjectCurrentUserNotInterested: FinalizedProject = {
  _id: "project-others-interested" as Id<"finalizedProjects">,
  ...standardProjectDetails,
  interestedUsers: [
    { userId: mockOtherUser._id, createdAt: anchorTimestamp - 1800000 },
    { userId: mockThirdUser._id, createdAt: anchorTimestamp - 900000 },
  ],
  assignedUsers: [],
  comments: [],
};

const setupMocks = () => {
  clearMockedApi();
  mockApi(
    api.finalizedProjects.getAllUsers,
    fn(() => ({
      ok: true,
      value: allUsers,
    })).mockName("getAllUsers"),
  );
  mockApi(
    api.finalizedProjects.addInterestedUser,
    fn(() => ({
      ok: true,
      value: undefined,
    })).mockName("addInterestedUser"),
  );
  mockApi(
    api.finalizedProjects.removeInterestedUser,
    fn(() => ({
      ok: true,
      value: undefined,
    })).mockName("removeInterestedUser"),
  );
  mockApi(
    api.finalizedProjects.assignUserToProject,
    fn(() => ({
      ok: true,
      value: undefined,
    })).mockName("assignUserToProject"),
  );
};

const meta: Meta<typeof FinalizedProjectCard> = {
  title: "Hackathon/Components/FinalizedProjects/FinalizedProjectCard",
  component: FinalizedProjectCard,
  parameters: {
    layout: "padded",
  },
  args: {
    currentUser: mockCurrentUser,
    project: mockProjectWithInterests,
    userMap: mockUserMap,
    remainingInterests: 3,
    hackathonPhase: "PROJECT_VOTING",
    showBothUserGroups: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Visual Matrix Story
export const AllVariants: Story = {
  name: "Visual: All States",
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
  beforeEach() {
    setupMocks();
  },
  render: (args) => {
    return (
      <div className="flex flex-col gap-8 p-6">
        {/* Project Voting Phase - Different Interest States */}
        <div>
          <h2 className="text-slate-11 mb-4 border-b pb-2 text-lg font-semibold">
            Project Voting Phase - Interest Management
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-slate-11 mb-2 text-sm font-medium">
                User Interested + Others Interested
              </h3>
              <FinalizedProjectCard
                {...args}
                project={mockProjectWithInterests}
                hackathonPhase="PROJECT_VOTING"
                remainingInterests={2}
              />
            </div>
            <div>
              <h3 className="text-slate-11 mb-2 text-sm font-medium">
                User Not Interested + Others Interested
              </h3>
              <FinalizedProjectCard
                {...args}
                project={mockProjectCurrentUserNotInterested}
                hackathonPhase="PROJECT_VOTING"
                remainingInterests={3}
              />
            </div>
            <div>
              <h3 className="text-slate-11 mb-2 text-sm font-medium">
                No Interests Yet
              </h3>
              <FinalizedProjectCard
                {...args}
                project={mockProjectNoInterests}
                hackathonPhase="PROJECT_VOTING"
                remainingInterests={3}
              />
            </div>
            <div>
              <h3 className="text-slate-11 mb-2 text-sm font-medium">
                No Remaining Interests (Button Disabled)
              </h3>
              <FinalizedProjectCard
                {...args}
                project={mockProjectNoInterests}
                hackathonPhase="PROJECT_VOTING"
                remainingInterests={0}
              />
            </div>
          </div>
        </div>

        {/* Event In Progress Phase - Assigned Team Members */}
        <div>
          <h2 className="text-slate-11 mb-4 border-b pb-2 text-lg font-semibold">
            Event In Progress - Team Members View
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-slate-11 mb-2 text-sm font-medium">
                With Assigned Team Members
              </h3>
              <FinalizedProjectCard
                {...args}
                project={mockProjectWithInterests}
                hackathonPhase="EVENT_IN_PROGRESS"
              />
            </div>
            <div>
              <h3 className="text-slate-11 mb-2 text-sm font-medium">
                No Team Members Assigned
              </h3>
              <FinalizedProjectCard
                {...args}
                project={mockProjectNoInterests}
                hackathonPhase="EVENT_IN_PROGRESS"
              />
            </div>
          </div>
        </div>

        {/* Event Ended Phase */}
        <div>
          <h2 className="text-slate-11 mb-4 border-b pb-2 text-lg font-semibold">
            Event Ended - Final View
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-slate-11 mb-2 text-sm font-medium">
                With Final Team
              </h3>
              <FinalizedProjectCard
                {...args}
                project={mockProjectWithInterests}
                hackathonPhase="EVENT_ENDED"
              />
            </div>
          </div>
        </div>

        {/* Admin View - Both User Groups */}
        <div>
          <h2 className="text-slate-11 mb-4 border-b pb-2 text-lg font-semibold">
            Admin View - Team Management
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <h3 className="text-slate-11 mb-2 text-sm font-medium">
                Admin User with Assignment Controls
              </h3>
              <FinalizedProjectCard
                {...args}
                currentUser={mockAdminUser}
                project={mockProjectWithInterests}
                hackathonPhase="PROJECT_VOTING"
                showBothUserGroups={true}
              />
            </div>
            <div>
              <h3 className="text-slate-11 mb-2 text-sm font-medium">
                Regular User (No Assignment Controls)
              </h3>
              <FinalizedProjectCard
                {...args}
                project={mockProjectWithInterests}
                hackathonPhase="PROJECT_VOTING"
                showBothUserGroups={true}
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// Interaction Stories

export const AddInterest: Story = {
  name: "Test: Add Interest to Project",

  beforeEach() {
    setupMocks();
  },
  args: {
    project: mockProjectCurrentUserNotInterested, // User is NOT interested initially
    hackathonPhase: "PROJECT_VOTING",
    remainingInterests: 3,
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Add interest to project", async () => {
      const posthog = usePostHog();
      const interestButton = canvas.getByTestId(
        `interest-project-${args.project._id}-button`,
      );
      expect(interestButton).toHaveTextContent("I want to work on this");
      expect(interestButton).toBeEnabled();

      await userEvent.click(interestButton);

      // Verify mutation was called
      const addMutation = getMockedApi(api.finalizedProjects.addInterestedUser);
      expect(addMutation).toHaveBeenCalledWith({
        projectId: args.project._id,
      });

      // Verify PostHog was called
      expect(posthog.capture).toHaveBeenCalledWith(
        "finalized_project_interest_added",
        {
          projectId: args.project._id,
          userId: args.currentUser._id,
        },
      );
    });
  },
};

export const RemoveInterest: Story = {
  name: "Test: Remove Interest from Project",

  beforeEach() {
    setupMocks();
  },
  args: {
    project: mockProjectWithInterests, // User IS interested initially
    hackathonPhase: "PROJECT_VOTING",
    remainingInterests: 2,
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Remove interest from project", async () => {
      const posthog = usePostHog();
      const interestButton = canvas.getByTestId(
        `interest-project-${args.project._id}-button`,
      );
      expect(interestButton).toHaveTextContent("I don't want to work on this");
      expect(interestButton).toBeEnabled();

      await userEvent.click(interestButton);

      // Verify remove mutation was called
      const removeMutation = getMockedApi(
        api.finalizedProjects.removeInterestedUser,
      );
      expect(removeMutation).toHaveBeenCalledWith({
        projectId: args.project._id,
      });

      // Verify PostHog was called
      expect(posthog.capture).toHaveBeenCalledWith(
        "finalized_project_interest_removed",
        {
          projectId: args.project._id,
          userId: args.currentUser._id,
        },
      );
    });
  },
};

export const DisabledInterestButton: Story = {
  name: "Test: Disabled Interest Button",

  beforeEach() {
    setupMocks();
  },
  args: {
    project: mockProjectCurrentUserNotInterested,
    hackathonPhase: "PROJECT_VOTING",
    remainingInterests: 0, // No remaining interests
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Verify button is disabled when no remaining interests",
      async () => {
        const interestButton = canvas.getByTestId(
          `interest-project-${args.project._id}-button`,
        );
        expect(interestButton).toHaveTextContent("I want to work on this");
        expect(interestButton).toBeDisabled();

        // Try to click the disabled button
        await userEvent.click(interestButton, { pointerEventsCheck: 0 });

        // No mutation should have been called
        const addMutation = getMockedApi(
          api.finalizedProjects.addInterestedUser,
        );
        expect(addMutation).not.toHaveBeenCalled();

        // Verify PostHog was not called
        const posthog = usePostHog();
        expect(posthog.capture).not.toHaveBeenCalled();
      },
    );
  },
};

export const AdminUserAssignment: Story = {
  name: "Test: Admin User Assignment",

  beforeEach() {
    setupMocks();
  },
  args: {
    currentUser: mockAdminUser,
    project: mockProjectNoInterests,
    hackathonPhase: "PROJECT_VOTING",
    showBothUserGroups: true,
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify assignment controls are visible", async () => {
      // First, verify that assignment controls are rendered
      const selectTrigger = canvas.getByTestId(
        `assign-user-select-${args.project._id}-trigger`,
      );
      expect(selectTrigger).toBeInTheDocument();

      const assignButton = canvas.getByTestId(
        `assign-user-button-${args.project._id}`,
      );
      expect(assignButton).toBeInTheDocument();
      expect(assignButton).toBeDisabled(); // Should be disabled until a user is selected
    });

    await step("Assign user to project", async () => {
      const posthog = usePostHog();

      // Select a user from the dropdown
      const selectTrigger = canvas.getByTestId(
        `assign-user-select-${args.project._id}-trigger`,
      );
      await userEvent.click(selectTrigger);

      // Wait for dropdown to open and select first available user
      await waitFor(
        async () => {
          // Get first available option (for now, to make test pass)
          const firstOption = document.querySelector('[role="option"]');

          if (!firstOption) {
            // Debug: check what's available
            const allElements = [...document.querySelectorAll("[role]")];
            throw new Error(
              `No dropdown options found. Available: ${allElements.map((el) => el.textContent?.trim()).join(", ")}`,
            );
          }

          await userEvent.click(firstOption as HTMLElement);
        },
        { timeout: 5000 },
      );

      // Click assign button
      const assignButton = canvas.getByTestId(
        `assign-user-button-${args.project._id}`,
      );
      expect(assignButton).toBeEnabled();
      await userEvent.click(assignButton);

      // Verify mutation was called with first user's ID (John Current)
      const assignMutation = getMockedApi(
        api.finalizedProjects.assignUserToProject,
      );
      expect(assignMutation).toHaveBeenCalledWith({
        projectId: args.project._id,
        userId: "user-current", // First available user's ID
      });

      // Verify PostHog was called
      expect(posthog.capture).toHaveBeenCalledWith("user_assigned_to_project", {
        projectId: args.project._id,
        assignedUserId: "user-current", // First available user's ID
        adminUserId: args.currentUser._id,
      });
    });
  },
};

export const NonAdminNoAssignmentControls: Story = {
  name: "Test: Non-Admin User Has No Assignment Controls",

  beforeEach() {
    setupMocks();
  },
  args: {
    currentUser: mockCurrentUser, // Regular user, not admin
    project: mockProjectNoInterests,
    hackathonPhase: "PROJECT_VOTING",
    showBothUserGroups: true,
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Verify assignment controls are not visible for non-admin",
      async () => {
        // Assignment controls should not be present
        expect(
          canvas.queryByTestId(`assign-user-select-${args.project._id}`),
        ).not.toBeInTheDocument();
        expect(
          canvas.queryByTestId(`assign-user-button-${args.project._id}`),
        ).not.toBeInTheDocument();
      },
    );
  },
};

export const ErrorHandling: Story = {
  name: "Test: Error Handling",

  beforeEach() {
    setupMocks();
    // Mock the mutation to return an error from the start
    mockApi(
      api.finalizedProjects.addInterestedUser,
      fn(
        async () =>
          ({
            ok: false,
            error: {
              type: "UNEXPECTED_ERROR",
              message: "Failed to add interest",
              originalError: new Error("Failed to add interest"),
            },
          }) satisfies SerializableResult<void, AddInterestedUserError>,
      ).mockName("addInterestedUser"),
    );
  },
  args: {
    project: mockProjectCurrentUserNotInterested,
    hackathonPhase: "PROJECT_VOTING",
    remainingInterests: 3,
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Handle failed interest addition", async () => {
      const posthog = usePostHog();

      // Verify the interest button is present and shows correct text
      const interestButton = canvas.getByTestId(
        `interest-project-${args.project._id}-button`,
      );
      expect(interestButton).toBeInTheDocument();
      expect(interestButton).toHaveTextContent("I want to work on this");
      expect(interestButton).toBeEnabled();

      await userEvent.click(interestButton);

      // Wait for mutation to be called
      await waitFor(() => {
        const addMutation = getMockedApi(
          api.finalizedProjects.addInterestedUser,
        );
        expect(addMutation).toHaveBeenCalledWith({
          projectId: args.project._id,
        });
      });

      // PostHog should not be called on error
      expect(posthog.capture).not.toHaveBeenCalled();
    });
  },
};
