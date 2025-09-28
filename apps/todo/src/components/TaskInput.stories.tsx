import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within, fn } from "storybook/test";
import React, { useRef } from "react";
import { TaskInput } from "./TaskInput";

const meta = {
  title: "Todo/TaskInput",
  component: TaskInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TaskInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock function for onChange
const mockOnChange = fn();

// Component to render multiple states in a visual matrix
const TaskInputMatrix = ({ type }: { type: "input" | "textarea" }) => {
  const emptyRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const filledRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  return (
    <div className="flex flex-col gap-6 p-4">
      <h2 className="text-slate-11 text-lg font-semibold">
        {type === "input" ? "Input" : "Textarea"} States
      </h2>

      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-slate-12 mb-2 text-sm">Empty</h3>
          <TaskInput
            type={type}
            defaultValue=""
            onChange={mockOnChange}
            ref={emptyRef}
          />
        </div>

        <div>
          <h3 className="text-slate-12 mb-2 text-sm">With Value</h3>
          <TaskInput
            type={type}
            defaultValue={
              type === "input"
                ? "Sample task title"
                : "This is a longer description that shows how the textarea handles multiple lines of text content."
            }
            onChange={mockOnChange}
            ref={filledRef}
          />
        </div>
      </div>
    </div>
  );
};

export const VisualInputStates: Story = {
  args: {
    type: "input" as const,
    defaultValue: "",
    onChange: mockOnChange,
    ref: { current: null },
  },
  render: () => <TaskInputMatrix type="input" />,
};

export const VisualTextareaStates: Story = {
  args: {
    type: "textarea" as const,
    defaultValue: "",
    onChange: mockOnChange,
    ref: { current: null },
  },
  render: () => <TaskInputMatrix type="textarea" />,
};

// Interaction tests
export const TestInputTyping: Story = {
  args: {
    type: "input",
    defaultValue: "",
    onChange: mockOnChange,
    ref: { current: null },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Type in input field", async () => {
      const input = canvas.getByTestId("task-input");
      await userEvent.type(input, "New task title");
      await expect(input).toHaveValue("New task title");
    });
  },
};

export const TestTextareaTyping: Story = {
  args: {
    type: "textarea",
    defaultValue: "",
    onChange: mockOnChange,
    ref: { current: null },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Type in textarea field", async () => {
      const textarea = canvas.getByTestId("task-textarea");
      await userEvent.type(
        textarea,
        "This is a task description{enter}with multiple lines",
      );
      await expect(textarea).toHaveValue(
        "This is a task description\nwith multiple lines",
      );
    });
  },
};

export const TestCtrlEnterSubmission: Story = {
  args: {
    type: "input",
    defaultValue: "",
    onChange: mockOnChange,
    ref: { current: null },
  },
  beforeEach() {
    mockOnChange.mockClear();
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Type text and submit with Ctrl+Enter", async () => {
      const input = canvas.getByTestId("task-input");
      await userEvent.type(input, "Task to submit");
      await userEvent.keyboard("{Control>}{Enter}{/Control}");
      await expect(mockOnChange).toHaveBeenCalledWith("Task to submit");
    });
  },
};

export const TestTextareaCtrlEnterSubmission: Story = {
  args: {
    type: "textarea",
    defaultValue: "",
    onChange: mockOnChange,
    ref: { current: null },
  },
  beforeEach() {
    mockOnChange.mockClear();
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Type multiline text and submit with Ctrl+Enter", async () => {
      const textarea = canvas.getByTestId("task-textarea");
      await userEvent.type(textarea, "Line 1{enter}Line 2{enter}Line 3");
      await userEvent.keyboard("{Control>}{Enter}{/Control}");
      await expect(mockOnChange).toHaveBeenCalledWith("Line 1\nLine 2\nLine 3");
    });
  },
};

export const TestDefaultValue: Story = {
  args: {
    type: "input",
    defaultValue: "Pre-filled value",
    onChange: mockOnChange,
    ref: { current: null },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify default value is displayed", async () => {
      const input = canvas.getByTestId("task-input");
      await expect(input).toHaveValue("Pre-filled value");
    });

    await step("Modify default value", async () => {
      const input = canvas.getByTestId("task-input");
      await userEvent.clear(input);
      // TODO: JAC-111
      // await userEvent.type(input, "Modified value");
      // expect(input).toHaveValue("Modified value");
    });
  },
};
