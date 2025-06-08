import { Meta, StoryObj } from "@storybook/react-vite";
import { promiseToast, toast } from "./sonner";
import { Toaster } from "sonner";
import { Button } from "../button/button";
import { ToastVariant } from "./toast";
import { expect, within, userEvent, waitFor, spyOn } from "storybook/test";

const meta: Meta<typeof Toaster> = {
  title: "Components/Toast/sonner",
  component: Toaster,
  decorators: [
    (Story) => (
      <div className="flex h-full min-h-screen w-full items-center justify-center">
        <Toaster />
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const Default: StoryObj = {
  name: "Trigger Default Toast",
  render: () => (
    <div className="bg-olive-1 flex flex-col items-start gap-4 rounded-lg p-6 shadow-md">
      <h2 className="text-olive-12 text-lg font-semibold">
        Trigger Default Toast
      </h2>
      <Button
        onClick={() =>
          toast({
            title: "Default Toast Triggered",
            description: "This is a default toast, triggered interactively.",
          })
        }
      >
        Show Default Toast
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const triggerButton = await canvas.findByRole("button", {
      name: /Show Default Toast/i,
    });
    await userEvent.click(triggerButton);

    // Toasts are rendered in a portal, so we search in the document body
    const toastContainer = within(document.body);
    const toastTitle = await toastContainer.findByText(
      "Default Toast Triggered",
    );
    const toastDescription = await toastContainer.findByText(
      "This is a default toast, triggered interactively.",
    );

    expect(toastTitle).toBeInTheDocument();
    expect(toastDescription).toBeInTheDocument();

    // Optional: wait for toast to auto-dismiss or add manual dismiss for cleanup if needed
    // For now, just verifying presence.
  },
};

export const InteractiveVariants: StoryObj = {
  name: "Trigger All Variants",
  parameters: {
    chromatic: {
      disable: true,
    },
  },
  render: () => {
    const variants: ToastVariant[] = [
      "default",
      "success",
      "error",
      "warning",
      "info",
      "loading",
    ];
    return (
      <div className="bg-olive-1 flex flex-col items-start gap-4 rounded-lg p-6 shadow-md">
        <h2 className="text-olive-12 text-lg font-semibold">
          Trigger Variant Toasts
        </h2>
        {variants.map((variant) => (
          <Button
            key={variant}
            onClick={() =>
              toast({
                title: `${variant.charAt(0).toUpperCase() + variant.slice(1)} Toast`,
                description: `This is an interactive ${variant} toast.`,
                variant: variant,
              })
            }
          >
            Show {variant.charAt(0).toUpperCase() + variant.slice(1)} Toast
          </Button>
        ))}
      </div>
    );
  },
};

export const WithAction: StoryObj = {
  name: "Trigger Toast With Action",
  render: () => (
    <div className="bg-olive-1 flex flex-col items-start gap-4 rounded-lg p-6 shadow-md">
      <h2 className="text-olive-12 text-lg font-semibold">Toast with Action</h2>
      <Button
        onClick={() =>
          toast({
            title: "Action Required",
            description:
              "Please confirm this action by clicking the button in the toast.",
            variant: "info",
            action: {
              label: "Confirm Action",
              onClick: () => alert("Toast Action Confirmed!"),
            },
          })
        }
      >
        Show Toast with Action
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Mock window.alert
    const alertMock = spyOn(window, "alert").mockImplementation(
      () => undefined,
    );

    const triggerButton = await canvas.findByRole("button", {
      name: /Show Toast with Action/i,
    });
    await userEvent.click(triggerButton);

    const toastContainer = within(document.body);
    const toastTitle = await toastContainer.findByText("Action Required");
    expect(toastTitle).toBeInTheDocument();

    const actionButtonInToast = await toastContainer.findByRole("button", {
      name: /Confirm Action/i,
    });
    expect(actionButtonInToast).toBeInTheDocument();
    await userEvent.click(actionButtonInToast);

    expect(alertMock).toHaveBeenCalledTimes(1);
    expect(alertMock).toHaveBeenCalledWith("Toast Action Confirmed!");

    // Check if the toast is dismissed
    await waitFor(() => {
      expect(
        toastContainer.queryByText("Action Required"),
      ).not.toBeInTheDocument();
    });

    // Clean up mock
    alertMock.mockRestore();
  },
};

export const PromiseToast: StoryObj = {
  render: () => {
    return (
      <div className="bg-olive-1 flex flex-col items-start gap-4 rounded-lg p-6 shadow-md">
        <h2 className="text-olive-12 text-lg font-semibold">
          Promise-based Toast
        </h2>
        <Button
          onClick={() => {
            // Show loading toast immediately and get its ID
            promiseToast(
              {
                pending: {
                  title: "Loading Data...",
                  description: "Please wait while we fetch your data.",
                },
                success: {
                  title: "Data Loaded Successfully!",
                  description: "Your requested data has been fetched.",
                },
                error: {
                  title: "Data Loading Failed!",
                  description: "We were unable to fetch your data.",
                },
              },
              new Promise((resolve) => setTimeout(resolve, 500)),
            );
          }}
        >
          Show Promise Toast
        </Button>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const triggerButton = await canvas.findByRole("button", {
      name: /Show Promise Toast/i,
    });
    await userEvent.click(triggerButton);

    // Toasts are rendered in a portal, so we search in the document body
    const toastContainer = within(document.body);

    // Check for initial loading toast
    const loadingTitle = await toastContainer.findByText("Loading Data...");
    const loadingDescription = await toastContainer.findByText(
      "Please wait while we fetch your data.",
      { selector: "p" },
    );
    expect(loadingTitle).toBeInTheDocument();
    expect(loadingDescription).toBeInTheDocument();

    // Wait for the toast to update to success (promise resolves after 2s)
    // findByText will retry until the element is found or timeout
    const successTitle = await toastContainer.findByText(
      "Data Loaded Successfully!",
      { selector: "p" },
    );
    const successDescription = await toastContainer.findByText(
      "Your requested data has been fetched.",
      { selector: "p" },
    );
    expect(successTitle).toBeInTheDocument();
    expect(successDescription).toBeInTheDocument();

    // Ensure loading text is gone
    expect(
      toastContainer.queryByText("Loading Data..."),
    ).not.toBeInTheDocument();
    expect(
      toastContainer.queryByText("Please wait while we fetch your data."),
    ).not.toBeInTheDocument();
  },
};
