# 06: Border Radius

This document outlines the border radius system for the J5 family of sites, designed to ensure visual consistency and contribute to the "Modern & Sleek" aesthetic. Radii should be applied subtly and consistently.

## Core Principles

- **Subtlety:** Avoid overly rounded corners that can feel playful or less professional. Aim for a clean, modern look.
- **Consistency:** Use the defined scale systematically.
- **4-Point Alignment (General):** Most radii align with the 4-point grid system for visual harmony, with minor acceptable deviations for specific visual effects (e.g., `radius-md`).

## Radius Scale

The scale is based on a primary `--radius` variable and offers steps for various UI needs.

| CSS Variable    | Value      | Approx. (px) | Typical Use                                                                                         |
| :-------------- | :--------- | :----------- | :-------------------------------------------------------------------------------------------------- |
| `--radius-none` | `0px`      | 0px          | Elements requiring sharp, crisp edges (e.g., certain table cells, dividers, specific data views).   |
| `--radius-sm`   | `0.25rem`  | 4px          | Subtle rounding for small elements like tags, badges, or internal elements of components.           |
| `--radius-md`   | `0.375rem` | 6px          | General-purpose radius for buttons, input fields, smaller cards. Offers a step between 4px and 8px. |
| `--radius`      | `0.5rem`   | 8px          | Default radius for most components: cards, modals, popovers, drawers, larger input groups.          |
| `--radius-lg`   | `0.75rem`  | 12px         | Larger containers or when a more noticeably rounded corner is desired for a softer look.            |
| `--radius-xl`   | `1rem`     | 16px         | Very large containers or specific stylistic elements requiring a prominent rounded appearance.      |
| `--radius-full` | `9999px`   | N/A          | Creating pill shapes (e.g., for some buttons, tags) or perfectly circular elements (e.g., avatars). |

_(Pixel values are approximate, assuming a root font-size of 16px.)_

## Implementation

- These radii are defined as CSS custom properties in `:root` within `libs/component-library/src/styles/globals.css`.
- They can be directly used in custom CSS or mapped to Tailwind CSS's `theme.borderRadius` configuration in `tailwind.config.js` for use with utility classes (e.g., `rounded-sm`, `rounded-md`, `rounded-lg`).

### Example Tailwind Configuration (Conceptual)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      borderRadius: {
        none: "var(--radius-none)",
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius)", // Maps to `rounded`
        md: "var(--radius-md)", // Maps to `rounded-md`
        lg: "var(--radius-lg)", // Maps to `rounded-lg`
        xl: "var(--radius-xl)", // Maps to `rounded-xl`
        full: "var(--radius-full)", // Maps to `rounded-full`
      },
    },
  },
  plugins: [],
};
```

This provides a flexible yet consistent system for applying rounded corners across the J5 sites.
