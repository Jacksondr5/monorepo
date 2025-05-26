import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Components/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    className: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
  render: (args) => (
    <div className="text-slate-11 flex w-full max-w-md flex-col items-start gap-8 p-5">
      <div>
        <h2 className="mb-3 text-lg font-semibold">Card Example</h2>
        <div className="flex items-center space-x-4">
          <Skeleton {...args} className="size-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton {...args} className="h-4 w-[250px]" />
            <Skeleton {...args} className="h-4 w-[200px]" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">
          Single Line (Text Placeholder)
        </h2>
        <Skeleton {...args} className="h-4 w-full" />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Paragraph Placeholder</h2>
        <div className="space-y-2">
          <Skeleton {...args} className="h-4 w-full" />
          <Skeleton {...args} className="h-4 w-full" />
          <Skeleton {...args} className="h-4 w-5/6" />
          <Skeleton {...args} className="h-4 w-3/4" />
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">
          Circle (Avatar Placeholder)
        </h2>
        <Skeleton {...args} className="size-16 rounded-full" />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">
          Rectangle (Image/Media Placeholder)
        </h2>
        <Skeleton {...args} className="h-32 w-full rounded-lg" />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">List Item Example</h2>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton {...args} className="size-8 rounded-md" />
              <Skeleton {...args} className="h-5 flex-grow" />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
