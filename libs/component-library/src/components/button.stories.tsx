import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test"; // For action logging
import { Button } from "./button"; // Assuming button.tsx is in the same directory
import { Aperture } from "lucide-react"; // Example icon

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Button> = {
  title: "Button", // Categorize under UI
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
    asChild: {
      control: "boolean",
    },
    children: {
      control: "text",
    },
    // Example of adding an action arg
    onClick: { action: "clicked" },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked
  args: { onClick: fn() },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Base story
export const Default: Story = {
  args: {
    variant: "default",
    size: "default",
    children: "Default Button",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    size: "default",
    children: "Destructive Button",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    size: "default",
    children: "Outline Button",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    size: "default",
    children: "Secondary Button",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    size: "default",
    children: "Ghost Button",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    size: "default",
    children: "Link Button",
  },
};

export const Small: Story = {
  args: {
    variant: "default",
    size: "sm",
    children: "Small Button",
  },
};

export const Large: Story = {
  args: {
    variant: "default",
    size: "lg",
    children: "Large Button",
  },
};

export const IconOnly: Story = {
  args: {
    variant: "default", // Or 'ghost' or 'outline' often used for icon buttons
    size: "icon",
    children: <Aperture />, // Using children for icon as per ShadCN Slot pattern
  },
};

export const WithIconAndText: Story = {
  args: {
    variant: "default",
    size: "default",
    children: (
      <>
        <Aperture />
        <span>Icon Button</span>
      </>
    ),
  },
};

export const AsChildExample: Story = {
  args: {
    variant: "default",
    size: "default",
    asChild: true,
    children: <a href="#">Link styled as Button</a>,
  },
};

export const Disabled: Story = {
  args: {
    variant: "default",
    size: "default",
    children: "Disabled Button",
    disabled: true,
  },
};
