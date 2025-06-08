# Testing in the Component Library

This document outlines the testing approach for the J5 component library, emphasizing a balance between comprehensive coverage and cost-effectiveness, particularly concerning Chromatic snapshots.

Storybook serves as our primary platform for both functional and visual testing. Chromatic then integrates with Storybook to capture visual snapshots.

## Story Types & Their Roles

We will primarily use **three** types of stories, typically co-located within the same `*.stories.tsx` file for a given component or its field variant:

1.  **Component Visual Matrix Story (e.g., `AllVariants` export):**

    - **Purpose:** To capture the visual appearance of a **base component** (e.g., `Button`, `Input`, `Checkbox`, `DatePicker`) across its numerous static prop combinations (e.g., variants, sizes, states like disabled, **error**, with/without icons).
    - **Method:** These stories utilize a custom `render` function within Storybook to display multiple component instances in a single story view.
    - **Benefit:** This significantly reduces the number of individual Chromatic snapshots for base components, helping to manage costs while still providing broad visual regression coverage for static states.
    - **Location:** Resides within the component's main story file (e.g., `input.stories.tsx`).
    - **Storybook Title:** Defined in the `meta` object (e.g., `title: "Components/Input"`).
    - **Error State:** Must include a visual representation of the component in its error state (e.g., with `error={true}` or appropriate `aria-invalid` styling applied).

2.  **Field Component Visual Matrix Story (e.g., `AllFieldStates` export):**

    - **Purpose:** To capture the visual appearance of **Field-level components** (e.g., `FieldInput`, `FieldSelect`, `FieldCheckboxGroup`, `FieldDatePicker`) which typically combine a `Label`, the core input component, and `FormErrorMessage`.
    - **Method:** Similar to Component Visual Matrix Stories, display multiple instances in a single story, showcasing common field states.
    - **States to Cover:**
      - Normal (empty)
      - Filled (with a value)
      - Disabled
      - Error (with an error message displayed and error styling on the input)
      - Error + Filled (error state with a value present)
    - **Benefit:** Ensures the composite Field component, including label and error message layout, is visually correct across key states. Reduces snapshots compared to individual stories for each state.
    - **Location:** Resides within a dedicated story file for the field component (e.g., `field-input.stories.tsx`).
    - **Storybook Title:** Defined in the `meta` object to nest under the base component (e.g., `title: "Components/Input/Field"` for `field-input.stories.tsx`).

3.  **Functional/Interaction Stories (Individual story exports):**
    - **Purpose:** To test the dynamic behavior, event handling (`onClick`, `onChange`, etc.), accessibility attributes during interaction, and complex state changes of **both base components and Field components**.
    - **Method:** These stories leverage Storybook's `play` function to simulate user interactions.
    - **Chromatic Snapshots:** Chromatic will typically snapshot the component at the end of the `play` function execution, and can also capture intermediate steps if the `step` utility from `@storybook/test` is used. These snapshots are valuable for verifying visual changes that occur _as a result_ of interaction.
    - **Granularity:** `play` functions should ideally target specific, focused user flows or interactions.
    - **Field Component Interactions:** For Field components, interaction tests should verify:
      - Correct association of `Label` with the input.
      - Proper propagation of value changes to the form context (e.g., via `handleChange`).
      - Activation and display of error messages and ARIA attributes (`aria-invalid`, `aria-describedby`) when the form context indicates an error.
    - **Location:** Reside as individual story exports within the respective component's story file (e.g., `input.stories.tsx` or `field-input.stories.tsx`).
    - **Disabling Chromatic:** If visual testing the functional story is not valuable (e.g., it's purely a logic/event test with no significant visual change not covered elsewhere), you can disable Chromatic for that story by adding `chromatic: { disable: true }` to the story's parameters.

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
