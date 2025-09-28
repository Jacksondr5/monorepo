import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";

const meta: Meta = {
  title: "Bravos/Fake",
  component: () => (
    <div className="text-slate-12">Hello from Fake component</div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
