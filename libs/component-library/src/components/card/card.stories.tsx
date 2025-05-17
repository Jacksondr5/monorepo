import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { within, userEvent, expect, fn } from "@storybook/test"; // Core testing utilities
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction,
} from "./card";
// Assuming a simple Button component exists for the action example
import { Button } from "../button/button";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const AllVariants: Story = {
  render: (args) => (
    <div
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      style={{ width: "1000px" }}
    >
      {/* Card 1: Basic Content */}
      <Card {...args}>
        <CardContent>
          <p>This is a basic card with only content inside the CardContent.</p>
        </CardContent>
      </Card>

      {/* Card 2: Header and Content */}
      <Card {...args}>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            This card has a header with a title and description, along with
            content.
          </p>
        </CardContent>
      </Card>

      {/* Card 3: Header, Content, and Footer */}
      <Card {...args}>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card includes a header, content, and a footer.</p>
        </CardContent>
        <CardFooter>
          <p>Footer content</p>
          {/* <Button variant="outline" size="sm">Footer Button</Button> */}
        </CardFooter>
      </Card>

      {/* Card 4: Header with Action */}
      <Card {...args}>
        <CardHeader>
          <CardTitle>Card With Action</CardTitle>
          <CardDescription>
            Description for card with an action.
          </CardDescription>
          <CardAction>
            {/* Placeholder for an action, e.g., a Button or Menu */}
            <Button variant="outline" size="sm">
              Action
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p>This card demonstrates the action slot within the header.</p>
        </CardContent>
      </Card>

      {/* Card 5: More Content */}
      <Card {...args}>
        <CardHeader>
          <CardTitle>Longer Content Example</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            This card contains a bit more text to demonstrate how the card
            handles potentially larger amounts of content within the CardContent
            area. The layout should adjust gracefully.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </CardContent>
        <CardFooter>
          <p>Another Footer</p>
        </CardFooter>
      </Card>
    </div>
  ),
};

// Story for testing interaction with the action button
export const ActionInteractionTest: Story = {
  args: {
    // Define a mock function for the button's onClick
    onClick: fn(),
  },
  render: (args) => (
    <Card style={{ width: "350px" }}>
      {" "}
      {/* Render only the card with action */}
      <CardHeader>
        <CardTitle>Card With Action</CardTitle>
        <CardDescription>Click the action button.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm" onClick={args.onClick}>
            Action
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>This card tests the action slot button click.</p>
      </CardContent>
    </Card>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);

    await step("Find Action Button", async () => {
      const actionButton = await canvas.getByRole("button", {
        name: /Action/i,
      });
      expect(actionButton).toBeInTheDocument();
    });

    await step("Click Action Button", async () => {
      const actionButton = await canvas.getByRole("button", {
        name: /Action/i,
      }); // Re-find inside step
      await userEvent.click(actionButton);
    });

    await step("Verify onClick was called", async () => {
      expect(args.onClick).toHaveBeenCalledTimes(1);
    });
  },
};
