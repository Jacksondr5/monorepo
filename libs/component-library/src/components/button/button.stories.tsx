import type { Meta, StoryObj } from "@storybook/react";
import {
  fn,
  userEvent,
  within,
  expect,
  screen,
  fireEvent,
} from "@storybook/test";
import { Button, buttonVariants } from "./button";
import { Mail, ChevronRight, Aperture, Trash2 } from "lucide-react"; // Added more icons
import React from "react";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: Object.keys(buttonVariants.variant),
    },
    size: {
      control: "select",
      options: Object.keys(buttonVariants.size),
    },
    asChild: {
      control: "boolean",
    },
    children: {
      control: "text",
    },
    onClick: { action: "clicked" },
    className: { control: false }, // Don't show className in controls by default for matrix
  },
  args: {
    onClick: fn(), // Default spy for all stories that don't override
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 1. Visual Matrix Story
export const AllVariants: Story = {
  parameters: {
    // Disabling controls for this story as it's a matrix display
    controls: { hideNoControlsWarning: true, sort: "requiredFirst" },
    // Increase Chromatic delay if needed for complex renders, though usually not necessary
    // chromatic: { delay: 300 },
  },
  render: (args) => {
    const variants = Object.keys(
      buttonVariants.variant,
    ) as (keyof typeof buttonVariants.variant)[];
    const sizes = Object.keys(buttonVariants.size).filter(
      (s) => s !== "icon",
    ) as (keyof typeof buttonVariants.size)[]; // exclude 'icon' for general matrix

    const iconMap = {
      default: <Mail />,
      destructive: <Trash2 />,
      outline: <ChevronRight />,
      secondary: <Aperture />,
      ghost: <Aperture />,
      link: <ChevronRight />,
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          alignItems: "flex-start",
          padding: "20px",
          width: "100%",
        }}
      >
        {variants.map((variant) => (
          <div
            key={variant}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            <h2
              style={{
                textTransform: "capitalize",
                margin: 0,
                borderBottom: "1px solid #ccc",
                width: "100%",
                paddingBottom: "8px",
              }}
            >
              {variant}
            </h2>
            {/* Sizes */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "16px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {sizes.map((size) => (
                <Button
                  key={`${variant}-${size}`}
                  {...args}
                  variant={variant}
                  size={size}
                >
                  {variant} {size}
                </Button>
              ))}
            </div>
            {/* With Leading Icon */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "16px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {sizes.map((size) => (
                <Button
                  key={`${variant}-${size}-leading`}
                  {...args}
                  variant={variant}
                  size={size}
                >
                  {React.cloneElement(iconMap[variant] || <Mail />, {
                    className: "size-4",
                  })}
                  <span>
                    {variant} {size}
                  </span>
                </Button>
              ))}
            </div>
            {/* With Trailing Icon */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "16px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {sizes.map((size) => (
                <Button
                  key={`${variant}-${size}-trailing`}
                  {...args}
                  variant={variant}
                  size={size}
                >
                  <span>
                    {variant} {size}
                  </span>
                  {React.cloneElement(iconMap[variant] || <ChevronRight />, {
                    className: "size-4",
                  })}
                </Button>
              ))}
            </div>
            {/* Icon Only Buttons */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "16px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                key={`${variant}-icon`}
                {...args}
                variant={variant}
                size="icon"
                aria-label={`${variant} icon button`}
              >
                {React.cloneElement(iconMap[variant] || <Aperture />, {
                  className: "size-5",
                })}
              </Button>
              <Button
                key={`${variant}-icon-sm`}
                {...args}
                variant={variant}
                size="sm"
                aria-label={`${variant} small icon button`}
              >
                {React.cloneElement(iconMap[variant] || <Aperture />, {
                  className: "size-4",
                })}
              </Button>
            </div>
            {/* Disabled States */}
            <h3
              style={{
                marginTop: "20px",
                marginBottom: "10px",
                fontSize: "1.1em",
              }}
            >
              Disabled:
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "16px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {sizes.map((size) => (
                <Button
                  key={`${variant}-${size}-disabled`}
                  {...args}
                  variant={variant}
                  size={size}
                  disabled
                >
                  {variant} {size}
                </Button>
              ))}
              <Button
                key={`${variant}-icon-disabled`}
                {...args}
                variant={variant}
                size="icon"
                disabled
                aria-label={`${variant} icon button disabled`}
              >
                {React.cloneElement(iconMap[variant] || <Aperture />, {
                  className: "size-5",
                })}
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  },
  args: {
    // No specific args for the matrix itself, it generates all combinations
    // onClick spy is inherited from meta.args
  },
};

