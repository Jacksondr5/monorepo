import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, userEvent, within, expect, waitFor } from "storybook/test";

import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Label } from "../label/label"; // Import the styled Label

const meta: Meta<typeof RadioGroup> = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    // Define argTypes for RadioGroup props if needed
    defaultValue: { control: "text" },
    disabled: { control: "boolean" },
    onValueChange: { action: "value changed" },
  },
  // Example args for the group itself
  args: {
    onValueChange: fn(),
    className: "w-full max-w-xs", // Example width constraint
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Story demonstrating various RadioGroup states
export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-8">
      {/* Default */}
      <div>
        <h3 className="text-slate-10 mb-2 text-sm font-medium">Default</h3>
        <RadioGroup
          defaultValue="option-one"
          {...args}
          name="variants-default"
          dataTestId="radiogroup-variants-default"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-one" id="v-opt-1" />
            <Label
              htmlFor="v-opt-1"
              dataTestId="radiogroup-variants-default-label-option-one"
            >
              Option One
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-two" id="v-opt-2" />
            <Label
              htmlFor="v-opt-2"
              dataTestId="radiogroup-variants-default-label-option-two"
            >
              Option Two
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-three" id="v-opt-3" />
            <Label
              htmlFor="v-opt-3"
              dataTestId="radiogroup-variants-default-label-option-three"
            >
              Option Three
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Item Disabled */}
      <div>
        <h3 className="text-slate-10 mb-2 text-sm font-medium">
          Item Disabled (Option Two)
        </h3>
        <RadioGroup
          defaultValue="option-one"
          {...args}
          name="variants-item-disabled"
          dataTestId="radiogroup-variants-item-disabled"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-one" id="v-id-opt-1" />
            <Label
              htmlFor="v-id-opt-1"
              dataTestId="radiogroup-variants-item-disabled-label-option-one"
            >
              Option One
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-two" id="v-id-opt-2" disabled />
            <Label
              htmlFor="v-id-opt-2"
              dataTestId="radiogroup-variants-item-disabled-label-option-two"
            >
              Option Two (Disabled)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-three" id="v-id-opt-3" />
            <Label
              htmlFor="v-id-opt-3"
              dataTestId="radiogroup-variants-item-disabled-label-option-three"
            >
              Option Three
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  ),
  args: {
    // Args here apply to all radio groups within the story unless overridden
    className: "gap-3", // Override width constraint for grid layout
  },
};

// Interaction Test Story
export const InteractionTest: Story = {
  name: "Test: User Interaction",
  render: (args) => {
    const groupDataTestId =
      args.dataTestId || "radiogroup-interaction-fallback"; // Fallback if not in args
    return (
      <RadioGroup
        {...args}
        dataTestId={groupDataTestId}
        name="interaction-test"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-one" id="t-opt-1" />
          <Label
            htmlFor="t-opt-1"
            dataTestId={`${groupDataTestId}-label-option-one`}
          >
            Option One
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-two" id="t-opt-2" />
          <Label
            htmlFor="t-opt-2"
            dataTestId={`${groupDataTestId}-label-option-two`}
          >
            Option Two
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-three" id="t-opt-3" />
          <Label
            htmlFor="t-opt-3"
            dataTestId={`${groupDataTestId}-label-option-three`}
          >
            Option Three
          </Label>
        </div>
      </RadioGroup>
    );
  },
  args: {
    // Ensure the spy function is passed for this story specifically if not in meta.args
    onValueChange: fn(),
    dataTestId: "radiogroup-interaction",
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const optionOneLabel = canvas.getByText("Option One");
    const optionOneRadio = canvas.getByLabelText("Option One");
    const optionTwoRadio = canvas.getByLabelText("Option Two");

    await step("Initial state: None selected", async () => {
      expect(optionOneRadio).not.toBeChecked();
      expect(optionTwoRadio).not.toBeChecked();
    });

    await step("Click Option One label", async () => {
      await userEvent.click(optionOneLabel);
      expect(optionOneRadio).toBeChecked();
      expect(optionTwoRadio).not.toBeChecked();
      expect(args.onValueChange).toHaveBeenCalledTimes(1);
      expect(args.onValueChange).toHaveBeenLastCalledWith("option-one");
    });

    await step("Click Option Two radio button directly", async () => {
      await userEvent.click(optionTwoRadio);
      expect(optionOneRadio).not.toBeChecked();
      expect(optionTwoRadio).toBeChecked();
      expect(args.onValueChange).toHaveBeenCalledTimes(2);
      expect(args.onValueChange).toHaveBeenLastCalledWith("option-two");
    });
  },
};

// Keyboard Interaction Test Story
export const KeyboardInteractionTest: Story = {
  name: "Test: Keyboard Interaction",
  render: InteractionTest.render, // Reuse the same render setup
  args: {
    // Ensure the spy function is passed for this story specifically
    onValueChange: fn(),
    dataTestId: "radiogroup-keyboard",
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    // Give delay for the component to render
    await new Promise((resolve) => setTimeout(resolve, 50));

    const optionOneRadio = canvas.getByLabelText("Option One");
    const optionTwoRadio = canvas.getByLabelText("Option Two");
    const optionThreeRadio = canvas.getByLabelText("Option Three");

    await step("Initial state: None selected", async () => {
      expect(optionOneRadio).not.toBeChecked();
      expect(optionTwoRadio).not.toBeChecked();
      expect(optionThreeRadio).not.toBeChecked();
    });

    await step("Keyboard: Focus first radio", async () => {
      await userEvent.tab();
      // Wait for the focus to settle on the first radio button
      await waitFor(() => {
        // Re-query inside waitFor to potentially get correctly typed element
        const focusedRadio = within(canvasElement).getByLabelText("Option One");
        expect(focusedRadio).toHaveFocus();
      });
    });

    await step("Keyboard: ArrowDown to focus Option Two", async () => {
      await userEvent.keyboard("{ArrowDown}");
      expect(optionTwoRadio).toHaveFocus(); // Focus moves with selection
    });

    await step("Keyboard: Space to select Option Two", async () => {
      await userEvent.keyboard("{ }"); // Space
      expect(optionTwoRadio).toBeChecked();
      expect(args.onValueChange).toHaveBeenCalledTimes(1);
      expect(args.onValueChange).toHaveBeenLastCalledWith("option-two");
    });
  },
};
