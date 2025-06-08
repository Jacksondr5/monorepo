"use client";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, userEvent, expect, within, waitFor, screen } from "storybook/test";
import React, { useState } from "react";
import { FieldDatePicker } from "./field-date-picker";
import { fieldContext } from "../form/form-contexts";

// Type for the value prop of fieldContext.Provider
type FieldContextValue = any; // Placeholder

interface MockFieldProviderProps {
  children: React.ReactNode;
  name?: string;
  value?: number | undefined;
  errors?: string[];
  handleChange?: (value: number | undefined) => void;
  handleBlur?: () => void;
}

const MockFieldProvider = ({
  children,
  name = "testField",
  value = undefined,
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

const meta: Meta<typeof FieldDatePicker> = {
  component: FieldDatePicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Components/DatePicker/Field",
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
      <MockFieldProvider name="normalDatePicker" value={undefined}>
        <FieldDatePicker {...args} label="Normal (Empty)" />
      </MockFieldProvider>

      <MockFieldProvider
        name="filledDatePicker"
        value={new Date("2024-01-15").getTime()}
      >
        <FieldDatePicker {...args} label="Filled" />
      </MockFieldProvider>

      <MockFieldProvider name="disabledDatePicker" value={undefined}>
        <FieldDatePicker {...args} label="Disabled" disabled />
      </MockFieldProvider>

      <MockFieldProvider
        name="errorDatePicker"
        value={undefined}
        errors={["This field is required."]}
      >
        <FieldDatePicker {...args} label="Error (Empty)" />
      </MockFieldProvider>

      <MockFieldProvider
        name="errorFilledDatePicker"
        value={new Date("2024-12-31").getTime()}
        errors={["This date is not valid."]}
      >
        <FieldDatePicker {...args} label="Error + Filled" />
      </MockFieldProvider>

      <MockFieldProvider
        name="longErrorDatePicker"
        value={new Date("2024-06-15").getTime()}
        errors={[
          "This is a very long error message to check how it wraps and displays within the allocated space for error messages under the date picker field.",
        ]}
      >
        <FieldDatePicker {...args} label="Long Error Message" />
      </MockFieldProvider>
    </div>
  ),
};

export const InteractionTest: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const datePickerTrigger = canvas.getByTestId(
      `normalDatePicker-date-picker-popover-trigger`,
    );
    await step("Ensure date picker is empty", async () => {
      expect(datePickerTrigger).toHaveTextContent("Pick a date");
      expect(
        canvas.queryByTestId(`normalDatePicker-error`),
      ).not.toBeInTheDocument();
      expect(datePickerTrigger).toHaveAttribute("aria-invalid", "false");
    });

    await step("Open date picker and select date", async () => {
      await userEvent.click(datePickerTrigger);

      // Wait for calendar to open
      await waitFor(() => {
        expect(
          screen.getByTestId("normalDatePicker-date-picker-popover-content"),
        ).toBeInTheDocument();
      });

      // Select today's date (assuming it's visible)
      const todayButton = screen.getByRole("gridcell", { name: "15" });
      await userEvent.click(todayButton);

      expect(
        canvas.queryByTestId(`normalDatePicker-error`),
      ).not.toBeInTheDocument();
    });

    await step("Trigger error by selecting invalid date", async () => {
      await userEvent.click(datePickerTrigger);

      // Select a date that will trigger an error (this is simulated)
      const errorDate = screen.getByRole("gridcell", { name: "30" });
      await userEvent.click(errorDate);

      await waitFor(() => {
        expect(
          canvas.getByTestId(`normalDatePicker-error`),
        ).toBeInTheDocument();
      });
      expect(datePickerTrigger).toHaveAttribute("aria-invalid", "true");
    });
  },

  render: () => {
    const [value, setValue] = useState<number | undefined>(undefined);
    const isInvalidDate = value && new Date(value).getDate() === 30;

    return (
      <MockFieldProvider
        name="normalDatePicker"
        value={value}
        handleChange={setValue}
        errors={isInvalidDate ? ["This date is not valid"] : []}
      >
        <FieldDatePicker label="Date Picker" />
      </MockFieldProvider>
    );
  },
};
