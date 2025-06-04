import type { Meta, StoryObj } from "@storybook/react";
import { AvatarGroup, AvatarDataItem } from "./avatar-group";

const meta: Meta<typeof AvatarGroup> = {
  title: "Components/AvatarGroup",
  component: AvatarGroup,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["default", "stacked"],
    },
    avatars: {
      control: "object", // Allows editing in Storybook, though complex for arrays
      description:
        "Array of avatar data objects ({ src, alt, fallback, className? })",
    },
    max: {
      control: { type: "number", min: 1 },
      description:
        "Maximum number of avatars to display before showing an overflow indicator",
    },
    overflowIndicatorClassName: {
      control: "text",
      description: "Custom className for the overflow indicator avatar",
    },
  },
  args: {
    variant: "default",
    // `avatars` and `max` will be set per story
  },
};

export default meta;
type Story = StoryObj<typeof AvatarGroup>;

const sampleAvatarData: AvatarDataItem[] = [
  {
    src: "https://github.com/jacksondr5.png",
    alt: "Jacksondr5",
    fallback: "JR",
  },
  { src: "https://github.com/shadcn.png", alt: "Shadcn", fallback: "SC" },
  { src: "https://github.com/vercel.png", alt: "Vercel", fallback: "VC" },
  { fallback: "UD", alt: "User D" }, // Fallback only
  { fallback: "UF", alt: "User F", className: "border-4 border-green-500" }, // With custom class
];

export const AllVariants: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <h3 className="text-slate-11 mb-2 text-lg font-semibold">
          Default (All Avatars)
        </h3>
        <AvatarGroup {...args} variant="default" avatars={sampleAvatarData} />
      </div>

      <div>
        <h3 className="text-slate-11 mb-2 text-lg font-semibold">
          Stacked (All Avatars)
        </h3>
        <AvatarGroup {...args} variant="stacked" avatars={sampleAvatarData} />
      </div>

      <div>
        <h3 className="text-slate-11 mb-2 text-lg font-semibold">
          Stacked (Max 3)
        </h3>
        <AvatarGroup
          {...args}
          variant="stacked"
          avatars={sampleAvatarData}
          max={3}
        />
      </div>

      <div>
        <h3 className="text-slate-11 mb-2 text-lg font-semibold">
          Default (Max 3, 2 Avatars provided)
        </h3>
        <AvatarGroup
          {...args}
          variant="default"
          avatars={sampleAvatarData.slice(0, 2)}
          max={3}
        />
      </div>

      <div>
        <h3 className="text-slate-11 mb-2 text-lg font-semibold">
          Stacked (Max 1)
        </h3>
        <AvatarGroup
          {...args}
          variant="stacked"
          avatars={sampleAvatarData}
          max={1}
        />
      </div>

      <div>
        <h3 className="text-slate-11 mb-2 text-lg font-semibold">
          Stacked (Max 3) with Custom Overflow Class
        </h3>
        <AvatarGroup
          {...args}
          variant="stacked"
          avatars={sampleAvatarData}
          max={3}
          overflowIndicatorClassName="bg-red-500 text-white border-2 border-red-700"
        />
      </div>

      <div>
        <h3 className="text-slate-11 mb-2 text-lg font-semibold">
          Custom Group ClassName
        </h3>
        <AvatarGroup
          {...args}
          variant="stacked"
          avatars={sampleAvatarData.slice(0, 3)}
          max={3}
          className="rounded-md bg-blue-500 p-2"
        />
      </div>

      <div>
        <h3 className="text-slate-11 mb-2 text-lg font-semibold">No Avatars</h3>
        <AvatarGroup {...args} variant="default" avatars={[]} />
      </div>
    </div>
  ),
  args: {
    // Default args for the AllVariants story, individual groups can override
  },
};
