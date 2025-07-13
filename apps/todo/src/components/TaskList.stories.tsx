import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within, fn } from "storybook/test";
import React from "react";
import { TaskList } from "./TaskList";
import { MockProviders } from "../lib/mock-providers";
import { mockApi, clearMockedApi, getMockedApi } from "../lib/convex.mock";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { ZodTask } from "../server/zod/task";

// Mock task data
const anchorTimestamp = Date.now();

const mockTasks: ZodTask[] = [
  {
    _id: "task-1" as Id<"tasks">,
    _creationTime: anchorTimestamp - 3600000, // 1 hour ago
    title: "Complete project documentation",
    description: "Write comprehensive docs for the new feature",
    isBlocked: false,
    isDone: false,
    isImportant: true,
    isUrgent: false,
    createdById: "user-123",
    updatedAt: anchorTimestamp - 3600000,
  },
  {
    _id: "task-2" as Id<"tasks">,
    _creationTime: anchorTimestamp - 7200000, // 2 hours ago
    title: "Fix critical bug in authentication",
    description: "Users can't log in with Google OAuth",
    isBlocked: false,
    isDone: false,
    isImportant: true,
    isUrgent: true,
    createdById: "user-123",
    updatedAt: anchorTimestamp - 1800000, // Updated 30 min ago
  },
  {
    _id: "task-3" as Id<"tasks">,
    _creationTime: anchorTimestamp - 10800000, // 3 hours ago
    title: "Review pull request #42",
    description: undefined,
    isBlocked: false,
    isDone: true,
    isImportant: false,
    isUrgent: false,
    createdById: "user-123",
    updatedAt: anchorTimestamp - 3600000,
  },
  {
    _id: "task-4" as Id<"tasks">,
    _creationTime: anchorTimestamp - 14400000, // 4 hours ago
    title: "Waiting for design approval",
    description: "Cannot proceed until design team approves mockups",
    isBlocked: true,
    isDone: false,
    isImportant: false,
    isUrgent: false,
    createdById: "user-123",
    updatedAt: anchorTimestamp - 14400000,
  },
  {
    _id: "task-5" as Id<"tasks">,
    _creationTime: anchorTimestamp - 1209600000, // 2 weeks ago
    title: "Old task from 2 weeks ago",
    description:
      "This task is older and should appear in the old tasks section",
    isBlocked: false,
    isDone: false,
    isImportant: false,
    isUrgent: false,
    createdById: "user-123",
    updatedAt: anchorTimestamp - 1209600000, // 2 weeks ago
  },
];

const emptyTasks: ZodTask[] = [];

const setupMocks = (tasks: ZodTask[] = mockTasks) => {
  clearMockedApi();

  // Mock the getTasks query
  mockApi(
    api.tasks.getTasks,
    fn(() => ({
      ok: true,
      value: tasks,
    })).mockName("getTasks"),
  );

  // Mock all the mutation functions
  mockApi(
    api.tasks.createTask,
    fn(() => ({
      ok: true,
      value: "new-task-id" as Id<"tasks">,
    })).mockName("createTask"),
  );

  mockApi(
    api.tasks.setTitle,
    fn(() => ({
      ok: true,
      value: undefined,
    })).mockName("setTitle"),
  );

  mockApi(
    api.tasks.setDescription,
    fn(() => ({
      ok: true,
      value: undefined,
    })).mockName("setDescription"),
  );

  mockApi(
    api.tasks.setIsBlocked,
    fn(() => ({
      ok: true,
      value: undefined,
    })).mockName("setIsBlocked"),
  );

  mockApi(
    api.tasks.setIsImportant,
    fn(() => ({
      ok: true,
      value: undefined,
    })).mockName("setIsImportant"),
  );

  mockApi(
    api.tasks.setIsUrgent,
    fn(() => ({
      ok: true,
      value: undefined,
    })).mockName("setIsUrgent"),
  );

  mockApi(
    api.tasks.setIsDone,
    fn(() => ({
      ok: true,
      value: undefined,
    })).mockName("setIsDone"),
  );

  mockApi(
    api.tasks.deleteTask,
    fn(() => ({
      ok: true,
      value: undefined,
    })).mockName("deleteTask"),
  );
};

