/* eslint-disable @typescript-eslint/no-empty-function */
import type { Meta, StoryObj } from "@storybook/react";
import { Tag, TagProps } from "./tag";
import { Check, AlertCircle, Info, X } from "lucide-react";
import { userEvent, within, expect, fn } from "@storybook/test";

const meta: Meta<typeof Tag> = {
  title: "Components/Tag",
  component: Tag,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: {
        type: "select",
        options: [
          "default",
          "primary",
          "secondary",
          "success",
          "warning",
          "error",
          "outline",
        ],
      },
    },
    size: {
      control: {
        type: "select",
        options: ["sm", "md", "lg"],
      },
    },
    rounded: {
      control: {
        type: "select",
        options: ["md", "full"],
      },
    },
    onDismiss: {
      action: "onDismiss",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: {
    children: "Tag",
  },
};

const generateVariants = (args?: Partial<TagProps>) => {
  return (
    <div className="flex flex-wrap gap-4">
      <Tag variant="default" {...args}>
        Default
      </Tag>
      <Tag variant="primary" {...args}>
        Primary
      </Tag>
      <Tag variant="secondary" {...args}>
        Secondary
      </Tag>
      <Tag variant="success" {...args}>
        Success
      </Tag>
      <Tag variant="warning" {...args}>
        Warning
      </Tag>
      <Tag variant="error" {...args}>
        Error
      </Tag>
      <Tag variant="outline" {...args}>
        Outline
      </Tag>
    </div>
  );
};

const generateSizeVariants = (args?: Partial<TagProps>) => {
  return (
    <>
      {generateVariants({ ...args, size: "sm" })}
      {generateVariants({ ...args, size: "md" })}
      {generateVariants({ ...args, size: "lg" })}
    </>
  );
};

export const AllVariants: Story = {
  render: () => (
    <div className="text-slate-11 flex flex-col gap-4">
      <h2 className="font-bold">Default</h2>
      {generateSizeVariants()}
      <h2 className="font-bold">Dismissable</h2>
      {generateSizeVariants({ onDismiss: () => {} })}
      <h2 className="font-bold">Disabled</h2>
      {generateSizeVariants({ isDisabled: true })}
      <h2 className="font-bold">With Icon</h2>
      {generateSizeVariants({ icon: <Check className="h-3.5 w-3.5" /> })}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Tag size="sm">Small</Tag>
      <Tag size="md">Medium</Tag>
      <Tag size="lg">Large</Tag>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Tag icon={<Check className="h-3.5 w-3.5" />}>Success</Tag>
      <Tag variant="warning" icon={<AlertCircle className="h-3.5 w-3.5" />}>
        Warning
      </Tag>
      <Tag variant="secondary" icon={<Info className="h-3.5 w-3.5" />}>
        Info
      </Tag>
    </div>
  ),
};

export const Dismissible: Story = {
  args: {
    children: "Dismissible Tag",
    onDismiss: () => console.log("Tag dismissed"),
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Tag",
    isDisabled: true,
  },
};

export const TestDismissible: Story = {
  args: {
    children: "Click X to remove",
    // onClick is inherited from meta.args
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const tag = canvas.getByText("Click X to remove");
    const dismissButton = canvas.getByRole("button", {
      name: "Remove tag",
    });

    await step("Dismiss button is present and clickable", async () => {
      expect(dismissButton).toBeInTheDocument();
      expect(dismissButton).toHaveAttribute("aria-label", "Remove tag");

      await userEvent.click(dismissButton);
      await expect(args.onDismiss).toHaveBeenCalledTimes(1);
    });
  },
};

export const TestKeyboardNavigation: Story = {
  args: {
    children: "Dismissible Tag",
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const dismissibleTag = canvas.getByRole("button", {
      name: "Remove tag",
    });

    await step("Focus dismissible tag with keyboard", async () => {
      await userEvent.tab();
      expect(dismissibleTag).toHaveFocus();
    });

    await step("Dismiss tag with Delete key", async () => {
      // Focus the dismiss button and press Enter
      await userEvent.keyboard("{enter}");
      expect(args.onDismiss).toHaveBeenCalledTimes(1);
    });
  },
};
