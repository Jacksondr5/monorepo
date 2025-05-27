import type { Meta, StoryObj } from "@storybook/react";
import { Toast, ToastProps, ToastVariant } from "./toast";
import { Bell } from "lucide-react";
import React from "react";

const meta: Meta<typeof Toast> = {
  title: "Components/Toast",
  component: Toast,
  decorators: [
    (Story) => (
      <div className="flex max-w-2xl flex-col space-y-4 p-4">
        <Story />
      </div>
    ),
  ],
  parameters: {},
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    variant: {
      control: { type: "select" },
      options: [
        "default",
        "success",
        "error",
        "warning",
        "info",
        "loading",
      ] as ToastVariant[],
    },
    icon: { control: false },
    action: { control: false },
    id: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<ToastProps>;

const AllVariantsTemplate = () => {
  const variants: ToastVariant[] = [
    "default",
    "success",
    "error",
    "warning",
    "info",
    "loading",
  ];
  const commonPropsBase = {
    description: "This is the description for the toast, rendered statically.",
    action: {
      label: "Action",
      onClick: () =>
        alert("Static toast action clicked! Dismissal not handled here."),
    },
  };

  return (
    <div className="grid w-[60rem] grid-cols-2 items-start gap-4 space-y-8">
      {variants.map((variant, index) => (
        <div key={variant} className="w-full">
          <h3 className="text-slate-12 mb-2 text-lg font-semibold capitalize">
            {variant} Toast
          </h3>
          <div className="flex flex-col space-y-4">
            <Toast
              id={`toast-${variant}-titleonly-${index}`}
              title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Toast Title Only`}
              variant={variant}
            />
            <Toast
              id={`toast-${variant}-withdesc-${index}`}
              title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Toast with Description`}
              description={commonPropsBase.description}
              variant={variant}
            />
            <Toast
              id={`toast-${variant}-withaction-${index}`}
              title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Toast with Action`}
              description={commonPropsBase.description}
              variant={variant}
              action={commonPropsBase.action}
            />
          </div>
        </div>
      ))}
      <div className="mt-6 w-full">
        <h3 className="text-slate-12 mb-2 text-lg font-semibold">
          Toast with Custom Icon (Static)
        </h3>
        <Toast
          id="toast-custom-icon-static"
          title="Custom Icon Toast (Static)"
          description="This toast uses a custom icon passed as a prop, rendered statically."
          variant="default"
          icon={<Bell className="text-purple-7 h-5 w-5" />}
          action={{
            label: "Custom Action",
            onClick: () => alert("Custom icon toast action!"),
          }}
        />
      </div>
    </div>
  );
};

export const AllVariants: Story = {
  render: () => <AllVariantsTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Displays all toast variants statically for visual comparison. Action button clicks will trigger alerts, as sonner.dismiss is not used here.",
      },
    },
  },
};
