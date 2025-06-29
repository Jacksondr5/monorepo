/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { fn } from "storybook/test";
import { PostHogProvider as RealPostHogProvider } from "posthog-js/react";

// Mock PostHog instance with all commonly used methods
const createMockPostHog = {
  capture: fn().mockName("posthog.capture"),
  identify: fn().mockName("posthog.identify"),
  reset: fn().mockName("posthog.reset"),
  group: fn().mockName("posthog.group"),
  alias: fn().mockName("posthog.alias"),
  onFeatureFlags: fn().mockName("posthog.onFeatureFlags"),
  isFeatureEnabled: fn()
    .mockReturnValue(false)
    .mockName("posthog.isFeatureEnabled"),
  getFeatureFlag: fn()
    .mockReturnValue(undefined)
    .mockName("posthog.getFeatureFlag"),
  reloadFeatureFlags: fn().mockName("posthog.reloadFeatureFlags"),
  register: fn().mockName("posthog.register"),
  unregister: fn().mockName("posthog.unregister"),
  setPersonProperties: fn().mockName("posthog.setPersonProperties"),
};

// Export the mocked usePostHog hook
export const usePostHog = fn(() => createMockPostHog).mockName("usePostHog");

// Mock the PostHogProvider to just render children
export const MockPostHogProvider = fn(
  ({ children }: { children: React.ReactNode }) => (
    <RealPostHogProvider client={createMockPostHog as any}>
      {children}
    </RealPostHogProvider>
  ),
).mockName("PostHogProvider");
