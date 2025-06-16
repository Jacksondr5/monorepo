import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, screen, expect } from "storybook/test";
import { AvatarGroup, AvatarDataItem } from "./avatar-group";
import { TooltipProvider } from "../tooltip/tooltip";

const meta: Meta<typeof AvatarGroup> = {
  title: "Components/AvatarGroup",
  component: AvatarGroup,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["default", "stacked"],
    },
    avatars: {
      control: "object", // Allows editing in Storybook, though complex for arrays
      description:
        "Array of avatar data objects ({ name, src, alt, fallback, className?, id })",
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
    dataTestId: {
      control: "text",
      description: "Test ID for the avatar group and prefix for child elements",
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
    name: "Jackson Miller",
    src: "https://github.com/jacksondr5.png",
    alt: "Jacksondr5",
    fallback: "JR",
    id: "jacksondr5",
  },
  {
    name: "Shadcn UI",
    src: "https://github.com/shadcn.png",
    alt: "Shadcn",
    fallback: "SC",
    id: "shadcn",
  },
  {
    name: "Vercel Team",
    src: "https://github.com/vercel.png",
    alt: "Vercel",
    fallback: "VC",
    id: "vercel",
  },
  {
    name: "User Delta",
    fallback: "UD",
    alt: "User D",
    id: "user-delta",
  }, // Fallback only
  {
    name: "User Foxtrot",
    fallback: "UF",
    alt: "User F",
    className: "border-4 border-green-7",
    id: "user-foxtrot",
  }, // With custom class
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
          overflowIndicatorClassName="bg-red-9 text-red-1 border-2 border-red-7"
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
          className="bg-blue-9 rounded-md p-2"
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

export const TooltipInteractionTest: Story = {
  name: "Interaction: Avatar Tooltip on Hover",
  render: () => (
    <div className="p-8">
      <AvatarGroup
        variant="default"
        avatars={sampleAvatarData.slice(0, 3)}
        dataTestId="avatar-group-tooltip-test"
      />
      <h3 className="text-slate-11 mt-4 text-lg font-semibold">
        Hover over avatars to see names
      </h3>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Hover over first avatar to show tooltip", async () => {
      const firstAvatar = canvas.getByTestId(
        "avatar-group-tooltip-test-avatar-jacksondr5",
      );
      await userEvent.hover(firstAvatar);

      // Wait for tooltip to appear and verify content
      const tooltip = await screen.findByTestId(
        "avatar-group-tooltip-test-avatar-jacksondr5-tooltip",
      );
      expect(tooltip).toHaveTextContent("Jackson Miller");
    });

    await step(
      "Hover over second avatar to show different tooltip",
      async () => {
        const secondAvatar = canvas.getByTestId(
          "avatar-group-tooltip-test-avatar-shadcn",
        );
        await userEvent.hover(secondAvatar);

        // Wait for tooltip to appear and verify content
        const tooltip = await screen.findByTestId(
          "avatar-group-tooltip-test-avatar-shadcn-tooltip",
        );
        expect(tooltip).toHaveTextContent("Shadcn UI");
      },
    );
  },
};

export const OverflowTooltipTest: Story = {
  name: "Interaction: Overflow Tooltip",
  render: () => (
    <div className="p-8">
      <AvatarGroup
        variant="stacked"
        avatars={sampleAvatarData}
        max={3}
        dataTestId="avatar-group-overflow-test"
      />
      <h3 className="text-slate-11 mt-4 text-lg font-semibold">
        Hover over overflow indicator
      </h3>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Hover over overflow indicator to show count", async () => {
      const overflowAvatar = canvas.getByTestId(
        "avatar-group-overflow-test-overflow-avatar",
      );
      await userEvent.hover(overflowAvatar);

      // Wait for tooltip to appear and verify content
      const tooltip = await screen.findByTestId(
        "avatar-group-overflow-test-overflow-avatar-tooltip",
      );
      expect(tooltip).toHaveTextContent("3 more users");
    });
  },
};
