import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, screen, waitFor } from "storybook/test";
import React from "react";
import { Button } from "../button/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
} from "./popover";

const meta: Meta<typeof Popover> = {
  title: "Components/Popover",
  component: Popover,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Popover>;

// Visual Matrix Story
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-row gap-8">
      {/* Default Popover */}
      <Popover dataTestId="default-popover">
        <PopoverTrigger asChild>
          <Button variant="outline" dataTestId="open-popover-button">
            Open Popover
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="text-slate-12">Default Popover Content</div>
        </PopoverContent>
      </Popover>
      {/* Popover with Anchor */}
      <Popover dataTestId="anchor-popover">
        <PopoverAnchor>
          <Button variant="secondary" dataTestId="anchor-button">
            Anchor
          </Button>
        </PopoverAnchor>
        <PopoverTrigger asChild>
          <Button dataTestId="open-with-anchor-button">Open with Anchor</Button>
        </PopoverTrigger>
        <PopoverContent sideOffset={12} align="end">
          <div className="text-slate-12">With Anchor & Offset</div>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

// Functional/Interaction Story
export const OpenAndClose: Story = {
  name: "Interaction: Open and Close",
  render: () => (
    <Popover dataTestId="interaction-popover">
      <PopoverTrigger asChild>
        <Button variant="outline" dataTestId="open-popover-button">
          Open Popover
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="text-slate-12">Popover test content</div>
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const triggerButton = await canvas.findByRole("button", {
      name: /open popover/i,
    });
    await step("Open popover", async () => {
      await userEvent.click(triggerButton);
      const content = await screen.findByText("Popover test content");
      await waitFor(() => expect(content).toBeVisible());
    });
    await step("Close popover with Escape", async () => {
      await userEvent.keyboard("{Escape}");
      await waitFor(() =>
        expect(screen.queryByText("Popover test content")).toBeNull(),
      );
    });
  },
};
