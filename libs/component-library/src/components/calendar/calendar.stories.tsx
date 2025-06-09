import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect } from "storybook/test";
import React from "react";
import { Calendar, CalendarProps } from "./calendar";

const meta: Meta<typeof Calendar> = {
  title: "Components/Calendar",
  component: Calendar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Calendar>;

const targetDate = new Date("2025-04-26");
const defaultProps = {
  selected: targetDate,
  defaultMonth: targetDate,
  dataTestId: "calendar",
} satisfies CalendarProps;
// Visual Matrix Story
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {/* Default Calendar */}
      <h2 className="text-slate-12">Default Calendar</h2>
      <Calendar {...defaultProps} />
      {/* TODO: implement later */}
      {/* Range Selection */}
      {/* <h2 className="text-slate-12">Range Selection</h2>
      <Calendar
        {...defaultProps}
        mode="range"
        selected={{
          from: targetDate,
          to: new Date(targetDate.getTime() + 86400000 * 4),
        }}
      /> */}
      {/* Disabled Days */}
      {/* <h2 className="text-slate-12">Disabled Days</h2>
      <Calendar {...defaultProps} disabled={[{ dayOfWeek: [0, 6] }]} /> */}
    </div>
  ),
};

// Functional/Interaction Story
export const SelectDate: Story = {
  name: "Interaction: Select Date",
  render: () => <Calendar {...defaultProps} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const allButtons = canvas.getAllByRole("button");
    const dayButton = allButtons.find((btn) => btn.textContent === "15");
    if (dayButton) {
      await step("Select day 15", async () => {
        await userEvent.click(dayButton);
        await expect(dayButton).toHaveAttribute("aria-selected", "true");
      });
    }
  },
};
