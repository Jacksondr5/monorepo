import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: false, // Avatar children are specific (Image, Fallback)
    },
    className: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
  render: () => (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
      <div className="flex flex-col items-center gap-2">
        <span className="text-slate-11 text-sm">Image</span>
        <Avatar>
          <AvatarImage
            src="https://github.com/jacksondr5.png"
            alt="@jacksondr5"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-slate-11 text-sm">Fallback</span>
        <Avatar>
          <AvatarFallback>J5</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-slate-11 text-sm">No Image Src</span>
        <Avatar className="h-10 w-10">
          <AvatarImage src="" alt="@broken" />
          <AvatarFallback>J5</AvatarFallback>
        </Avatar>
      </div>
    </div>
  ),
};
