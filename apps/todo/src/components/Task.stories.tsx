import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within, fn } from "storybook/test";
import React from "react";
import { TaskView, type TaskViewProps } from "./Task";

const meta = {
  title: "Todo/Task",
  component: TaskView,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Task component displays individual tasks with various states and interactive features.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TaskView>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock functions
const mockHandleDescriptionChange = fn();
const mockHandleKeyDown = fn();
const mockHandleTitleChange = fn();

// Helper function to create props with fresh refs for each story
const createTaskProps = (
  overrides: Partial<TaskViewProps> = {},
): TaskViewProps => ({
  _id: "task-1",
  _creationTime: Date.now(),
  title: "Sample Task",
  isBlocked: false,
  isDone: false,
  editingState: undefined,
  handleDescriptionChange: mockHandleDescriptionChange,
  handleKeyDown: mockHandleKeyDown,
  handleTitleChange: mockHandleTitleChange,
  // Create fresh refs for each story to avoid serialization issues
  descriptionEditRef: { current: null },
  taskRef: { current: null },
  titleEditRef: { current: null },
  ...overrides,
});

// Visual matrix component showing all task states
const TaskMatrix = () => {
  const defaultProps = createTaskProps();
  return (
    <div className="flex flex-col gap-6 p-4">
      <h2 className="text-slate-11 text-lg font-semibold">Task States</h2>

      <div className="grid w-full max-w-4xl grid-cols-2 gap-4">
        <div>
          <h3 className="text-slate-12 mb-2 text-sm">Basic States</h3>
          <div className="flex flex-col gap-2">
            <TaskView {...defaultProps} title="Normal Task" />
            <TaskView
              {...defaultProps}
              title="Task with Description"
              description="This is a task description"
            />
            <TaskView {...defaultProps} title="Completed Task" isDone />
            <TaskView {...defaultProps} title="Blocked Task" isBlocked />
          </div>
        </div>

        <div>
          <h3 className="text-slate-12 mb-2 text-sm">Priority States</h3>
          <div className="flex flex-col gap-2">
            <TaskView {...defaultProps} title="Urgent Task" isUrgent />
            <TaskView {...defaultProps} title="Important Task" isImportant />
            <TaskView
              {...defaultProps}
              title="Urgent & Important"
              isUrgent
              isImportant
            />
            <TaskView
              {...defaultProps}
              title="Neither Urgent nor Important"
              isUrgent={false}
              isImportant={false}
            />
          </div>
        </div>

        <div>
          <h3 className="text-slate-12 mb-2 text-sm">Combined States</h3>
          <div className="flex flex-col gap-2">
            <TaskView
              {...defaultProps}
              title="Blocked & Important"
              isBlocked
              isImportant
            />
            <TaskView {...defaultProps} title="Done & Urgent" isDone isUrgent />
            <TaskView
              {...defaultProps}
              title="All States"
              isBlocked
              isDone
              isUrgent
              isImportant
              description="Complex state"
            />
          </div>
        </div>

        <div>
          <h3 className="text-slate-12 mb-2 text-sm">Long Content</h3>
          <div className="flex flex-col gap-2">
            <TaskView
              {...defaultProps}
              title="Very Long Task Title That Should Wrap Properly When It Exceeds The Container Width"
            />
            <TaskView
              {...defaultProps}
              title="Task with Long Description"
              description="This is a very long description that should demonstrate how the task component handles longer text content and wrapping behavior in various scenarios."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const VisualAllStates: Story = {
  args: createTaskProps(),
  render: () => <TaskMatrix />,
};

// Interaction tests
export const TestTaskClick: Story = {
  args: createTaskProps({
    title: "Clickable Task",
  }),
  beforeEach() {
    mockHandleKeyDown.mockClear();
    mockHandleTitleChange.mockClear();
    mockHandleDescriptionChange.mockClear();
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Click on task", async () => {
      const task = canvas.getByTestId("task-task-1");
      await userEvent.click(task);
      // Task should receive focus or trigger some interaction
      expect(task).toHaveFocus();
    });
  },
};
