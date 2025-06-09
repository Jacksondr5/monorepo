"use client";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, userEvent, expect, within, waitFor } from "storybook/test";
import React, { useState } from "react";
import {
  FieldCheckboxGroup,
  type CheckboxGroupItem,
} from "./field-checkbox-group";
import { fieldContext } from "../form/form-contexts";

/**
 * Type for the field context value in stories.
 *
 * The actual type is FieldApi from @tanstack/react-form, but it requires 19 generic type arguments
 * which makes it impractical for story mocking. For stories, we only need to mock the specific
 * properties that our field components actually use:
 * - name: string
 * - state.meta.errors: string[]
 * - state.value: T
 * - handleChange: (value: T) => void
 * - handleBlur: () => void
 *
 * Using 'any' here is acceptable for story mocking purposes.
 */
type FieldContextValue = any;

interface MockFieldProviderProps {
  children: React.ReactNode;
  name?: string;
  value?: string[];
  errors?: string[];
  handleChange?: (value: string[]) => void;
  handleBlur?: () => void;
}

const MockFieldProvider = ({
  children,
  name = "testField",
  value = [],
  errors = [],
  handleChange = fn(),
  handleBlur = fn(),
}: MockFieldProviderProps) => {
  const contextValue: FieldContextValue = {
    name,
    state: {
      meta: {
        errors,
        isTouched: false,
        isValidating: false,
      },
      value: value,
    },
    handleBlur: handleBlur,
    handleChange: handleChange,
  };

  return (
    <fieldContext.Provider value={contextValue}>
      {children}
    </fieldContext.Provider>
  );
};

const checkboxItems: CheckboxGroupItem[] = [
  { id: "item1", label: "Option 1" },
  { id: "item2", label: "Option 2" },
  { id: "item3", label: "Option 3" },
];

const meta: Meta<typeof FieldCheckboxGroup> = {
  component: FieldCheckboxGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Components/Checkbox/FieldGroup",
  argTypes: {
    label: { control: "text" },
    orientation: { control: "select", options: ["vertical", "horizontal"] },
  },
  args: {
    label: "Example Label",
    items: checkboxItems,
    orientation: "vertical",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const AllFieldStates: Story = {
  args: {},
  render: (args: Story["args"]) => (
    <div className="max-w-md space-y-8">
      <MockFieldProvider name="normalCheckboxGroup" value={[]}>
        <FieldCheckboxGroup label="Normal (Empty)" items={checkboxItems} />
      </MockFieldProvider>

      <MockFieldProvider name="filledCheckboxGroup" value={["item1", "item3"]}>
        <FieldCheckboxGroup
          label="Filled (Multiple Selected)"
          items={checkboxItems}
        />
      </MockFieldProvider>

      <MockFieldProvider name="disabledCheckboxGroup" value={[]}>
        <FieldCheckboxGroup label="Disabled" items={checkboxItems} disabled />
      </MockFieldProvider>

      <MockFieldProvider
        name="errorCheckboxGroup"
        value={[]}
        errors={["At least one option must be selected."]}
      >
        <FieldCheckboxGroup label="Error (Empty)" items={checkboxItems} />
      </MockFieldProvider>

      <MockFieldProvider
        name="errorFilledCheckboxGroup"
        value={["item2"]}
        errors={["This selection is not valid."]}
      >
        <FieldCheckboxGroup label="Error + Filled" items={checkboxItems} />
      </MockFieldProvider>

      <MockFieldProvider
        name="longErrorCheckboxGroup"
        value={["item1"]}
        errors={[
          "This is a very long error message to check how it wraps and displays within the allocated space for error messages under the checkbox group field.",
        ]}
      >
        <FieldCheckboxGroup label="Long Error Message" items={checkboxItems} />
      </MockFieldProvider>

      <MockFieldProvider name="horizontalCheckboxGroup" value={["item2"]}>
        <FieldCheckboxGroup
          label="Horizontal Layout"
          items={checkboxItems}
          orientation="horizontal"
        />
      </MockFieldProvider>
    </div>
  ),
};

export const InteractionTest: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const checkbox1 = canvas.getByTestId(`normalCheckboxGroup-item1-checkbox`);
    const checkbox2 = canvas.getByTestId(`normalCheckboxGroup-item2-checkbox`);
    const checkbox3 = canvas.getByTestId(
      `normalCheckboxGroup-error-item-checkbox`,
    );
    await step("Ensure no checkboxes are selected initially", async () => {
      expect(checkbox1).not.toBeChecked();
      expect(checkbox2).not.toBeChecked();
      expect(checkbox3).not.toBeChecked();
      expect(
        canvas.queryByTestId(`normalCheckboxGroup-error`),
      ).not.toBeInTheDocument();
    });

    await step("Select multiple checkboxes", async () => {
      await userEvent.click(checkbox1);
      await userEvent.click(checkbox2);

      expect(checkbox1).toBeChecked();
      expect(checkbox2).toBeChecked();
      expect(
        canvas.queryByTestId(`normalCheckboxGroup-error`),
      ).not.toBeInTheDocument();
    });

    await step("Trigger error by selecting error option", async () => {
      const errorCheckbox = canvas.getByTestId(
        `normalCheckboxGroup-error-item-checkbox`,
      );
      await userEvent.click(errorCheckbox);

      await waitFor(() => {
        expect(
          canvas.getByTestId(`normalCheckboxGroup-error`),
        ).toBeInTheDocument();
      });
    });
  },
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    const testItems: CheckboxGroupItem[] = [
      { id: "item1", label: "Option 1" },
      { id: "item2", label: "Option 2" },
      { id: "error-item", label: "Error Option" },
    ];

    return (
      <MockFieldProvider
        name="normalCheckboxGroup"
        value={value}
        handleChange={setValue}
        errors={value.includes("error-item") ? ["This is an error"] : []}
      >
        <FieldCheckboxGroup label="Checkbox Group" items={testItems} />
      </MockFieldProvider>
    );
  },
};
