import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within, fn, mocked } from "storybook/test";
import { Button } from "@j5/component-library";
import React from "react";

// This demonstrates how to use mocks in stories
// Import the mock directly instead of the real PostHog
import { MockPostHogProvider, usePostHog } from "./posthog.mock";
import { usePostHog as realPostHog } from "#lib/posthog";

// Example component that uses PostHog
function PostHogExampleComponent() {
  // const postHog = postHogMock;
  const postHog = realPostHog();

  const handleButtonClick = () => {
    postHog.capture("example_button_clicked", {
      component: "PostHogExampleComponent",
      timestamp: Date.now(),
    });
  };

  const handleFeatureFlagCheck = () => {
    const isEnabled = postHog.isFeatureEnabled("example-feature");
    postHog.capture("feature_flag_checked", {
      flag: "example-feature",
      enabled: isEnabled,
    });
  };

  return (
    <MockPostHogProvider>
      <div className="space-y-4 p-6">
        <h2 className="text-slate-11 mb-4 text-xl font-semibold">
          PostHog Mock Example
        </h2>

        <div className="space-y-2">
          <p className="text-slate-10 text-sm">
            This component demonstrates how to use PostHog mocks in Storybook
            stories.
          </p>

          <div className="flex gap-2">
            <Button
              onClick={handleButtonClick}
              dataTestId="capture-event-button"
            >
              Capture Event
            </Button>

            <Button
              onClick={handleFeatureFlagCheck}
              variant="secondary"
              dataTestId="check-feature-flag-button"
            >
              Check Feature Flag
            </Button>
          </div>
        </div>
      </div>
    </MockPostHogProvider>
  );
}

const meta: Meta<typeof PostHogExampleComponent> = {
  title: "Testing/PostHog Mock Example",
  component: PostHogExampleComponent,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof PostHogExampleComponent>;

export const BasicExample: Story = {
  name: "Basic PostHog Mock Usage",
  parameters: {
    chromatic: { disable: true },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify component renders", async () => {
      expect(canvas.getByText("PostHog Mock Example")).toBeInTheDocument();
      expect(canvas.getByTestId("capture-event-button")).toBeInTheDocument();
      expect(
        canvas.getByTestId("check-feature-flag-button"),
      ).toBeInTheDocument();
    });

    await step("Test event capture", async () => {
      const captureButton = canvas.getByTestId("capture-event-button");
      await userEvent.click(captureButton);

      // In a real test, we'd verify the mock was called
      // For this example, we just verify the button works
      expect(captureButton).toBeInTheDocument();
    });

    await step("Test feature flag check", async () => {
      const featureFlagButton = canvas.getByTestId("check-feature-flag-button");
      await userEvent.click(featureFlagButton);

      // In a real test, we'd verify the mock was called
      expect(featureFlagButton).toBeInTheDocument();
    });
  },
};

export const WithMockVerification: Story = {
  name: "Test: Mock Verification Example",
  parameters: {
    chromatic: { disable: true },
  },
  async beforeEach() {
    // Get the mock and clear any previous calls
    const postHogMock = usePostHog();
    postHogMock.capture.mockClear();
    postHogMock.isFeatureEnabled.mockClear();

    // Set up specific mock behavior
    postHogMock.isFeatureEnabled.mockReturnValue(true);
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const postHogMock = usePostHog();

    await step("Test capture event with verification", async () => {
      const captureButton = canvas.getByTestId("capture-event-button");
      await userEvent.click(captureButton);

      // Verify the mock was called with expected arguments
      expect(postHogMock.capture).toHaveBeenCalledWith(
        "example_button_clicked",
        expect.objectContaining({
          component: "PostHogExampleComponent",
        }),
      );
    });

    await step("Test feature flag with verification", async () => {
      const featureFlagButton = canvas.getByTestId("check-feature-flag-button");
      await userEvent.click(featureFlagButton);

      // Verify feature flag was checked
      expect(postHogMock.isFeatureEnabled).toHaveBeenCalledWith(
        "example-feature",
      );

      // Verify capture was called with feature flag result
      expect(postHogMock.capture).toHaveBeenCalledWith(
        "feature_flag_checked",
        expect.objectContaining({
          flag: "example-feature",
          enabled: true, // This should be true because we mocked it above
        }),
      );
    });
  },
};
