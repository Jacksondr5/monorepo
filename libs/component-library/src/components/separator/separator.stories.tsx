import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "./separator";

const meta: Meta<typeof Separator> = {
  title: "Components/Separator",
  component: Separator,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
    },
    decorative: {
      control: "boolean",
    },
    className: { control: false }, // Don't show className in controls for matrix
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  parameters: {
    controls: { hideNoControlsWarning: true, sort: "requiredFirst" },
  },
  render: (args) => (
    <div className="text-slate-11 flex w-full flex-col items-start gap-10 p-5">
      <div>
        <h2 className="text-lg font-semibold">Horizontal Separator</h2>
        <p>This is some text above the separator.</p>
        <Separator {...args} orientation="horizontal" className="my-4" />
        <p>This is some text below the separator.</p>
      </div>

      <div className="h-32">
        <h2 className="text-lg font-semibold">Vertical Separator</h2>
        <div className="flex h-full items-center gap-4">
          <p>Text on the left.</p>
          <Separator {...args} orientation="vertical" />
          <p>Text on the right.</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">
          Horizontal (Custom Length via Parent)
        </h2>
        <div className="border-red-6 w-1/2 border">
          <p>This separator is constrained by its parent's width.</p>
          <Separator {...args} orientation="horizontal" className="my-4" />
        </div>
      </div>

      <div className="h-20">
        <h2 className="text-lg font-semibold">
          Vertical (Custom Height via Parent)
        </h2>
        <div className="border-red-6 flex h-full items-center gap-4 border">
          <p>Short left.</p>
          <Separator {...args} orientation="vertical" />
          <p>Short right.</p>
        </div>
      </div>
    </div>
  ),
  args: {
    decorative: true,
  },
};
