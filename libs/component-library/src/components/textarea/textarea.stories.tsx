import type { Meta, StoryObj } from "@storybook/react";
import { fn, userEvent, within, expect } from "@storybook/test";
import { Textarea, textareaVariants } from "./textarea";

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: "text",
    },
    disabled: {
      control: "boolean",
    },
    rows: {
      control: { type: "number", min: 1, max: 20 },
    },
    onChange: { action: "changed" },
  },
  args: {
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Visual Matrix Story
export const AllVariants: Story = {
  parameters: {
    controls: { hideNoControlsWarning: true, sort: "requiredFirst" },
  },
  render: (args) => {
    const sizes = Object.keys(
      textareaVariants.size,
    ) as (keyof typeof textareaVariants.size)[];

    return (
      <div className="flex min-w-[400px] flex-col items-start gap-10 p-5">
        {sizes.map((size) => (
          <div key={size} className="flex w-full flex-col items-start gap-5">
            <h2 className="border-slate-6 text-slate-11 m-0 w-full border-b pb-2 capitalize">
              Size: {size}
            </h2>
            <div className="flex w-full flex-col gap-4">
              <Textarea
                {...args}
                size={size}
                placeholder={`Enter your text here... (${size})`}
              />
              <Textarea
                {...args}
                size={size}
                value={`This is some sample text in a ${size} textarea.`}
                onChange={args.onChange}
              />
              <Textarea
                {...args}
                size={size}
                disabled
                value="Disabled textarea"
              />
            </div>
          </div>
        ))}
      </div>
    );
  },
  args: {
    // No specific args for the matrix itself
  },
};

// Functional/Interaction Stories
export const ChangeValue: Story = {
  name: "Test: Change Value",
  args: {
    placeholder: "Initial value",
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByRole("textbox") as HTMLTextAreaElement;

    await step("Change value", async () => {
      const newValue = "Updated text content";
      // Clear the field first
      await userEvent.clear(textarea);

      // Type the new value
      await userEvent.type(textarea, newValue, { delay: 10 });

      // Verify the value was set
      await expect(textarea).toHaveValue(newValue);

      // Verify onChange was called
      await expect(args.onChange).toHaveBeenCalled();
    });
  },
};

export const DisabledNoInteraction: Story = {
  name: "Test: Disabled Textarea No Interaction",
  args: {
    disabled: true,
    placeholder: "This textarea is disabled and cannot be edited.",
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByRole("textbox");

    await step("Verify disabled state", async () => {
      await expect(textarea).toBeDisabled();
    });

    await step("Try to type in disabled textarea", async () => {
      const initialValue = textarea.textContent || "";
      await userEvent.type(textarea, "New text", { skipClick: true });
      await expect(textarea).toHaveValue(initialValue);
      await expect(args.onChange).not.toHaveBeenCalled();
    });
  },
};
