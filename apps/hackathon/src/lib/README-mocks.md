# Reusable Mocks for Storybook

This directory contains reusable mock implementations for commonly used dependencies in our Storybook stories.

## PostHog Mock

The PostHog mock (`posthog.mock.ts`) provides a complete mock implementation of the PostHog analytics service.

### Usage in Stories

To use the PostHog mock in your stories, you have two options:

#### Option 1: Import and Use Directly (Recommended for now)

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within, step } from "@storybook/test";

// Import the mock directly
import { usePostHog } from "../lib/posthog.mock";

// Your component that uses PostHog
import { MyComponent } from "./my-component";

const meta: Meta<typeof MyComponent> = {
  title: "Components/MyComponent",
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const InteractionTest: Story = {
  parameters: {
    chromatic: { disable: true },
  },
  async beforeEach() {
    // Set up PostHog mock behavior
    const mockPostHog = usePostHog();
    mockPostHog.capture.mockClear(); // Clear previous calls

    // You can also set up specific return values
    mockPostHog.isFeatureEnabled.mockReturnValue(true);
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await step("Test PostHog integration", async () => {
      const button = canvas.getByTestId("analytics-button");
      await userEvent.click(button);

      // Verify PostHog was called
      const mockPostHog = usePostHog();
      expect(mockPostHog.capture).toHaveBeenCalledWith("button_clicked", {
        button_name: "analytics-button",
      });
    });
  },
};
```

#### Option 2: Mock at Component Level

For components that import PostHog directly, you can mock the import:

```typescript
// At the top of your story file
vi.mock("posthog-js/react", async () => {
  const actual = await vi.importActual("../lib/posthog.mock");
  return actual;
});
```

### Available Mock Methods

The PostHog mock provides all commonly used PostHog methods:

- `capture(event, properties)` - Mock event tracking
- `identify(userId, properties)` - Mock user identification
- `reset()` - Mock session reset
- `group(groupType, groupKey)` - Mock group identification
- `alias(alias)` - Mock user aliasing
- `isFeatureEnabled(flag)` - Mock feature flag (returns `false` by default)
- `getFeatureFlag(flag)` - Mock feature flag value (returns `undefined` by default)
- `reloadFeatureFlags()` - Mock feature flag reload
- `register(properties)` - Mock property registration
- `unregister(property)` - Mock property unregistration
- `getDistinctId()` - Mock distinct ID (returns `"mock-distinct-id"`)
- `setPersonProperties(properties)` - Mock person property setting

### Customizing Mock Behavior

You can customize the mock behavior in your story's `beforeEach` function:

```typescript
export const FeatureFlagEnabled: Story = {
  async beforeEach() {
    const mockPostHog = usePostHog();

    // Enable a specific feature flag
    mockPostHog.isFeatureEnabled.mockImplementation((flag) => {
      return flag === "new-feature";
    });

    // Set specific feature flag values
    mockPostHog.getFeatureFlag.mockImplementation((flag) => {
      if (flag === "theme") return "dark";
      if (flag === "version") return "v2";
      return undefined;
    });
  },
  // ... rest of story
};
```

## Future Mocks

We plan to add mocks for:

- Convex functions (`useMutation`, `useQuery`)
- Error processing utilities
- Other commonly used dependencies

## Best Practices

1. **Always use `chromatic: { disable: true }`** for interaction tests that use mocks
2. **Clear mock calls** in `beforeEach` to avoid test interference
3. **Use descriptive mock names** with `.mockName()` for better debugging
4. **Test the mock behavior** itself to ensure it works as expected
5. **Document any custom mock setups** in your story comments
