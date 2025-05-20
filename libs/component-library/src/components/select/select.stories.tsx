import type { Meta, StoryObj } from "@storybook/react";
import {
  fn,
  userEvent,
  within,
  expect,
  screen,
  fireEvent,
} from "@storybook/test";
import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "./select";

const OPTIONS = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Dragonfruit", value: "dragonfruit" },
  { label: "Elderberry", value: "elderberry" },
];

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    "aria-invalid": { control: "boolean", name: "Error State (aria-invalid)" },
    placeholder: { control: "text" },
    className: { control: false },
    onValueChange: { action: "changed" },
  },
  args: {
    onValueChange: fn(),
    placeholder: "Pick a fruit...",
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

// 1. Visual Matrix Story
export const AllVariants: Story = {
  parameters: {
    controls: { hideNoControlsWarning: true, sort: "requiredFirst" },
  },
  render: (args) => {
    // Matrix: [enabled, disabled] x [normal, error] x [with/without value]
    const states = [
      { label: "Enabled", disabled: false },
      { label: "Disabled", disabled: true },
    ];
    const errors = [
      { label: "Normal", "aria-invalid": false },
      { label: "Error", "aria-invalid": true },
    ];
    const values = [
      { label: "No Value", value: undefined },
      { label: "With Value", value: OPTIONS[2].value },
    ];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {states.map((state) => (
          <div key={state.label} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <h3 style={{ margin: 0 }}>{state.label}</h3>
            {errors.map((error) => (
              <div key={error.label} style={{ display: "flex", flexDirection: "row", gap: 24, alignItems: "flex-end" }}>
                {values.map((val) => (
                  <div key={val.label} style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 220 }}>
                    <span style={{ fontSize: 13, color: "#888" }}>{error.label} / {val.label}</span>
                    <Select
                      {...args}
                      disabled={state.disabled}
                      aria-invalid={error["aria-invalid"]}
                      value={val.value}
                      onValueChange={args.onValueChange}
                    >
                      <SelectTrigger size="default">
                        <SelectValue placeholder={args.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Fruits</SelectLabel>
                          {OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                        <SelectSeparator />
                        <SelectGroup>
                          <SelectLabel>Other</SelectLabel>
                          <SelectItem value="other">Other...</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  },
  args: {},
};

// 2. Functional/Interaction Stories
export const SelectChange: Story = {
  name: "Test: Change Value",
  args: {
    disabled: false,
    "aria-invalid": false,
    value: undefined,
    placeholder: "Pick a fruit...",
  },
  render: (args) => (
    <Select {...args}>
      <SelectTrigger size="default" />
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          {OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
      <SelectValue placeholder={args.placeholder} />
    </Select>
  ),
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button");
    await step("Open dropdown", async () => {
      await userEvent.click(trigger);
      await expect(canvas.getByRole("listbox")).toBeInTheDocument();
    });
    await step("Select Banana", async () => {
      const item = canvas.getByText("Banana");
      await userEvent.click(item);
      await expect(args.onValueChange).toHaveBeenCalledWith("banana");
    });
  },
};

export const DisabledNoInteraction: Story = {
  name: "Test: Disabled Select No Interaction",
  args: {
    disabled: true,
    value: undefined,
    placeholder: "Pick a fruit...",
  },
  render: (args) => (
    <Select {...args}>
      <SelectTrigger size="default" />
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          {OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
      <SelectValue placeholder={args.placeholder} />
    </Select>
  ),
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button");
    await step("Verify disabled", async () => {
      await expect(trigger).toBeDisabled();
    });
    await step("Try to open dropdown", async () => {
      try {
        await userEvent.click(trigger);
      } catch (e) {}
      // Should not open
      await expect(canvas.queryByRole("listbox")).not.toBeInTheDocument();
    });
  },
};

export const ErrorState: Story = {
  name: "Test: Error State",
  args: {
    disabled: false,
    "aria-invalid": true,
    value: undefined,
    placeholder: "Pick a fruit...",
  },
  render: (args) => (
    <Select {...args}>
      <SelectTrigger size="default" />
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          {OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
      <SelectValue placeholder={args.placeholder} />
    </Select>
  ),
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button");
    await step("Check aria-invalid", async () => {
      await expect(trigger).toHaveAttribute("aria-invalid", "true");
    });
  },
};
