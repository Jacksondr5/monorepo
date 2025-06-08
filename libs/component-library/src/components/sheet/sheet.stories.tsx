import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, screen, waitFor } from "storybook/test";
import { Button } from "../button/button";
import { Label } from "../label/label";
import { Input } from "../input/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

const meta: Meta<typeof Sheet> = {
  title: "Components/Sheet",
  component: Sheet,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Sheet>;

const SheetDemoContent = () => (
  <>
    <SheetHeader>
      <SheetTitle>Edit Profile</SheetTitle>
      <SheetDescription>
        Make changes to your profile here. Click save when you're done.
      </SheetDescription>
    </SheetHeader>
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right" dataTestId="name-label">
          Name
        </Label>
        <Input
          id="name"
          defaultValue="Pedro Duarte"
          className="col-span-3"
          dataTestId="name-input"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label
          htmlFor="username"
          className="text-right"
          dataTestId="username-label"
        >
          Username
        </Label>
        <Input
          id="username"
          defaultValue="@peduarte"
          className="col-span-3"
          dataTestId="username-input"
        />
      </div>
    </div>
    <SheetFooter>
      <SheetClose asChild>
        <Button type="submit" dataTestId="save-button">
          Save changes
        </Button>
      </SheetClose>
    </SheetFooter>
  </>
);

export const Default: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" dataTestId="open-sheet-button">
            Open Sheet
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetDemoContent />
        </SheetContent>
      </Sheet>
    </div>
  ),

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test opening and closing each sheet variant
    const triggerButton = await canvas.findByRole("button", {
      name: `Open Sheet`,
    });
    await userEvent.click(triggerButton);
    // Wait for sheet content to be visible and animations to complete
    const sheetContent = await screen.findByText(`Edit Profile`);
    await expect(sheetContent).toBeVisible();
  },
};

export const InteractionTest: Story = {
  name: "Open and Close Interaction",
  args: {},
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger asChild>
        <Button variant="outline" dataTestId="open-sheet-button">
          Open Sheet
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Test Sheet</SheetTitle>
          <SheetDescription>This is a test sheet.</SheetDescription>
        </SheetHeader>
        <div className="p-4">Your sheet content here.</div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="secondary" dataTestId="cancel-button">
              Cancel
            </Button>
          </SheetClose>
          <Button dataTestId="save-button">Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const triggerButton = await canvas.findByRole("button", {
      name: /open sheet/i,
    });

    // Open the sheet
    await step("Open sheet", async () => {
      await userEvent.click(triggerButton);
      const sheetTitle = await screen.findByText("Test Sheet");
      await expect(sheetTitle).toBeVisible();
    });

    // Close the sheet using the X button
    await step("Close sheet with X button", async () => {
      const sheetContent = await screen.findByText("Test Sheet");
      const closeButton = await within(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        sheetContent.closest('[data-slot="sheet-content"]')!.parentElement!,
      ).findByRole("button", { name: /close/i });
      await userEvent.click(closeButton);
      await waitFor(() => expect(screen.queryByText("Test Sheet")).toBeNull());
    });

    // Re-open the sheet
    await step("Re-open sheet", async () => {
      await userEvent.click(triggerButton);
      const sheetTitle = await screen.findByText("Test Sheet");
      await expect(sheetTitle).toBeVisible();
    });

    // Close the sheet using the Cancel button in the footer
    await step("Close sheet with Cancel button", async () => {
      const cancelButton = await screen.findByRole("button", {
        name: /cancel/i,
      });
      await userEvent.click(cancelButton);
      await waitFor(() => expect(screen.queryByText("Test Sheet")).toBeNull());
    });
  },
};
