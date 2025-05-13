import type { Meta, StoryObj } from "@storybook/react";
import { fn, userEvent, within, expect } from "@storybook/test";
import { Checkbox, type CheckboxProps } from "./checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "select",
      options: [true, false, "indeterminate"],
    },
    disabled: {
      control: "boolean",
    },
    size: {
      control: "radio",
      options: ["default", "lg"],
    },
    // Radix specific props, may not be needed for typical stories
    // defaultChecked: { control: false },
    // onCheckedChange: { action: "checkedChanged" },
  },
  args: {
    onCheckedChange: fn(), // Default spy for onCheckedChange
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// AllStates Story
export const AllStates: Story = {
  name: "Visual: All States",
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
  render: (args) => {
    const states: CheckboxProps["checked"][] = [false, true, "indeterminate"];
    const sizes: CheckboxProps["size"][] = ["default", "lg"];

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, auto)",
          gap: "40px 20px",
          alignItems: "start",
          justifyContent: "start",
        }}
      >
        {/* Headers for sizes */}
        <div
          style={{
            fontWeight: 600,
            textTransform: "capitalize",
            justifySelf: "center",
          }}
        >
          Default Size
        </div>
        <div
          style={{
            fontWeight: 600,
            textTransform: "capitalize",
            justifySelf: "center",
          }}
        >
          Large Size
        </div>

        {/* Normal states */}
        {states.map((state) =>
          sizes.map((size) => (
            <div
              key={`${state}-${size}-normal`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                justifySelf: "center",
              }}
            >
              <Checkbox
                {...args}
                size={size}
                checked={state}
                id={`all-${state}-${size}-normal`}
                aria-label={`${state === "indeterminate" ? "Indeterminate" : state ? "Checked" : "Default"} ${size}`}
              />
              <span
                style={{
                  textTransform: "capitalize",
                  fontSize: "12px",
                  color: "#666",
                }}
              >
                {`${state === "indeterminate" ? "Indeterminate" : state ? "Checked" : "Default"} (${size})`}
              </span>
            </div>
          )),
        )}

        {/* Spacer */}
        <div style={{ gridColumn: "span 2", height: "20px" }}></div>

        {/* Disabled states */}
        {states.map((state) =>
          sizes.map((size) => (
            <div
              key={`${state}-${size}-disabled`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                justifySelf: "center",
              }}
            >
              <Checkbox
                {...args}
                size={size}
                checked={state}
                disabled
                id={`all-${state}-${size}-disabled`}
                aria-label={`Disabled ${state === "indeterminate" ? "Indeterminate" : state ? "Checked" : "Default"} ${size}`}
              />
              <span
                style={{
                  textTransform: "capitalize",
                  fontSize: "12px",
                  color: "#666",
                }}
              >
                {`Disabled ${state === "indeterminate" ? "Indeterminate" : state ? "Checked" : "Default"} (${size})`}
              </span>
            </div>
          )),
        )}

        {/* Spacer */}
        <div style={{ gridColumn: "span 2", height: "20px" }}></div>

        {/* With Label Examples */}
        {sizes.map((size) => (
          <div
            key={`label-${size}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              justifySelf: "center",
            }}
          >
            <Checkbox {...args} size={size} id={`all-label-${size}`} />
            <label
              htmlFor={`all-label-${size}`}
              className="text-slate-11 font-sans"
            >
              Label ({size})
            </label>
          </div>
        ))}
      </div>
    );
  },
  args: {
    onCheckedChange: fn(), // Ensures actions are logged if interacted with
  },
};

// Interaction test story
export const InteractionTest: Story = {
  name: "Test: User Click",
  args: {
    id: "interaction-checkbox",
    "aria-label": "Interaction Test Checkbox",
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    // Find by role if no visible label, or by label text if a label is rendered
    const checkbox = canvas.getByRole("checkbox", {
      name: "Interaction Test Checkbox",
    });

    await step("Initial state: Unchecked", async () => {
      expect(checkbox).not.toBeChecked();
    });

    await step("Click to check", async () => {
      await userEvent.click(checkbox);
      expect(checkbox).toBeChecked();
      expect(args.onCheckedChange).toHaveBeenCalledTimes(1);
      expect(args.onCheckedChange).toHaveBeenLastCalledWith(true);
    });

    await step("Click to uncheck", async () => {
      await userEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
      expect(args.onCheckedChange).toHaveBeenCalledTimes(2);
      expect(args.onCheckedChange).toHaveBeenLastCalledWith(false);
    });
  },
};

// Keyboard Interaction test story
export const KeyboardInteractionTest: Story = {
  name: "Test: Keyboard Interaction (Space)",
  args: {
    id: "keyboard-interaction-checkbox",
    "aria-label": "Keyboard Interaction Test Checkbox",
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox", {
      name: "Keyboard Interaction Test Checkbox",
    });

    await step("Initial state: Unchecked", async () => {
      expect(checkbox).not.toBeChecked();
    });

    await step("Focus the checkbox", async () => {
      // Note: userEvent.tab() might behave differently in isolation vs. full browser.
      await userEvent.tab();
      expect(checkbox).toHaveFocus();
    });

    await step("Press Space to check", async () => {
      await userEvent.keyboard("{ }"); // Simulate pressing Spacebar
      expect(checkbox).toBeChecked();
      expect(args.onCheckedChange).toHaveBeenCalledTimes(1);
      expect(args.onCheckedChange).toHaveBeenLastCalledWith(true);
    });

    await step("Press Space to uncheck", async () => {
      await userEvent.keyboard("{ }"); // Simulate pressing Spacebar again
      expect(checkbox).not.toBeChecked();
      expect(args.onCheckedChange).toHaveBeenCalledTimes(2);
      expect(args.onCheckedChange).toHaveBeenLastCalledWith(false);
    });
  },
};
