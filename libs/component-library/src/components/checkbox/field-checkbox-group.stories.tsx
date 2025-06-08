"use client";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, userEvent, expect, within, waitFor } from "storybook/test";
import React, { useState } from "react";
import {
  FieldCheckboxGroup,
  type CheckboxGroupItem,
} from "./field-checkbox-group";
import { fieldContext } from "../form/form-contexts";

// Type for the value prop of fieldContext.Provider
type FieldContextValue = any; // Placeholder

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
        <FieldCheckboxGroup
          label="Normal (Empty)"
          items={checkboxItems}
          dataTestId="normalCheckboxGroup-checkbox"
        />
      </MockFieldProvider>

      <MockFieldProvider name="filledCheckboxGroup" value={["item1", "item3"]}>
        <FieldCheckboxGroup
          label="Filled (Multiple Selected)"
          items={checkboxItems}
          dataTestId="filledCheckboxGroup-checkbox"
        />
      </MockFieldProvider>

      <MockFieldProvider name="disabledCheckboxGroup" value={[]}>
        <FieldCheckboxGroup
          label="Disabled"
          items={checkboxItems}
          disabled
          dataTestId="disabledCheckboxGroup-checkbox"
        />
      </MockFieldProvider>

      <MockFieldProvider
        name="errorCheckboxGroup"
        value={[]}
        errors={["At least one option must be selected."]}
      >
        <FieldCheckboxGroup
          label="Error (Empty)"
          items={checkboxItems}
          dataTestId="errorCheckboxGroup-checkbox"
        />
      </MockFieldProvider>

      <MockFieldProvider
        name="errorFilledCheckboxGroup"
        value={["item2"]}
        errors={["This selection is not valid."]}
      >
        <FieldCheckboxGroup
          label="Error + Filled"
          items={checkboxItems}
          dataTestId="errorFilledCheckboxGroup-checkbox"
        />
      </MockFieldProvider>

      <MockFieldProvider
        name="longErrorCheckboxGroup"
        value={["item1"]}
        errors={[
          "This is a very long error message to check how it wraps and displays within the allocated space for error messages under the checkbox group field.",
        ]}
      >
        <FieldCheckboxGroup
          label="Long Error Message"
          items={checkboxItems}
          dataTestId="longErrorCheckboxGroup-checkbox"
        />
      </MockFieldProvider>

      <MockFieldProvider name="horizontalCheckboxGroup" value={["item2"]}>
        <FieldCheckboxGroup
          label="Horizontal Layout"
          items={checkboxItems}
          orientation="horizontal"
          dataTestId="horizontalCheckboxGroup-checkbox"
        />
      </MockFieldProvider>
    </div>
  ),
};

export const InteractionTest: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Ensure no checkboxes are selected initially", async () => {
      const checkbox1 = canvas.getByTestId(`normalCheckboxGroup-item1`);
      const checkbox2 = canvas.getByTestId(`normalCheckboxGroup-item2`);
      const checkbox3 = canvas.getByTestId(`normalCheckboxGroup-item3`);

      expect(checkbox1).not.toBeChecked();
      expect(checkbox2).not.toBeChecked();
      expect(checkbox3).not.toBeChecked();
      expect(
        canvas.queryByTestId(`normalCheckboxGroup-error`),
      ).not.toBeInTheDocument();
    });

    await step("Select multiple checkboxes", async () => {
      const checkbox1 = canvas.getByTestId(`normalCheckboxGroup-item1`);
      const checkbox3 = canvas.getByTestId(`normalCheckboxGroup-item3`);

      await userEvent.click(checkbox1);
      await userEvent.click(checkbox3);

      expect(checkbox1).toBeChecked();
      expect(checkbox3).toBeChecked();
      expect(
        canvas.queryByTestId(`normalCheckboxGroup-error`),
      ).not.toBeInTheDocument();
    });

    await step("Trigger error by selecting error option", async () => {
      const errorCheckbox = canvas.getByTestId(
        `normalCheckboxGroup-error-item`,
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
        <FieldCheckboxGroup
          label="Checkbox Group"
          items={testItems}
          dataTestId="normalCheckboxGroup-checkbox"
        />
      </MockFieldProvider>
    );
  },
};
