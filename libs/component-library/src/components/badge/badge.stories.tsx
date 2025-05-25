import type { Meta, StoryObj } from "@storybook/react";
import { Badge, BadgeProps, badgeVariants } from "./badge";
import {
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Sparkles,
  Tag as TagIcon,
} from "lucide-react";
import React from "react";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: Object.keys(badgeVariants.variant),
    },
    shape: {
      control: "select",
      options: Object.keys(badgeVariants.shape),
    },
    children: {
      control: "text",
    },
    asChild: {
      control: "boolean",
    },
    className: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to get an appropriate icon for a variant
const getIconForVariant = (variant: keyof typeof badgeVariants.variant) => {
  if (variant.includes("green")) return <CheckCircle />;
  if (variant.includes("red")) return <XCircle />;
  if (variant.includes("amber")) return <AlertTriangle />;
  if (variant.includes("blue")) return <Info />;
  if (variant.includes("grass")) return <Sparkles />;
  return <TagIcon />;
};

const shapes = Object.keys(
  badgeVariants.shape,
) as (keyof typeof badgeVariants.shape)[];

const VariantDisplay = ({
  variant,
  ...args
}: Omit<BadgeProps, "variant"> & {
  variant: keyof typeof badgeVariants.variant;
}) => {
  return (
    <>
      <h2 className="border-slate-6 m-0 w-full border-b pb-2 text-lg font-semibold capitalize">
        {variant.replace(/([A-Z])/g, " $1")}{" "}
        {/* Add space before capital letters for display */}
      </h2>
      <div className="flex flex-row flex-wrap items-center gap-4">
        {shapes.map((shape) => (
          <React.Fragment key={`${variant}-${shape}`}>
            <Badge {...args} variant={variant} shape={shape}>
              {shape} Badge
            </Badge>
            <Badge {...args} variant={variant} shape={shape}>
              {React.cloneElement(getIconForVariant(variant), {
                className: "size-3",
              })}
              <span>{shape} Icon</span>
            </Badge>
          </React.Fragment>
        ))}
      </div>
    </>
  );
};
export const AllVariants: Story = {
  parameters: {
    controls: { hideNoControlsWarning: true, sort: "requiredFirst" },
  },
  render: (args) => {
    const variants = Object.keys(badgeVariants.variant).filter(
      (variant) => !variant.includes("Outline"),
    ) as ("olive" | "slate" | "grass" | "green" | "red" | "amber" | "blue")[];

    return (
      <div className="text-slate-11 flex w-full flex-col items-start gap-10 p-5">
        {variants.map((variant) => (
          <div
            key={variant}
            className="grid w-full grid-cols-2 items-start gap-5"
          >
            <div className="col-span-1 flex flex-col gap-4">
              <VariantDisplay variant={variant} {...args} />
            </div>
            <div className="col-span-1 flex flex-col gap-4">
              <VariantDisplay variant={`${variant}Outline`} {...args} />
            </div>
          </div>
        ))}
      </div>
    );
  },
};
