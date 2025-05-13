# Testing in the Component Library

This document outlines the testing approach for the J5 component library, emphasizing a balance between comprehensive coverage and cost-effectiveness, particularly concerning Chromatic snapshots.

Storybook serves as our primary platform for both functional and visual testing. Chromatic then integrates with Storybook to capture visual snapshots.

## Story Types & Their Roles

We will primarily use two types of stories:

1.  **Visual Matrix Stories (Cost-Saving for Chromatic):**

    - **Purpose:** To capture the visual appearance of a component across its numerous static prop combinations (e.g., variants, sizes, states like disabled, with/without icons).
    - **Method:** These stories utilize a custom `render` function within Storybook to display multiple component instances in a single story view.
    - **Benefit:** This significantly reduces the number of individual Chromatic snapshots, helping to manage costs while still providing broad visual regression coverage for static states.
    - **Example Naming:** `Button.visuals.stories.tsx` or a story export named `AllVariantsAndStates`. Use a separate file when there are too many variants to fit into a single story, but prefer the single story approach where possible.

2.  **Functional/Interaction Stories:**
    - **Purpose:** To test the dynamic behavior, event handling (`onClick`, `onChange`, etc.), accessibility attributes during interaction, and complex state changes of a component.
    - **Method:** These stories leverage Storybook's `play` function to simulate user interactions (e.g., clicks, typing, focusing).
    - **Chromatic Snapshots:** Chromatic will typically snapshot the component at the end of the `play` function execution, and can also capture intermediate steps if the `step` utility from `@storybook/test` is used. These snapshots are valuable for verifying visual changes that occur _as a result_ of interaction.
    - **Granularity:** `play` functions should ideally target specific, focused user flows or interactions rather than attempting to cover every prop combination within one overly complex test.
    - **Example Naming:** `Button.interactions.stories.tsx` or story exports like `PrimaryButtonClickTest`, `DisabledButtonInteractionTest`.
    - **Disabling Chromatic:** If visual testing the functional story is not valuable, you can disable Chromatic for that story by adding `chromatic: { disable: true }` to the story's parameters.

## Testing Interactive States (Hover, Focus, Active)

CSS-driven interactive states (`:hover`, `:focus`, `:active`) are crucial for a good user experience. Testing their visual appearance can be approached in a few ways:

1.  **Leverage Functional Stories:** As `play` functions interact with components (e.g., focusing an input, tabbing to a button), Chromatic will capture these states. This often provides good coverage.
2.  **Dedicated Interaction Stories:** For critical interactive states that might not be fully covered by broader functional tests, create small, dedicated stories. These might use a `play` function to programmatically apply focus or simulate a hover-like state for Chromatic to capture. (e.g. using `userEvent.hover()` and then ensuring the story remains in that state for the snapshot).
3.  **Storybook's `parameters.pseudo` (If Applicable):** Some Storybook setups allow for `parameters.pseudo` to force pseudo-states. Check if your Storybook version and Chromatic support this effectively for visual snapshots.
4.  **Chromatic's Interaction Features:** Explore Chromatic's "Interact" tab for stories. While this is more for manual inspection, it can help identify issues. It doesn't typically replace automated snapshotting of these states.

**Recommendation:** Prioritize capturing interactive states through well-crafted functional stories. Add dedicated stories for `:hover` or `:focus` visuals if critical styles are not otherwise covered.

## General Guidelines

- **Clarity over Quantity (for Interaction Tests):** Focus interaction tests on verifying specific behaviors rather than every visual permutation. The visual matrix stories handle the latter.
- **Accessibility:** Use `play` functions to test keyboard navigation and ensure `aria` attributes are updated correctly during interactions.
- **Balance:** Continuously evaluate the balance between thoroughness of visual/functional tests and the cost/maintenance overhead of Chromatic snapshots.

By adhering to these guidelines, we can build a robust testing suite for our component library that is both effective and economical.
