import type { Meta, StoryObj } from "@storybook/react";
import { fn, userEvent, within, expect } from "@storybook/test";
import { Input, inputVariants } from "./input"; // Added inputVariants import
import { Search } from "lucide-react"; // Import an icon

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "password", "email", "number", "search", "tel", "url"],
    },
    placeholder: {
      control: "text",
    },
    disabled: {
      control: "boolean",
    },
    value: {
      control: "text",
    },
    onChange: { action: "changed" },
    icon: {
      control: false, // Disable direct control for ReactNode in Storybook UI
    },
    iconPosition: {
      control: "radio",
      options: ["left", "right"],
    },
  },
  args: {
    onChange: fn(), // Default spy for onChange
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Stories for Default, Password, Disabled, and WithValue removed as they are covered in AllVariants.

// Visual Matrix Story
export const AllVariants: Story = {
  parameters: {
    controls: { hideNoControlsWarning: true, sort: "requiredFirst" },
  },
  render: (args) => {
    const sizes = Object.keys(
      inputVariants.size,
    ) as (keyof typeof inputVariants.size)[];

    const iconElement = <Search className="size-4" />;

    return (
      <div className="flex min-w-[600px] flex-col items-start gap-10 p-5">
        {sizes.map((size) => (
          <div key={size} className="flex w-full flex-col items-start gap-5">
            <h2 className="text-slate-12 m-0 mb-4 w-full border-b border-slate-300 pb-2 text-lg font-semibold capitalize">
              Size: {size}
            </h2>
            <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
              {/* Standard Inputs */}
              <Input
                {...args}
                size={size}
                placeholder={`Placeholder (${size})`}
              />
              <Input
                {...args}
                size={size}
                value={`Value (${size})`}
                onChange={args.onChange}
              />
              <Input
                {...args}
                size={size}
                placeholder={`Disabled Placeholder (${size})`}
                disabled
              />
              <Input
                {...args}
                size={size}
                value={`Disabled Value (${size})`}
                disabled
                onChange={args.onChange}
              />

              {/* Inputs with Icon Left */}
              <Input
                {...args}
                size={size}
                icon={iconElement}
                iconPosition="left"
                placeholder={`Icon Left (${size})`}
              />
              <Input
                {...args}
                size={size}
                icon={iconElement}
                iconPosition="left"
                value={`Icon Left Value (${size})`}
                onChange={args.onChange}
              />

              {/* Inputs with Icon Right */}
              <Input
                {...args}
                size={size}
                icon={iconElement}
                iconPosition="right"
                placeholder={`Icon Right (${size})`}
              />
              <Input
                {...args}
                size={size}
                icon={iconElement}
                iconPosition="right"
                value={`Icon Right Value (${size})`}
                onChange={args.onChange}
              />

              {/* Disabled Input with Icon */}
              <Input
                {...args}
                size={size}
                icon={iconElement}
                iconPosition="left"
                placeholder={`Disabled Icon Left (${size})`}
                disabled
              />
            </div>
          </div>
        ))}
      </div>
    );
  },
};

// Interaction test story
export const TypingInteraction: Story = {
  name: "Test: User Typing",
  args: {
    placeholder: "Type to test",
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const inputElement = canvas.getByPlaceholderText("Type to test");

    await step("Focus and type into input", async () => {
      await userEvent.type(inputElement, "Hello world!");
      expect(inputElement).toHaveValue("Hello world!");
      // Check if onChange was called. For each character typed, onChange is called.
      // So, "Hello world!" (12 chars) should result in 12 calls.
      expect(args.onChange).toHaveBeenCalledTimes(12);
    });

    await step("Clear the input", async () => {
      await userEvent.clear(inputElement);
      expect(inputElement).toHaveValue("");
      // onChange is also called for clear.
      expect(args.onChange).toHaveBeenCalledTimes(13); // 12 (type) + 1 (clear)
    });
  },
};
