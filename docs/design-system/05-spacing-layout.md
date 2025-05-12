# 05: Spacing & Layout

This document outlines the spacing system and layout principles for the J5 family of sites. The goal is to create visually consistent, harmonious, and functional user interfaces tailored to the specific needs of each application, from ultra-dense, keyboard-driven apps to tap-optimized mobile interfaces.

## 1. Core Spacing Scale (4-Point Grid System)

All spacing values (margins, paddings, gaps, etc.) should be multiples of a base unit. We adopt a **4-point grid system**, where the base unit is `4px`.

- **Rationale:**

  - **Consistency:** Enforces a rhythmic and predictable visual structure.
  - **Simplicity:** Easy to remember and apply.
  - **Scalability:** Works well across different screen sizes.
  - **Tailwind Compatibility:** Aligns well with Tailwind CSS's default spacing scale.

- **Base Spacing Tokens (Conceptual):**
  - `--space-unit: 4px;`
  - `--space-xxs: calc(var(--space-unit) * 1);` (4px) - (Tailwind: `space-1`)
  - `--space-xs: calc(var(--space-unit) * 2);` (8px) - (Tailwind: `space-2`)
  - `--space-sm: calc(var(--space-unit) * 3);` (12px) - (Tailwind: `space-3`)
  - `--space-md: calc(var(--space-unit) * 4);` (16px) - (Tailwind: `space-4`) - Common default
  - `--space-lg: calc(var(--space-unit) * 6);` (24px) - (Tailwind: `space-6`)
  - `--space-xl: calc(var(--space-unit) * 8);` (32px) - (Tailwind: `space-8`)
  - `--space-2xl: calc(var(--space-unit) * 10);` (40px) - (Tailwind: `space-10`)
  - `--space-3xl: calc(var(--space-unit) * 12);` (48px) - (Tailwind: `space-12`)
  - `--space-4xl: calc(var(--space-unit) * 16);` (64px) - (Tailwind: `space-16`)
  - _(This scale can be extended or adjusted as needed and mapped to Tailwind's theme configuration.)_

## 2. Density-Aware Layout Profiles

The application of the spacing scale will vary based on the information density and interaction model of each specific J5 site.

### A. Ultra-Dense Profile

- **Example Application:** "Todo" app (keyboard-only, single list focus).
- **Primary Spacing:** Favors smaller units (`--space-xxs`, `--space-xs`, `--space-sm`).
  - Example: 4px or 8px gaps between list items, minimal padding within items.
- **Focus:** Maximize information visibility, clear vertical rhythm.
- **Layout:** Dominant single list. Supplementary UI (drawers, modals) should also be compact but with clear boundaries.
- **Interaction:** Ensure clear visual distinction for keyboard focus states despite tight spacing.

### B. Mobile-Optimized Profile

- **Example Application:** "Packing List" app (mobile-only, tap-optimized).
- **Primary Spacing:** Favors medium to larger units (`--space-md`, `--space-lg`, `--space-xl`) to create generous tap targets.
- **Tap Targets:** Ensure interactive elements have an effective tap area of at least 44px x 44px. This influences internal padding and spacing _between_ elements.
- **Focus:** Effortless one-handed use, high scannability.
- **Layout:** Clear, single-column lists. Large, easily tappable controls. Visual grouping with slightly larger spacing between groups than within item lists.

### C. High-Information, Interactive Profile

- **Example Application:** "Hire List" app (Jira-like, data-heavy, interactive).
- **Primary Spacing:** Flexible mix.
  - Smaller units (`--space-xs`, `--space-sm`, `--space-md`) within dense components (e.g., Kanban cards, list rows).
  - Larger units (`--space-lg`, `--space-xl`, `--space-2xl`) for separating major UI sections (e.g., sidebars, Kanban columns, page sections).
- **Focus:** Balancing large data volumes with clarity and ease of interaction (e.g., drag-and-drop).
- **Layout:**
  - **Kanban Boards:** Clear visual gutters between columns (e.g., `--space-lg` or `--space-xl`). Cards use compact internal spacing.
  - **Lists/Tables:** Can be dense; ensure sufficient row/cell padding for readability without excessive whitespace.
  - **Detailed Views (Modals/Drawers):** May use multi-column layouts, tabs. Generous padding within these focused views is important to avoid overwhelming the user.

## 3. General Layout Principles

These apply across all profiles, with adjustments based on density and device.

- **Responsive Design:**
  - Layouts must adapt clearly to different screen sizes.
  - Consider "mobile-first" for apps like "Packing List" and "desktop-first" for apps like "Hire List."
- **Containers & Max-Width:**
  - Use containers for consistent horizontal page padding.
  - Data-dense UIs ("Hire List", "Todo") may use wider or full-width containers for main content.
  - Text-heavy sections within any app should consider a max-width (e.g., 75-80ch) for readability.
- **Alignment & Consistency:**
  - Maintain strong alignment of elements.
  - Relative spacing _within_ reusable components should be consistent. Context determines margins _around_ components.
- **Visual Hierarchy:** Use spacing (along with typography and color) to guide the user's eye and delineate sections.
- **Accessibility:** Ensure logical tab order and keyboard navigation flow for all layouts.

## 4. Implementation with Tailwind CSS

- Utilize Tailwind's default spacing utilities, which align well with the 4-point system.
- Customize `tailwind.config.js` (specifically `theme.spacing`) if more specific named tokens or adjustments to the scale are required.
- Consider creating specific utility classes for container types if common patterns emerge (e.g., `.container-dense-padding`, `.container-comfortable-padding`).
