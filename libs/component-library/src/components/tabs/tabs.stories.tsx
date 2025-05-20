import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import { fn, userEvent, within, expect } from "@storybook/test";
import React from "react";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    defaultValue: {
      control: "text",
      description: "Default active tab value",
    },
    value: {
      control: "text",
      description: "Controlled active tab value",
    },
    onValueChange: {
      action: "tabChanged",
      description: "Called when the active tab changes",
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Orientation of the tabs",
    },
  },
  args: {
    onValueChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const AllVariants: Story = {
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
  render: (args) => (
    <div className="w-[500px] space-y-8">
      <div className="space-y-4">
        <h3 className="text-slate-11 text-lg font-medium">Default Tabs</h3>
        <Tabs {...args} defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <div className="mt-4">
            <TabsContent value="account">
              <p className="text-slate-11 text-sm">
                Make changes to your account here. Click save when you're done.
              </p>
            </TabsContent>
            <TabsContent value="password">
              <p className="text-slate-11 text-sm">
                Change your password here. After saving, you'll be logged out.
              </p>
            </TabsContent>
            <TabsContent value="notifications">
              <p className="text-slate-11 text-sm">
                Configure how you receive notifications.
              </p>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  ),
};

export const Default: Story = {
  args: {
    defaultValue: "account",
    children: (
      <>
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <div className="mt-4">
          <TabsContent value="account">
            <p className="text-slate-11 text-sm">
              Make changes to your account here. Click save when you're done.
            </p>
          </TabsContent>
          <TabsContent value="password">
            <p className="text-slate-11 text-sm">
              Change your password here. After saving, you'll be logged out.
            </p>
          </TabsContent>
          <TabsContent value="notifications">
            <p className="text-slate-11 text-sm">
              Configure how you receive notifications.
            </p>
          </TabsContent>
        </div>
      </>
    ),
  },
};

export const TestTabSwitching: Story = {
  name: "Test: Tab Switching",
  args: {
    defaultValue: "account",
    children: (
      <>
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <div className="mt-4">
          <TabsContent value="account">
            <p className="text-slate-11 text-sm">Account content</p>
          </TabsContent>
          <TabsContent value="password">
            <p className="text-slate-11 text-sm">Password content</p>
          </TabsContent>
          <TabsContent value="notifications">
            <p className="text-slate-11 text-sm">Notifications content</p>
          </TabsContent>
        </div>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify initial state
    const accountTab = canvas.getByRole("tab", { name: /account/i });
    expect(accountTab).toHaveAttribute("data-state", "active");

    // Click on password tab
    const passwordTab = canvas.getByRole("tab", { name: /password/i });
    await userEvent.click(passwordTab);

    // Verify tab switched
    expect(passwordTab).toHaveAttribute("data-state", "active");
    expect(accountTab).toHaveAttribute("data-state", "inactive");

    // Verify content is visible
    expect(canvas.getByText("Password content")).toBeInTheDocument();
  },
};

export const TestKeyboardNavigation: Story = {
  name: "Test: Keyboard Navigation",
  args: {
    defaultValue: "account",
    children: (
      <>
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <div className="mt-4">
          <TabsContent value="account">
            <p className="text-slate-11 text-sm">Account content</p>
          </TabsContent>
          <TabsContent value="password">
            <p className="text-slate-11 text-sm">Password content</p>
          </TabsContent>
          <TabsContent value="notifications">
            <p className="text-slate-11 text-sm">Notifications content</p>
          </TabsContent>
        </div>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Focus the first tab
    const accountTab = canvas.getByRole("tab", { name: /account/i });
    await userEvent.tab();
    // fireEvent.focus(accountTab);
    expect(accountTab).toHaveFocus();

    // Test right arrow key
    await userEvent.keyboard("{arrowright}");
    expect(canvas.getByRole("tab", { name: /password/i })).toHaveFocus();

    // Test enter key
    await userEvent.keyboard("{enter}");
    expect(canvas.getByRole("tab", { name: /password/i })).toHaveAttribute(
      "data-state",
      "active",
    );

    // Test home/end keys
    await userEvent.keyboard("{end}");
    expect(canvas.getByRole("tab", { name: /notifications/i })).toHaveFocus();

    await userEvent.keyboard("{home}");
    expect(accountTab).toHaveFocus();
  },
};
