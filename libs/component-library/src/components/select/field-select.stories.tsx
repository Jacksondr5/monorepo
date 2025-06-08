"use client";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, userEvent, expect, within, waitFor, screen } from "storybook/test";
import React, { useState } from "react";
import { FieldSelect } from "./field-select";
import { fieldContext } from "../form/form-contexts";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

// Type for the value prop of fieldContext.Provider
type FieldContextValue = any; // Placeholder

interface MockFieldProviderProps {
  children: React.ReactNode;
  name?: string;
  value?: string;
  errors?: string[];
  handleChange?: (value: string) => void;
  handleBlur?: () => void;
}

const MockFieldProvider = ({
  children,
  name = "testField",
  value = "",
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

const meta: Meta<typeof FieldSelect> = {
  component: FieldSelect,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Components/Select/Field",
  argTypes: {
    label: { control: "text" },
  },
  args: {
    label: "Example Label",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const SelectOptions = () => (
  <>
    <SelectTrigger>
      <SelectValue placeholder="Select an option..." />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="option1">Option 1</SelectItem>
      <SelectItem value="option2">Option 2</SelectItem>
      <SelectItem value="option3">Option 3</SelectItem>
    </SelectContent>
  </>
);

export const AllFieldStates: Story = {
  args: {},
  render: (args: Story["args"]) => (
    <div className="max-w-md space-y-8">
      <MockFieldProvider name="normalSelect" value="">
        <FieldSelect {...args} label="Normal (Empty)">
          <SelectOptions />
        </FieldSelect>
      </MockFieldProvider>

      <MockFieldProvider name="filledSelect" value="option2">
        <FieldSelect {...args} label="Filled">
          <SelectOptions />
        </FieldSelect>
      </MockFieldProvider>

      <MockFieldProvider name="disabledSelect" value="">
        <FieldSelect {...args} label="Disabled" disabled>
          <SelectOptions />
        </FieldSelect>
      </MockFieldProvider>

      <MockFieldProvider
        name="errorSelect"
        value=""
        errors={["This field is required."]}
      >
        <FieldSelect {...args} label="Error (Empty)">
          <SelectOptions />
        </FieldSelect>
      </MockFieldProvider>

      <MockFieldProvider
        name="errorFilledSelect"
        value="option1"
        errors={["This value is not valid."]}
      >
        <FieldSelect {...args} label="Error + Filled">
          <SelectOptions />
        </FieldSelect>
      </MockFieldProvider>

      <MockFieldProvider
        name="longErrorSelect"
        value="option3"
        errors={[
          "This is a very long error message to check how it wraps and displays within the allocated space for error messages under the select field.",
        ]}
      >
        <FieldSelect {...args} label="Long Error Message">
          <SelectOptions />
        </FieldSelect>
      </MockFieldProvider>
    </div>
  ),
};

export const InteractionTest: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const selectTrigger = canvas.getByTestId(`normalSelect-select-trigger`);

    await step("Ensure select is empty", async () => {
      expect(selectTrigger).toHaveAttribute("aria-expanded", "false");
      expect(
        canvas.queryByTestId(`normalSelect-error`),
      ).not.toBeInTheDocument();
      expect(selectTrigger).toHaveAttribute("aria-invalid", "false");

      // Check that the placeholder is shown
      const selectValue = canvas.getByTestId(`normalSelect-select-value`);
      expect(selectValue).toHaveTextContent("Select an option...");
    });

    await step("Open select and choose option", async () => {
      await userEvent.click(selectTrigger);
      expect(selectTrigger).toHaveAttribute("aria-expanded", "true");

      // Wait for select content to appear and use test ID to find option
      await waitFor(() => {
        expect(
          screen.getByTestId(`normalSelect-select-content`),
        ).toBeInTheDocument();
      });

      const option2 = screen.getByTestId(`normalSelect-select-item-option2`);
      await userEvent.click(option2);

      expect(selectTrigger).toHaveAttribute("aria-expanded", "false");
      expect(
        canvas.queryByTestId(`normalSelect-error`),
      ).not.toBeInTheDocument();

      // Verify the selected value is displayed
      const selectValue = canvas.getByTestId(`normalSelect-select-value`);
      expect(selectValue).toHaveTextContent("Option 2");
    });

    await step("Trigger error by selecting error option", async () => {
      await userEvent.click(selectTrigger);

      // Wait for select content to appear
      await waitFor(() => {
        expect(
          screen.getByTestId(`normalSelect-select-content`),
        ).toBeInTheDocument();
      });

      const errorOption = screen.getByTestId(`normalSelect-select-item-error`);
      await userEvent.click(errorOption);

      await waitFor(() => {
        expect(canvas.getByTestId(`normalSelect-error`)).toBeInTheDocument();
      });
      expect(selectTrigger).toHaveAttribute("aria-invalid", "true");

      // Verify the error value is displayed
      const selectValue = canvas.getByTestId(`normalSelect-select-value`);
      expect(selectValue).toHaveTextContent("Error Option");
    });
  },

  render: () => {
    const [value, setValue] = useState("");
    return (
      <MockFieldProvider
        name="normalSelect"
        value={value}
        handleChange={setValue}
        errors={value === "error" ? ["This is an error"] : []}
      >
        <FieldSelect label="Select Field">
          <SelectTrigger>
            <SelectValue placeholder="Select an option..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
            <SelectItem value="error">Error Option</SelectItem>
          </SelectContent>
        </FieldSelect>
      </MockFieldProvider>
    );
  },
};
