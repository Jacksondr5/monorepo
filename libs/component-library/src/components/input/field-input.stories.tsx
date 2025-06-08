"use client";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, userEvent, expect, within, waitFor } from "storybook/test";
import React, { useState } from "react";
import { FieldInput } from "./field-input";
import { fieldContext } from "../form/form-contexts"; // Corrected import name

// TODO: Refine FieldContextType if a specific type can be imported or derived from @tanstack/react-form
// For now, using 'any' for the context value in MockFieldProvider.
// Type for the value prop of fieldContext.Provider
type FieldContextValue = any; // Placeholder

// Helper to provide mock FieldContext
interface MockFieldProviderProps {
  children: React.ReactNode;
  name?: string;
  value?: string;
  errors?: string[];
  handleChange?: (value: string) => void; // Added for interaction test assertions
  handleBlur?: () => void; // Added for interaction test assertions
}

const MockFieldProvider = ({
  children,
  name = "testField",
  value = "",
  errors = [],
  handleChange = fn(), // Default to a new spy if not provided
  handleBlur = fn(), // Default to a new spy if not provided
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
    handleBlur: handleBlur, // Use provided or default spy
    handleChange: handleChange, // Use provided or default spy,
    // Add other necessary FieldContext properties if any, with default/mock values
  };

  return (
    <fieldContext.Provider value={contextValue}>
      {children}
    </fieldContext.Provider>
  );
};

const meta: Meta<typeof FieldInput> = {
  component: FieldInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Components/Input/Field",
  argTypes: {
    label: { control: "text" },
  },
  args: {
    label: "Example Label",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const AllFieldStates: Story = {
  args: {},
  render: (args: Story["args"]) => (
    <div className="max-w-md space-y-8">
      <MockFieldProvider name="normalInput" value="">
        <FieldInput {...args} label="Normal (Empty)" id="normalInput" />
      </MockFieldProvider>

      <MockFieldProvider name="filledInput" value="Some text here">
        <FieldInput {...args} label="Filled" id="filledInput" />
      </MockFieldProvider>

      <MockFieldProvider name="disabledInput" value="">
        <FieldInput {...args} label="Disabled" id="disabledInput" disabled />
      </MockFieldProvider>

      <MockFieldProvider
        name="errorInput"
        value=""
        errors={["This field is required."]}
      >
        <FieldInput {...args} label="Error (Empty)" id="errorInput" />
      </MockFieldProvider>

      <MockFieldProvider
        name="errorFilledInput"
        value="Incorrect value"
        errors={["This value is not valid."]}
      >
        <FieldInput {...args} label="Error + Filled" id="errorFilledInput" />
      </MockFieldProvider>

      <MockFieldProvider
        name="longErrorInput"
        value="Test"
        errors={[
          "This is a very long error message to check how it wraps and displays within the allocated space for error messages under the input field.",
        ]}
      >
        <FieldInput {...args} label="Long Error Message" id="longErrorInput" />
      </MockFieldProvider>
    </div>
  ),
};

export const InteractionTest: Story = {
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step("Ensure input is empty", async () => {
      const inputField = canvas.getByTestId(`normalInput-input`);
      expect(inputField).toHaveValue("");
      expect(canvas.queryByTestId(`normalInput-error`)).not.toBeInTheDocument();
      expect(inputField).toHaveAttribute("aria-invalid", "false");
    });

    await step("Type into the input", async () => {
      const inputField = canvas.getByTestId(`normalInput-input`);
      await userEvent.type(inputField, "Hello");
      expect(inputField).toHaveValue("Hello");
      expect(canvas.queryByTestId(`normalInput-error`)).not.toBeInTheDocument();
      expect(inputField).toHaveAttribute("aria-invalid", "false");
    });

    await step("Trigger error", async () => {
      const inputField = canvas.getByTestId(`normalInput-input`);
      await userEvent.clear(inputField);
      await userEvent.type(inputField, "error");
      expect(inputField).toHaveValue("error");
      await waitFor(() => {
        expect(canvas.getByTestId(`normalInput-error`)).toBeInTheDocument();
      });
      expect(inputField).toHaveAttribute("aria-invalid", "true");
    });
  },

  render: () => {
    const [value, setValue] = useState("");
    return (
      <MockFieldProvider
        name="normalInput"
        value={value}
        handleChange={setValue}
        errors={value === "error" ? ["This is an error"] : []}
      >
        <FieldInput label="Text Input" id="normalInput" />
      </MockFieldProvider>
    );
  },
};
