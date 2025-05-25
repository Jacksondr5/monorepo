import type { Meta, StoryObj } from "@storybook/react";
import { fn, userEvent, within, expect, waitFor } from "@storybook/test";

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
    onValueChange: { action: "changed" },
  },
  args: {
    onValueChange: fn(),
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
    // Matrix: [enabled, disabled] x [with/without value]
    const states = [
      { label: "Enabled", disabled: false },
      { label: "Disabled", disabled: true },
    ];
    const values = [
      { label: "No Value", value: undefined },
      { label: "With Value", value: OPTIONS[2].value },
    ];
    return (
      <div className="text-slate-12 flex flex-col gap-8">
        {states.map((state) => (
          <div key={state.label} className="flex flex-col gap-4">
            <h3 className="m-0">{state.label}</h3>
            {values.map((val) => (
              <div key={val.label} className="flex flex-row items-end gap-6">
                <div
                  key={val.label}
                  className="flex min-w-[220px] flex-col gap-1"
                >
                  <span className="text-slate-9 text-xs">{val.label}</span>
                  <Select
                    {...args}
                    disabled={state.disabled}
                    value={val.value}
                    onValueChange={args.onValueChange}
                  >
                    <SelectTrigger size="default">
                      <SelectValue />
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
    value: "apple",
  },
  render: (args) => (
    <div className="w-[220px]">
      <Select {...args}>
        <SelectTrigger size="default">
          <SelectValue />
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
        </SelectContent>
      </Select>
    </div>
  ),
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("combobox");

    await step("Open dropdown", async () => {
      await userEvent.click(trigger);
      // Wait for the dropdown to animate in
      await waitFor(() => {
        const listbox = document.querySelector<HTMLElement>('[role="listbox"]');
        return expect(listbox).toBeInTheDocument();
      });

      // The listbox is in a portal, so we need to query the document
      const listbox = document.querySelector<HTMLElement>('[role="listbox"]');
      if (!listbox) {
        throw new Error("Dropdown listbox not found");
      }
      await expect(listbox).toBeInTheDocument();
    });

    await step("Select Banana", async () => {
      // Find the option by its text content in the document
      // Radix UI adds the option text in a span inside the option
      const option = Array.from(
        document.querySelectorAll('[role="option"]'),
      ).find((el) => {
        const span = el.querySelector("span:not([class])");
        return span?.textContent?.includes("Banana");
      });

      if (!option) {
        throw new Error("Banana option not found");
      }

      await userEvent.click(option);
      await expect(args.onValueChange).toHaveBeenCalledWith("banana");
    });
  },
};

export const DisabledNoInteraction: Story = {
  name: "Test: Disabled Select No Interaction",
  args: {
    disabled: true,
    value: undefined,
  },
  render: (args) => (
    <div className="w-[220px]">
      <Select {...args}>
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
        </SelectContent>
      </Select>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("combobox");

    await step("Verify disabled", async () => {
      await expect(trigger).toBeDisabled();
    });

    await step("Try to open dropdown", async () => {
      await userEvent.click(trigger);
      // Give it a moment in case there's any animation
      await new Promise((resolve) => setTimeout(resolve, 100));
      // Check that no listbox was opened in the document
      const listbox = document.querySelector('[role="listbox"]');
      await expect(listbox).not.toBeInTheDocument();
    });
  },
};
