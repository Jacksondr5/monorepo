import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within, fn, waitFor, screen } from "storybook/test";
import React from "react";
import { DeleteProjectDialog } from "./delete-project-dialog";
import { ProjectId } from "../../server/zod";
import { mockApi, clearMockedApi, getMockedApi } from "../../lib/convex.mock";
import { api } from "../../../convex/_generated/api";
import { usePostHog } from "../../lib/posthog.mock";
import { SerializableResult } from "../../../convex/model/error";
import { DeleteProjectError } from "../../../convex/projects";

const meta: Meta<typeof DeleteProjectDialog> = {
  title: "Hackathon/Components/Projects/DeleteProjectDialog",
  component: DeleteProjectDialog,
  parameters: {
    layout: "centered",
  },
  args: {
    projectId: "test-project-123" as ProjectId,
  },
};

export default meta;
type Story = StoryObj<typeof DeleteProjectDialog>;

// Visual Matrix Story - Show the dialog in its open state
export const AllVariants: Story = {
  name: "Visual Matrix",
  render: () => (
    <div className="p-8">
      <p className="text-slate-11 mb-4 text-sm">
        Dialog shown in open state for visual regression testing
      </p>
      <DeleteProjectDialog projectId="test-project-123" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open the dialog immediately for visual testing
    const triggerButton = canvas.getByTestId(
      `delete-project-test-project-123-trigger-button`,
    );
    await userEvent.click(triggerButton);
  },
};

// Interaction Stories
export const DialogInteraction: Story = {
  name: "Test: Dialog Open/Close Flow",
  beforeEach() {
    clearMockedApi();
    mockApi(
      api.projects.deleteProject,
      fn(async ({ id }: { id: string }) => {
        return {
          ok: true,
          value: undefined,
        } satisfies SerializableResult<void, DeleteProjectError>;
      }).mockName("deleteProjectMutation"),
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify initial state", async () => {
      const triggerButton = canvas.getByTestId(
        `delete-project-test-project-123-trigger-button`,
      );
      expect(triggerButton).toBeInTheDocument();
      expect(triggerButton).toBeVisible();

      // Dialog should not be visible initially
      expect(screen.queryByText("Delete Project")).not.toBeInTheDocument();
    });

    await step("Open dialog", async () => {
      const triggerButton = canvas.getByTestId(
        `delete-project-test-project-123-trigger-button`,
      );
      await userEvent.click(triggerButton);

      // Both buttons should be present
      expect(
        screen.getByTestId("delete-project-cancel-button"),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("delete-project-confirm-button"),
      ).toBeInTheDocument();
    });

    await step("Cancel dialog", async () => {
      const cancelButton = screen.getByTestId("delete-project-cancel-button");
      await userEvent.click(cancelButton);

      // Dialog should be closed
      await waitFor(
        () => {
          expect(screen.queryByText("Delete Project")).not.toBeInTheDocument();
        },
        { timeout: 1000 },
      );
    });
  },
};

export const SuccessfulDeletion: Story = {
  name: "Test: Successful Deletion Flow",
  beforeEach() {
    clearMockedApi();
    mockApi(
      api.projects.deleteProject,
      fn(async ({ id }: { id: string }) => {
        return {
          ok: true,
          value: undefined,
        } satisfies SerializableResult<void, DeleteProjectError>;
      }).mockName("deleteProjectMutation"),
    );
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);

    await step("Open dialog and confirm deletion", async () => {
      // Open dialog
      const triggerButton = canvas.getByTestId(
        `delete-project-test-project-123-trigger-button`,
      );
      await userEvent.click(triggerButton);

      // Confirm deletion
      const confirmButton = screen.getByTestId("delete-project-confirm-button");
      await userEvent.click(confirmButton);

      // Wait for the mutation to complete and dialog to close
      await waitFor(
        () => {
          expect(screen.queryByText("Delete Project")).not.toBeInTheDocument();
        },
        { timeout: 2000 },
      );
    });

    await step("Verify mutation was called correctly", async () => {
      const deleteProjectMutation = getMockedApi(api.projects.deleteProject);
      expect(deleteProjectMutation).toHaveBeenCalledWith({
        id: "test-project-123",
      });
      expect(deleteProjectMutation).toHaveBeenCalledTimes(1);
    });

    await step("Verify posthog was called", async () => {
      const posthog = usePostHog();
      expect(posthog.capture).toHaveBeenCalledWith("project_deleted", {
        project_id: "test-project-123",
      });
    });
  },
};

export const FailedDeletion: Story = {
  name: "Test: Failed Deletion Handling",
  beforeEach() {
    clearMockedApi();
    mockApi(
      api.projects.deleteProject,
      fn(async ({ id }: { id: string }) => {
        return {
          ok: false,
          error: {
            message: "Failed to delete project",
            type: "PROJECT_NOT_FOUND",
            id: "test-project-123",
          },
        } satisfies SerializableResult<void, DeleteProjectError>;
      }).mockName("deleteProjectMutation"),
    );
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);

    await step("Open dialog and attempt deletion", async () => {
      // Open dialog
      const triggerButton = canvas.getByTestId(
        `delete-project-test-project-123-trigger-button`,
      );
      await userEvent.click(triggerButton);

      // Confirm deletion
      const confirmButton = screen.getByTestId("delete-project-confirm-button");
      await userEvent.click(confirmButton);

      // Dialog should close even on failure (as per component logic)
      await waitFor(
        () => {
          expect(screen.queryByText("Delete Project")).not.toBeInTheDocument();
        },
        { timeout: 2000 },
      );
    });

    await step("Verify mutation was called", async () => {
      const deleteProjectMutation = getMockedApi(api.projects.deleteProject);
      expect(deleteProjectMutation).toHaveBeenCalledWith({
        id: "test-project-123",
      });
      expect(deleteProjectMutation).toHaveBeenCalledTimes(1);
    });

    await step("Verify posthog was not called", async () => {
      const posthog = usePostHog();
      expect(posthog.capture).not.toHaveBeenCalled();
    });
  },
};

export const KeyboardNavigation: Story = {
  name: "Test: Keyboard Navigation",
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Navigate with keyboard", async () => {
      // Focus the trigger button
      const triggerButton = canvas.getByTestId(
        `delete-project-test-project-123-trigger-button`,
      );
      triggerButton.focus();
      expect(triggerButton).toHaveFocus();

      // Open dialog with Enter
      await userEvent.keyboard("{Enter}");
      expect(screen.getByText("Delete Project")).toBeInTheDocument();

      // Tab through dialog elements
      await userEvent.keyboard("{Tab}");
      const confirmButton = screen.getByTestId("delete-project-confirm-button");
      expect(confirmButton).toHaveFocus();

      await userEvent.keyboard("{Tab}");
      await userEvent.keyboard("{Tab}");
      const cancelButton = screen.getByTestId("delete-project-cancel-button");
      expect(cancelButton).toHaveFocus();
      expect(cancelButton).toBeVisible();

      // Close with Escape
      await userEvent.keyboard("{Escape}");
      await waitFor(
        () => {
          expect(screen.queryByText("Delete Project")).not.toBeInTheDocument();
        },
        { timeout: 1000 },
      );
    });
  },
};
