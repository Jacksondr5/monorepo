import type { Meta, StoryObj } from "@storybook/react";
import { fn, userEvent, within, expect } from "@storybook/test";
import { Input, inputVariants } from "./input"; // Added inputVariants import

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

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          alignItems: "flex-start",
          padding: "20px",
          minWidth: "400px",
        }}
      >
        {sizes.map((size) => (
          <div
            key={size}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            <h2
              style={{
                textTransform: "capitalize",
                margin: 0,
                borderBottom: "1px solid #ccc",
                width: "100%",
                paddingBottom: "8px",
              }}
            >
              Size: {size}
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                width: "100%",
              }}
            >
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
            </div>
          </div>
        ))}
      </div>
    );
  },
  args: {
    // No specific args for the matrix itself, it generates all combinations
    // onChange spy is inherited from meta.args but we provide no-op for controlled inputs with values here
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
