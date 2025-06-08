"use client";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, userEvent, expect, within, waitFor } from "storybook/test";
import React, { useState } from "react";
import { FieldTextarea } from "./field-textarea";
import { fieldContext } from "../form/form-contexts";

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
      {children}fiel
    </fieldContext.Provider>
  );
};

const meta: Meta<typeof FieldTextarea> = {
  component: FieldTextarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Components/Textarea/Field",
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
      <MockFieldProvider name="normalTextarea" value="">
        <FieldTextarea
          {...args}
          label="Normal (Empty)"
          dataTestId="normalTextarea-textarea"
        />
      </MockFieldProvider>

      <MockFieldProvider
        name="filledTextarea"
        value="Some text here that spans multiple lines and shows how the textarea handles longer content."
      >
        <FieldTextarea
          {...args}
          label="Filled"
          dataTestId="filledTextarea-textarea"
        />
      </MockFieldProvider>

      <MockFieldProvider name="disabledTextarea" value="">
        <FieldTextarea
          {...args}
          label="Disabled"
          disabled
          dataTestId="disabledTextarea-textarea"
        />
      </MockFieldProvider>

      <MockFieldProvider
        name="errorTextarea"
        value=""
        errors={["This field is required."]}
      >
        <FieldTextarea
          {...args}
          label="Error (Empty)"
          dataTestId="errorTextarea-textarea"
        />
      </MockFieldProvider>

      <MockFieldProvider
        name="errorFilledTextarea"
        value="Incorrect value"
        errors={["This value is not valid."]}
      >
        <FieldTextarea
          {...args}
          label="Error + Filled"
          dataTestId="errorFilledTextarea-textarea"
        />
      </MockFieldProvider>

      <MockFieldProvider
        name="longErrorTextarea"
        value="Test"
        errors={[
          "This is a very long error message to check how it wraps and displays within the allocated space for error messages under the textarea field.",
        ]}
      >
        <FieldTextarea
          {...args}
          label="Long Error Message"
          dataTestId="longErrorTextarea-textarea"
        />
      </MockFieldProvider>
    </div>
  ),
};

export const InteractionTest: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Ensure textarea is empty", async () => {
      const textareaField = canvas.getByRole("textbox");
      expect(textareaField).toHaveValue("");
      expect(
        canvas.queryByTestId(`normalTextarea-error`),
      ).not.toBeInTheDocument();
      expect(textareaField).toHaveAttribute("aria-invalid", "false");
    });

    await step("Type into the textarea", async () => {
      const textareaField = canvas.getByRole("textbox");
      await userEvent.type(textareaField, "Hello\nWorld");
      expect(textareaField).toHaveValue("Hello\nWorld");
      expect(
        canvas.queryByTestId(`normalTextarea-error`),
      ).not.toBeInTheDocument();
      expect(textareaField).toHaveAttribute("aria-invalid", "false");
    });

    await step("Trigger error", async () => {
      const textareaField = canvas.getByRole("textbox");
      await userEvent.clear(textareaField);
      await userEvent.type(textareaField, "error");
      expect(textareaField).toHaveValue("error");
      await waitFor(() => {
        expect(canvas.getByTestId(`normalTextarea-error`)).toBeInTheDocument();
      });
      expect(textareaField).toHaveAttribute("aria-invalid", "true");
    });
  },

  render: () => {
    const [value, setValue] = useState("");
    return (
      <MockFieldProvider
        name="normalTextarea"
        value={value}
        handleChange={setValue}
        errors={value === "error" ? ["This is an error"] : []}
      >
        <FieldTextarea label="Text Area" dataTestId="normalTextarea-textarea" />
      </MockFieldProvider>
    );
  },
};
