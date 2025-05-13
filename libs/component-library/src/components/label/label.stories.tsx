import type { Meta, StoryObj } from "@storybook/react";

import { Label } from "./label";
import { Input } from "../input/input"; // Assuming Input exists for demonstration
import { Checkbox } from "../checkbox/checkbox"; // Assuming Checkbox exists for demonstration

const meta: Meta<typeof Label> = {
  title: "Components/Label",
  component: Label,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    // Define argTypes for props if needed, e.g., children
    children: { control: "text" },
  },
  args: {
    children: "Your Label",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Story demonstrating various label usages
export const AllVariants: Story = {
  render: (args) => (
    <div className="grid gap-6">
      {/* Standalone Label */}
      <div>
        <h3 className="text-slate-10 mb-2 text-sm font-medium">
          Standalone Label
        </h3>
        <Label {...args}>This is a standalone label</Label>
      </div>

      {/* Label with Input */}
      <div>
        <h3 className="text-slate-10 mb-2 text-sm font-medium">With Input</h3>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email-variants" {...args}>
            Email Address
          </Label>
          <Input
            type="email"
            id="email-variants"
            placeholder="you@example.com"
          />
        </div>
      </div>

      {/* Label with Disabled Input */}
      <div>
        <h3 className="text-slate-10 mb-2 text-sm font-medium">
          With Disabled Input
        </h3>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="name-disabled-variants" {...args}>
            Name (Disabled Input)
          </Label>
          <Input
            type="text"
            id="name-disabled-variants"
            placeholder="Cannot enter name"
            disabled
          />
        </div>
      </div>

      {/* Label with Checkbox */}
      <div>
        <h3 className="text-slate-10 mb-2 text-sm font-medium">
          With Checkbox
        </h3>
        <div className="flex items-center space-x-2">
          <Checkbox id="terms-variants" />
          <Label htmlFor="terms-variants" {...args}>
            Accept terms and conditions
          </Label>
        </div>
      </div>

      {/* Label with Disabled Checkbox */}
      <div>
        <h3 className="text-slate-10 mb-2 text-sm font-medium">
          With Disabled Checkbox
        </h3>
        <div className="flex items-center space-x-2">
          <Checkbox id="terms-disabled-variants" disabled />
          <Label htmlFor="terms-disabled-variants" {...args}>
            Accept terms (disabled checkbox)
          </Label>
        </div>
      </div>
    </div>
  ),
  args: {
    // Args here apply to all labels within the story
  },
};
