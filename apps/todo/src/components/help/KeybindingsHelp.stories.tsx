import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within, userEvent } from "storybook/test";
import React from "react";
import { KeybindingsHelp } from "./KeybindingsHelp";
import { HelpWrapper } from "./HelpWrapper";
import { EditingProvider } from "../../contexts/EditingContext";

const meta: Meta<typeof KeybindingsHelp> = {
  title: "Todo/Help/KeybindingsHelp",
  component: KeybindingsHelp,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "KeybindingsHelp component displays a floating help overlay with all available keyboard shortcuts for the todo app. It provides a quick reference for users to understand how to navigate and interact with tasks using keyboard commands.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic visual story showing the help overlay
export const Default: Story = {
  name: "Visual: Default Help Overlay",
  render: () => (
    <div className="bg-slate-1 relative min-h-screen p-8">
      {/* Background content to show the overlay context */}
      <div className="space-y-4">
        <h1 className="text-slate-12 text-2xl font-bold">Todo App</h1>
        <p className="text-slate-11">
          This is the main todo application interface. The help overlay appears
          on top of this content.
        </p>
        <div className="space-y-2">
          <div className="bg-slate-3 rounded p-3">
            <h3 className="text-slate-12 font-medium">Sample Task 1</h3>
            <p className="text-slate-10 text-sm">
              Complete project documentation
            </p>
          </div>
          <div className="bg-slate-3 rounded p-3">
            <h3 className="text-slate-12 font-medium">Sample Task 2</h3>
            <p className="text-slate-10 text-sm">Fix authentication bug</p>
          </div>
        </div>
      </div>

      {/* The help overlay */}
      <KeybindingsHelp />
    </div>
  ),
};

// Interactive story testing the HelpWrapper functionality
export const TestHelpWrapperInteraction: Story = {
  name: "Test: Help Wrapper Keyboard Interaction",
  decorators: [
    (Story) => (
      <EditingProvider>
        <Story />
      </EditingProvider>
    ),
  ],
  render: () => (
    <HelpWrapper>
      <div className="bg-slate-1 min-h-screen p-8">
        <div className="space-y-4">
          <h1 className="text-slate-12 text-2xl font-bold">
            Todo App with Help Wrapper
          </h1>
          <p className="text-slate-11">
            This story tests the HelpWrapper component. Press &quot;/&quot; to
            toggle the help overlay.
          </p>
          <div className="space-y-2">
            <div className="bg-slate-3 rounded p-3">
              <h3 className="text-slate-12 font-medium">Sample Task 1</h3>
              <p className="text-slate-10 text-sm">
                Complete project documentation
              </p>
            </div>
            <div className="bg-slate-3 rounded p-3">
              <h3 className="text-slate-12 font-medium">Sample Task 2</h3>
              <p className="text-slate-10 text-sm">Fix authentication bug</p>
            </div>
          </div>
          <div
            className="bg-slate-4 mt-8 rounded p-4"
            tabIndex={0}
            data-testid="help-toggle-text"
          >
            <p className="text-slate-11 text-sm">
              <strong>Instructions:</strong> Click anywhere in this area and
              press &quot;/&quot; to toggle help.
            </p>
          </div>
        </div>
      </div>
    </HelpWrapper>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify help overlay is initially hidden", async () => {
      // Help overlay should not be visible initially
      expect(canvas.queryByText("Keybindings")).not.toBeInTheDocument();
    });

    await step("Press '/' key to show help overlay", async () => {
      // Focus the wrapper by clicking on it
      const wrapper = canvas.getByTestId("help-toggle-text");
      await userEvent.click(wrapper);

      // Press the "/" key to toggle help
      await userEvent.keyboard("/");

      // Help overlay should now be visible
      expect(canvas.getByText("Keybindings")).toBeInTheDocument();
      expect(canvas.getByText("Tab: Go to next todo")).toBeInTheDocument();
      expect(canvas.getByText("a: Add todo")).toBeInTheDocument();
      expect(canvas.getByText("/: Open help")).toBeInTheDocument();
    });

    await step("Press '/' key again to hide help overlay", async () => {
      // Press "/" again to toggle help off
      await userEvent.keyboard("/");

      // Help overlay should be hidden again
      expect(canvas.queryByText("Keybindings")).not.toBeInTheDocument();
    });

    await step("Verify help can be toggled multiple times", async () => {
      // Toggle help on
      await userEvent.keyboard("/");
      expect(canvas.getByText("Keybindings")).toBeInTheDocument();

      // Toggle help off
      await userEvent.keyboard("/");
      expect(canvas.queryByText("Keybindings")).not.toBeInTheDocument();

      // Toggle help on again
      await userEvent.keyboard("/");
      expect(canvas.getByText("Keybindings")).toBeInTheDocument();
    });
  },
};
