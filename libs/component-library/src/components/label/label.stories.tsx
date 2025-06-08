import type { Meta, StoryObj } from "@storybook/react-vite";

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
        <Label {...args} dataTestId="standalone-label">This is a standalone label</Label>
      </div>

      {/* Label with Input */}
      <div>
        <h3 className="text-slate-10 mb-2 text-sm font-medium">With Input</h3>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email-variants" {...args} dataTestId="email-label">
            Email Address
          </Label>
          <Input
            type="email"
            id="email-variants"
            placeholder="you@example.com"
            dataTestId="email-input-variants"
          />
        </div>
      </div>

      {/* Label with Disabled Input */}
      <div>
        <h3 className="text-slate-10 mb-2 text-sm font-medium">
          With Disabled Input
        </h3>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="name-disabled-variants" {...args} dataTestId="name-disabled-label">
            Name (Disabled Input)
          </Label>
          <Input
            type="text"
            id="name-disabled-variants"
            placeholder="Cannot enter name"
            disabled
            dataTestId="name-disabled-input-variants"
          />
        </div>
      </div>

      {/* Label with Checkbox */}
      <div>
        <h3 className="text-slate-10 mb-2 text-sm font-medium">
          With Checkbox
        </h3>
        <div className="flex items-center space-x-2">
          <Checkbox id="terms-variants" dataTestId="terms-checkbox-variants" />
          <Label htmlFor="terms-variants" {...args} dataTestId="terms-label">
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
          <Checkbox id="terms-disabled-variants" disabled dataTestId="terms-disabled-checkbox-variants" />
          <Label htmlFor="terms-disabled-variants" {...args} dataTestId="terms-disabled-label">
            Accept terms (disabled checkbox)
          </Label>
        </div>
      </div>

      {/* Standalone Label with Error */}
      <div>
        <h3 className="text-slate-10 mb-2 text-sm font-medium">
          Standalone Label with Error
        </h3>
        <Label {...args} error dataTestId="standalone-error-label">
          This is a label with an error
        </Label>
      </div>

      {/* Label with Input and Error */}
      <div>
        <h3 className="text-slate-10 mb-2 text-sm font-medium">
          With Input and Error
        </h3>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email-error-variants" {...args} error dataTestId="email-error-label">
            Email Address (with error)
          </Label>
          <Input
            type="email"
            id="email-error-variants"
            placeholder="you@example.com"
            dataTestId="email-error-input-variants"
            error // Assuming Input can also show an error state visually
            aria-invalid="true"
            aria-describedby="email-error-message-variants"
          />
          <p id="email-error-message-variants" className="text-sm text-red-11">
            Please enter a valid email address.
          </p>
        </div>
      </div>
    </div>
  ),
  args: {
    // Args here apply to all labels within the story
  },
};