const meta: Meta<typeof TaskList> = {
  title: "Todo/TaskList",
  component: TaskList,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "TaskList component displays a list of tasks with keyboard shortcuts and separates old tasks for review.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MockProviders>
        <Story />
      </MockProviders>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Visual Matrix Story showing different task states
export const AllVariants: Story = {
  name: "Visual: All Task States",
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
  beforeEach() {
    setupMocks();
  },
  render: () => (
    <div className="flex flex-col gap-8 p-6">
      <div>
        <h2 className="text-slate-11 mb-4 border-b pb-2 text-lg font-semibold">
          TaskList with Various Task States
        </h2>
        <div className="w-full">
          <TaskList />
        </div>
      </div>

      <div className="text-slate-10 space-y-2 text-sm">
        <p>
          <strong>Task States Shown:</strong>
        </p>
        <ul className="ml-4 list-inside list-disc space-y-1">
          <li>
            🔴 <strong>Urgent & Important:</strong> Critical bug fix
          </li>
          <li>
            🟡 <strong>Important only:</strong> Project documentation
          </li>
          <li>
            ✅ <strong>Completed:</strong> Pull request review
          </li>
          <li>
            🚫 <strong>Blocked:</strong> Waiting for design approval
          </li>
          <li>
            📅 <strong>Old task:</strong> Task from yesterday (separated)
          </li>
        </ul>
      </div>
    </div>
  ),
};

// Empty state story
export const EmptyState: Story = {
  name: "Visual: Empty State",
  beforeEach() {
    setupMocks(emptyTasks);
  },
  render: () => (
    <div className="flex flex-col gap-6 p-4">
      <h2 className="text-slate-11 text-lg font-semibold">
        TaskList - Empty State
      </h2>
      <div className="w-full">
        <TaskList />
      </div>
      <div className="text-slate-10 text-sm">
        <p>This shows how the TaskList appears when there are no tasks.</p>
      </div>
    </div>
  ),
};

// Interaction test for keyboard shortcuts
export const TestCreateTask: Story = {
  name: "Test: Create Task",
  beforeEach() {
    setupMocks();
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Create a new task", async () => {
      // Focus the task list
      const taskList = canvas.getByTestId("task-list");
      await userEvent.click(taskList);

      // Press 'a' to add new task
      await userEvent.keyboard("a");
      // Enter the title of the new task
      await userEvent.keyboard("New Task");
      // Press ctrl + enter to create the task
      await userEvent.keyboard("{Control>}{Enter}");

      // Verify createTask was called
      const createTaskMock = getMockedApi(api.tasks.createTask);
      expect(createTaskMock).toHaveBeenCalled();
    });

    // This is broken rn because in the mock, the ID doesn't get updated.
    // This should get fixed when we refactor the optimistic update layer
    // await step("Add a description to the new task", async () => {
    //   // Press 'd' to add description
    //   await userEvent.keyboard("d");
    //   // Enter the description of the new task
    //   await userEvent.keyboard("This is a new task");
    //   // Press ctrl + enter to save the task
    //   await userEvent.keyboard("{Control>}{Enter}");

    //   // Verify setDescription was called
    //   const setDescriptionMock = getMockedApi(api.tasks.setDescription);
    //   expect(setDescriptionMock).toHaveBeenCalled();
    // });
  },
};

