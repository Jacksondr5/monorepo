import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  userEvent,
  within,
  expect,
  fn,
  screen,
  waitFor,
} from "storybook/test";
import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose, // Added DialogClose for interaction tests
} from "./dialog";
import { Button } from "../button/button"; // Assuming Button component is available
import { Label } from "../label/label";
import { Input } from "../input/input";

const meta: Meta<typeof Dialog> = {
  title: "Components/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof Dialog>;

export const AllVariants: Story = {
  args: {}, // No specific args needed for the wrapper, variants are in render
  render: () => (
    <div className="flex flex-col gap-6">
      {/* Variant 1: Basic Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Basic Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Basic Title</DialogTitle>
            <DialogDescription>
              This is a basic dialog description. Make changes and save.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p>Some basic content goes here.</p>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Variant 2: Dialog with Form */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Dialog with Form</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value="Pedro Duarte" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input id="username" value="@peduarte" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Variant 3: Dialog with explicit Close Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Dialog with Close Button</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p>This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
};

export const InteractionTest: Story = {
  args: {
    // Mock functions for testing interactions
    onOpenChange: fn(),
  },
  render: (args) => (
    <Dialog onOpenChange={args.onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Interaction Test Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Interaction Test</DialogTitle>
          <DialogDescription>
            Test opening, closing, and form interaction.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="test-input" className="text-right">
              Test Input
            </Label>
            <Input
              id="test-input"
              defaultValue="Initial Value"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);

    await step("Open Dialog by clicking trigger", async () => {
      const triggerButton = canvas.getByRole("button", {
        name: /Interaction Test Dialog/i,
      });
      await userEvent.click(triggerButton);
      await expect(args.onOpenChange).toHaveBeenCalledWith(true);
      await screen.findByRole("dialog", undefined, { timeout: 1000 });
      const dialogTitle = await screen.findByText("Interaction Test");
      expect(dialogTitle).toBeInTheDocument();
    });

    await step("Interact with form element", async () => {
      const input = await screen.findByLabelText(/Test Input/i);
      await userEvent.clear(input);
      await userEvent.type(input, "New Value");
      expect(input).toHaveValue("New Value");
    });

    await step(
      "Close Dialog using explicit Close Button (Cancel)",
      async () => {
        const cancelButton = screen.getByRole("button", { name: /Cancel/i });
        await userEvent.click(cancelButton);
        await expect(args.onOpenChange).toHaveBeenCalledWith(false);
        // Check dialog is visually gone
        await waitFor(() => {
          expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });
      },
    );

    await step("Reopen Dialog and close using X button", async () => {
      const triggerButton = canvas.getByRole("button", {
        name: /Interaction Test Dialog/i,
      });
      await userEvent.click(triggerButton);
      await expect(args.onOpenChange).toHaveBeenCalledWith(true);
      const dialog = await screen.findByRole("dialog");
      // Find the close button (typically has sr-only text "Close")
      const closeButton = within(dialog).getByRole("button", {
        name: /Close/i,
      });
      await userEvent.click(closeButton);
      await expect(args.onOpenChange).toHaveBeenCalledWith(false);
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    await step("Reopen Dialog and close by clicking overlay", async () => {
      const triggerButton = canvas.getByRole("button", {
        name: /Interaction Test Dialog/i,
      });
      await userEvent.click(triggerButton);
      await expect(args.onOpenChange).toHaveBeenCalledWith(true);
      // Find overlay by its test ID
      const dialogOverlay = screen.getByTestId("dialog-overlay");
      expect(dialogOverlay).toBeInTheDocument(); // Ensure overlay exists
      await userEvent.click(dialogOverlay);
      await expect(args.onOpenChange).toHaveBeenCalledWith(false);
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    await step("Reopen Dialog and close by pressing Escape key", async () => {
      const triggerButton = canvas.getByRole("button", {
        name: /Interaction Test Dialog/i,
      });
      await userEvent.click(triggerButton);
      await expect(args.onOpenChange).toHaveBeenCalledWith(true);
      await screen.findByRole("dialog"); // Ensure dialog is open using screen
      await userEvent.keyboard("{Escape}");
      await expect(args.onOpenChange).toHaveBeenCalledWith(false);
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });
  },
};