// 2. Functional/Interaction Stories

export const PrimaryClickable: Story = {
  name: "Test: Primary Click & Keyboard",
  args: {
    variant: "default",
    size: "default",
    children: "Primary Action",
    // onClick is inherited from meta.args
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole<HTMLButtonElement>("button", {
      name: /Primary Action/i,
    });

    await step("Mouse click", async () => {
      await userEvent.click(button);
      await expect(args.onClick).toHaveBeenCalledTimes(1);
    });

    args.onClick.mockClear(); // Clear mock for next interaction

    await step("Keyboard (Enter)", async () => {
      fireEvent.focus(button);
      await expect(button).toHaveFocus();
      await userEvent.keyboard("{enter}");
      await expect(args.onClick).toHaveBeenCalledTimes(1);
    });

    args.onClick.mockClear();

    await step("Keyboard (Space)", async () => {
      fireEvent.focus(button);
      await expect(button).toHaveFocus();
      await userEvent.keyboard(" "); // Note: userEvent.type(button, '{space}') might also work
      await expect(args.onClick).toHaveBeenCalledTimes(1);
    });
  },
};

export const DestructiveInteraction: Story = {
  name: "Test: Destructive Click",
  args: {
    variant: "destructive",
    size: "default",
    children: "Delete Item",
    // onClick is inherited
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /Delete Item/i });

    await step("Click destructive button", async () => {
      await userEvent.click(button);
      await expect(args.onClick).toHaveBeenCalledTimes(1);
    });
  },
};

export const DisabledNoInteraction: Story = {
  name: "Test: Disabled Button No Interaction",
  args: {
    variant: "default",
    size: "default",
    children: "Cannot Click",
    disabled: true,
    // onClick is inherited
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /Cannot Click/i });

    await step("Attempt to click disabled button", async () => {
      // userEvent.click on a disabled button might not error but also won't trigger onClick
      // We can check if the onClick mock was called.
      // For more robust check, ensure button truly has disabled attribute if not visually obvious.
      await expect(button).toBeDisabled();

      // Clicking a disabled button should not call the onClick handler.
      // Note: userEvent.click might behave differently across versions/browsers for disabled elements.
      // The primary check is that the mock is not called.
      try {
        await userEvent.click(button, { pointerEventsCheck: 0 }); // Attempt click even if pointer events are none
      } catch (e) {
        // Expected in some setups if click on disabled is blocked early
      }
      await expect(args.onClick).not.toHaveBeenCalled();
    });
  },
};

export const AsChildLink: Story = {
  name: "Test: asChild with Link",
  args: {
    variant: "link",
    size: "default",
    asChild: true,
    children: (
      <a href="https://storybook.js.org" target="_blank">
        Visit Storybook
      </a>
    ),
    // onClick for the Button component itself might not be relevant if it's fully replaced by child's behavior
    // but we can still check if the rendered element is an anchor.
  },
  play: async ({ step }) => {
    // const canvas = within(canvasElement); // Removed unused variable

    await step("Verify rendered as anchor and has correct href", async () => {
      // With asChild, the button itself isn't rendered, but its child is.
      // We need to find the anchor tag.
      // Using screen.getByRole for wider scope if canvas isn't strictly containing.
      const linkElement = screen.getByRole("link", {
        name: /Visit Storybook/i,
      });
      await expect(linkElement).toBeInTheDocument();
      await expect(linkElement).toHaveAttribute(
        "href",
        "https://storybook.js.org",
      );

      // Check if it has button-like classes (optional, depends on styling strategy)
      // For example, if Slot passes down className
      // await expect(linkElement).toHaveClass(/text-blue-9/); // Example class from buttonVariants
    });

    // Note: Testing the actual navigation of asChild link might be out of scope for unit/component test
    // and more for E2E. Here we primarily test correct rendering and prop delegation.
  },
};
