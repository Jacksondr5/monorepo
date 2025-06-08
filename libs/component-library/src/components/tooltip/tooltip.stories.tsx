import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within } from "storybook/test";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { Button } from "../button/button"; // Assuming Button component for trigger
import { Aperture } from "lucide-react"; // Icon for icon button trigger

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      // TooltipProvider is already part of the Tooltip component in this setup
      // but if it were separate, it would be good to wrap here.
      // Forcing a larger layout area for multiple tooltips
      <div
        style={{
          padding: "100px",
          display: "flex",
          gap: "50px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TooltipProvider>
          <Story />
        </TooltipProvider>
      </div>
    ),
  ],
  argTypes: {
    // Args for TooltipContent if we want to control them directly in Storybook
    // For AllVariants, we'll set them in the render function primarily.
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const TooltipWrapper = ({
  children,
  content,
  side,
  align,
  sideOffset = 4,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>{children}</TooltipTrigger>
    <TooltipContent side={side} align={align} sideOffset={sideOffset}>
      {content}
    </TooltipContent>
  </Tooltip>
);

export const AllVariants: Story = {
  parameters: {
    chromatic: { disable: true },
    controls: { hideNoControlsWarning: true },
  },
  render: () => (
    <div className="grid grid-cols-2 place-items-center gap-x-20 gap-y-28">
      <TooltipWrapper content="Tooltip on Top" side="top">
        <Button variant="outline" dataTestId="tooltip-trigger-button">
          Top
        </Button>
      </TooltipWrapper>
      <TooltipWrapper content="Tooltip on Bottom" side="bottom">
        <Button variant="outline" dataTestId="tooltip-trigger-button">
          Bottom
        </Button>
      </TooltipWrapper>
      <TooltipWrapper content="Tooltip on Left" side="left">
        <Button variant="outline" dataTestId="tooltip-trigger-button">
          Left
        </Button>
      </TooltipWrapper>
      <TooltipWrapper content="Tooltip on Right" side="right">
        <Button variant="outline" dataTestId="tooltip-trigger-button">
          Right
        </Button>
      </TooltipWrapper>

      <TooltipWrapper content="Icon Tooltip (Top)" side="top">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Camera"
          dataTestId="tooltip-trigger-button"
        >
          <Aperture className="size-5" />
        </Button>
      </TooltipWrapper>

      <TooltipWrapper
        content="Longer content to show wrapping and text balance."
        side="bottom"
      >
        <Button variant="secondary" dataTestId="tooltip-trigger-button">
          With Longer Text
        </Button>
      </TooltipWrapper>

      <TooltipWrapper content="Aligned Start" side="top" align="start">
        <Button variant="outline" dataTestId="tooltip-trigger-button">
          Top Align Start
        </Button>
      </TooltipWrapper>
      <TooltipWrapper content="Aligned End" side="top" align="end">
        <Button variant="outline" dataTestId="tooltip-trigger-button">
          Top Align End
        </Button>
      </TooltipWrapper>
    </div>
  ),
};

export const HoverAndFocusTest: Story = {
  name: "Interaction: Hover and Focus Trigger",
  render: () => (
    <TooltipWrapper content="Tooltip appears!" side="bottom">
      <Button
        variant="outline"
        data-testid="tooltip-trigger-button"
        dataTestId="tooltip-trigger-button"
      >
        Hover or Focus Me
      </Button>
    </TooltipWrapper>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const triggerButton = canvas.getByTestId("tooltip-trigger-button");

    await step("Hover to show tooltip", async () => {
      await userEvent.hover(triggerButton);
    });
  },
};