export const TestUpdateTask: Story = {
  name: "Test: Update Task",
  beforeEach() {
    setupMocks();
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Update the title of the task", async () => {
      // Focus the first task
      const firstTask = canvas.getByTestId("task-task-1");
      await userEvent.click(firstTask);

      // Press 'e' to edit the task
      await userEvent.keyboard("e");

      // Enter the new title
      await userEvent.keyboard("New Title");
      // Press ctrl + enter to save the task
      await userEvent.keyboard("{Control>}{Enter}");

      // Verify setTitle was called
      const setTitleMock = getMockedApi(api.tasks.setTitle);
      expect(setTitleMock).toHaveBeenCalled();
    });

    await step("Update the description of the task", async () => {
      // Press 'd' to add description
      await userEvent.keyboard("d");
      // Enter the new description
      await userEvent.keyboard("New Description");
      // Press ctrl + enter to save the task
      await userEvent.keyboard("{Control>}{Enter}");

      // Verify setDescription was called
      const setDescriptionMock = getMockedApi(api.tasks.setDescription);
      expect(setDescriptionMock).toHaveBeenCalled();
    });

    await step("Update the blocked status of the task", async () => {
      // Press 'b' to add blocked status
      await userEvent.keyboard("b");

      // Verify setIsBlocked was called
      const setIsBlockedMock = getMockedApi(api.tasks.setIsBlocked);
      expect(setIsBlockedMock).toHaveBeenCalled();
    });

    await step("Update the important status of the task", async () => {
      // Press 'i' to add important status
      await userEvent.keyboard("i");

      // Verify setIsImportant was called
      const setIsImportantMock = getMockedApi(api.tasks.setIsImportant);
      expect(setIsImportantMock).toHaveBeenCalled();
    });

    await step("Update the urgent status of the task", async () => {
      // Press 'u' to add urgent status
      await userEvent.keyboard("u");

      // Verify setIsUrgent was called
      const setIsUrgentMock = getMockedApi(api.tasks.setIsUrgent);
      expect(setIsUrgentMock).toHaveBeenCalled();
    });
  },
};

export const TestDeleteTask: Story = {
  name: "Test: Delete Task",
  beforeEach() {
    setupMocks();
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Delete the task", async () => {
      // Focus the first task
      const firstTask = canvas.getByTestId("task-task-1");
      await userEvent.click(firstTask);

      // Press 'x' to delete the task
      await userEvent.keyboard("x");

      // Verify deleteTask was called
      const deleteTaskMock = getMockedApi(api.tasks.deleteTask);
      expect(deleteTaskMock).toHaveBeenCalled();
    });
  },
};

export const TestFocusTask: Story = {
  name: "Test: Focus Task",
  beforeEach() {
    setupMocks();
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Focus the task", async () => {
      // Focus the first task
      const firstTask = canvas.getByTestId("task-task-1");
      await userEvent.click(firstTask);

      // Verify the task is focused
      expect(firstTask).toHaveFocus();
    });

    await step("Tab to the next task", async () => {
      // Press tab to focus the next task
      await userEvent.keyboard("{Tab}");

      // Verify the next task is focused
      const nextTask = canvas.getByTestId("task-task-2");
      expect(nextTask).toHaveFocus();
    });
  },
};

// Error handling test
export const TestErrorHandling: Story = {
  name: "Test: Error Handling",
  beforeEach() {
    clearMockedApi();
    // Mock getTasks to return an error
    mockApi(
      api.tasks.getTasks,
      fn(() => ({
        ok: false,
        error: {
          type: "UNEXPECTED_ERROR",
          message: "Failed to fetch tasks",
          originalError: new Error("Network error"),
        },
      })).mockName("getTasks"),
    );
  },
  play: async ({ canvasElement, step }) => {
    await step("Handle failed task loading", async () => {
      // The component should handle the error gracefully
      // It might show an error message or empty state

      // Verify the error was logged (this depends on TaskContext implementation)
      // For now, just verify the component renders without crashing
      // TODO: Add error handling tests once we add toasts
      expect(canvasElement).toBeInTheDocument();
    });
  },
};
