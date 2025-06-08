import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, screen, waitFor } from "storybook/test";
import React from "react";
import { DatePicker, DatePickerProps } from "./date-picker";

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DatePicker>;

const targetDate = new Date("2025-04-26");
const defaultProps: DatePickerProps = {
  value: targetDate,
  placeholder: "Pick a date",
  defaultMonth: targetDate,
  dataTestId: "date-picker",
};

// Visual Matrix Story
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-slate-12">Default (no value)</h3>
        <DatePicker
          placeholder="Pick a date"
          defaultMonth={targetDate}
          dataTestId="date-picker"
        />
      </div>
      <div>
        <h3 className="text-slate-12">With Value</h3>
        <DatePicker {...defaultProps} value={targetDate} />
      </div>
      <div>
        <h3 className="text-slate-12">Disabled</h3>
        <DatePicker {...defaultProps} disabled />
      </div>
      <div>
        <h3 className="text-slate-12">Error</h3>
        <DatePicker {...defaultProps} error />
      </div>
    </div>
  ),
};

// Functional/Interaction Story
export const Interaction_SelectDate: Story = {
  name: "Interaction: Select Date",
  render: () => {
    const [selected, setSelected] = React.useState<Date | undefined>();
    return (
      <DatePicker
        defaultMonth={targetDate}
        value={selected}
        onChange={setSelected}
        dataTestId="date-picker"
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const triggerButton = await canvas.findByRole("button", {
      name: /pick a date/i,
    });
    await step("Open popover", async () => {
      await userEvent.click(triggerButton);
      const calendar = await screen.findByRole("grid");
      await waitFor(() => {
        expect(calendar).toBeVisible();
      });
    });
    await step("Select day 15", async () => {
      const dayButton = Array.from(document.querySelectorAll("button")).find(
        (btn) => btn.textContent === "15",
      );
      if (!dayButton) throw new Error("Day 15 not found");
      await userEvent.click(dayButton);
      // The popover should close, and the button should now show the date
      await waitFor(() => {
        expect(triggerButton.textContent?.toLowerCase()).toContain("15");
      });
    });
  },
};
