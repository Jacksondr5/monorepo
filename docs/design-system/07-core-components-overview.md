# 07: Core UI Components Overview

This document provides a high-level overview of the essential UI components for the J5 design system. It outlines their general style and interaction characteristics, guided by our established design principles (Brand Vibe, Colors, Typography, Spacing, Border Radii) and consideration for different density profiles. Lucide Icons ([https://lucide.dev/](https://lucide.dev/)) will be the primary icon library.

**Color Application Note:** All component colors should strictly adhere to the 12-step Radix Color scales defined in `02-colors.md`. Refer to that document and the official Radix UI documentation for guidance on selecting appropriate shades for backgrounds, text, borders, and states to ensure consistency and accessibility.

## 1. Buttons

- **General Style:**
  - **Font:** `font-sans` (Geist Sans), `font-medium`.
  - **Border Radius:** `rounded-md` (6px) for most. Potentially `rounded-full` for icon-only or specific pill-style buttons.
  - **Padding:** Spacing should ensure clear tap/click targets. Adjust based on density profile:
    - _Mobile-Optimized_: More generous padding (e.g., `py-2 px-4` or `py-3 px-6` - translating to `py-space-md px-space-lg`).
    - _Dense Profiles_: Tighter padding (e.g., `py-1 px-2` or `py-1.5 px-3` - translating to `py-space-xs px-space-sm` or `py-space-sm px-space-md`).
  - **Height:** Consistent height for buttons of the same size variant (e.g., using `h-8`, `h-10`).
- **Variants:**
  - **Primary:**
    - Background: `bg-grass-9`
    - Text: `text-grass-1` or `text-slate-12` (ensure AA/AAA contrast).
    - Hover: `hover:bg-grass-10`
  - **Secondary (Outline/Subtle):**
    - Background: `bg-olive-3` or `bg-transparent`.
    - Text: `text-slate-11` or `text-grass-9`.
    - Border: `border border-olive-7` or `border border-grass-8`.
    - Hover: `hover:bg-olive-4` or `hover:bg-grass-4`.
  - **Tertiary/Link-Style:**
    - No border or background.
    - Text: `text-blue-9` or `text-grass-9`.
    - Hover: `hover:underline` or `hover:text-blue-10`/`hover:text-grass-10`.
  - **Destructive:**
    - Background: `bg-red-9`
    - Text: `text-red-1` or high-contrast dark neutral.
    - Hover: `hover:bg-red-10`
  - **Icon Buttons:** Square or circular (e.g., `w-8 h-8` or `w-10 h-10`), clear tap target. Use Lucide icons.

## 2. Input Fields

- **Includes:** Text Input, Textarea, Select.
- **General Style:**
  - **Font:** `font-sans` (Geist Sans), `font-normal`.
  - **Background:** `bg-olive-2` or `bg-slate-2`.
  - **Border:** `border border-olive-6` or `border border-slate-6`.
  - **Focus State:** `focus:border-grass-8`, subtle `focus:ring-2 focus:ring-grass-8/50` (example).
  - **Text Color:** `text-slate-12`. Placeholder: `placeholder-slate-9`.
  - **Padding:** Consistent internal padding (e.g., `px-3 py-2` - `px-space-sm py-space-xs`).
  - **Border Radius:** `rounded-md`.
- **States:**
  - Disabled: `disabled:bg-olive-1 disabled:text-slate-8 disabled:border-olive-4`.
  - Error: `border-red-7`.
- **Textarea:** Resizable as needed (`resize-y` or `resize`).
- **Select:** Styled dropdown arrow (Lucide's `chevron-down`) via background image or pseudo-element, or using a library like ShadCN's Select.

## 3. Checkboxes & Radio Buttons

- **General Style:**
  - **Size:** Clear visual presence and tap target (e.g., `w-4 h-4` or `w-5 h-5`).
  - **Border Radius (for checkbox):** `rounded-sm`.
  - **Colors:**
    - Unchecked: `border-olive-7 bg-olive-3`.
    - Checked: `bg-grass-9 text-grass-1` (for the checkmark/dot).
  - **Focus State:** `focus:ring-2 focus:ring-blue-8/50`.
  - **Label:** `font-sans` (Geist Sans), `font-normal`, `text-slate-11`. Spaced appropriately from the control (e.g., `ml-2`).

## 4. Cards

- **Purpose:** Grouping related content.
- **General Style:**
  - **Background:** `bg-olive-2` or `bg-slate-2`.
  - **Border Radius:** `rounded` (8px) or `rounded-lg` (12px).
  - **Border (Optional):** Subtle `border border-olive-4` or `border border-slate-4`.
  - **Padding:** Generous internal padding (e.g., `p-4` or `p-6` - `p-space-lg` or `p-space-xl`), can be adjusted for density.
  - **Shadow (Subtle):** Optional, for visual lift (e.g., `shadow-md`).

## 5. Modals/Dialogs

- **Purpose:** Focused tasks, critical information.
- **General Style:**
  - **Overlay:** Dark semi-transparent background (`bg-olive-a9`).
  - **Content Container:**
    - Background: `bg-olive-3` or `bg-slate-3`.
    - Border Radius: `rounded-lg`.
    - Padding: Generous internal padding (`p-6` - `p-space-xl`).
    - Shadow: `shadow-xl` or custom subtle shadow to lift from overlay.
  - **Header/Footer:** Clear separation, often with borders (`border-b border-olive-6` or `border-t border-olive-6`).

## 6. Drawers/Side Panels

- **Purpose:** Supplementary content, navigation.
- **General Style:** Similar to Modals but slides in from an edge.
  - **Background:** `bg-olive-3` or `bg-slate-3`.
  - **Shadow:** `shadow-lg` on the edge facing the main content.
  - **Padding:** Appropriate internal padding (e.g., `p-4` or `p-6`).

## 7. Badges

- **Purpose:** Static status indicators, counts, or concise information snippets.
- **General Style:**
  - **Font:** `font-sans` (Geist Sans), `font-medium`, `text-xs`.
  - **Padding:** Tight (e.g., `py-0.5 px-2` - `py-space-xxs px-space-xs`).
  - **Border Radius:** `rounded-sm` (default) or `rounded-full` for pill shape.
  - **Colors:** Use semantic colors (e.g., `bg-green-3 text-green-11` for success, `bg-red-3 text-red-11` for error) or neutral grays (`bg-olive-3 text-olive-11`, `bg-slate-3 text-slate-11`).
  - **Interaction:** None. No interactive states (hover, focus, active). Tooltips may be used for truncated text.

## 8. Tags

- **Purpose:** Interactive elements for keywords, filtering, selection, or dismissible items.
- **General Style:**
  - **Font:** `font-sans` (Geist Sans), `font-medium`, `text-sm`.
  - **Padding:** Slightly more generous to ensure good tap/click targets (e.g., `py-1 px-2.5` or `py-1 px-3` - translating to `py-space-xxs px-space-sm` or `py-space-xxs px-space-md-(sm)`).
  - **Border Radius:** `rounded-md` (consistent with buttons/inputs) or `rounded-full`.
  - **Colors:** Use semantic colors, neutral grays, or brand accent colors. Can have distinct visual styles for selected/active states.
  - **Interaction:**
    - **Hover State:** Subtle background change (e.g., `hover:bg-olive-5`, `hover:bg-grass-5`).
    - **Focus State:** Clear focus indicator (e.g., `focus:ring-2 focus:ring-blue-7/50`).
    - **Dismissible:** May include a small 'x' icon (Lucide `x` or `x-circle`) for removal, with its own hover/focus states.
    - **Selectable:** If used for selection (e.g., in a multi-select filter), should have clear `aria-pressed` or `aria-selected` states with distinct styling (e.g., stronger background, border, or an adjacent checkmark icon).

## 9. Alerts/Notifications

- **Purpose:** System messages, success, error, warning, info.
- **General Style:**
  - **Background:** Semantic color (e.g., `bg-green-3` for success).
  - **Border:** Subtle border of the same semantic color family (e.g., `border border-green-6`).
  - **Text:** Semantic color text (e.g., `text-green-11`).
  - **Icon:** Lucide icon matching the semantic intent, colored appropriately.
  - **Padding:** `p-4` (`p-space-md`).
  - **Border Radius:** `rounded` (8px).

## 10. Tooltips

- **Purpose:** Brief contextual help.
- **General Style:**
  - **Background:** `bg-slate-3` or `bg-olive-3`.
  - **Text:** `text-slate-12`, `text-sm`.
  - **Padding:** `py-1 px-2` (`py-space-xs px-space-sm`).
  - **Border Radius:** `rounded-sm`.
  - **Arrow:** Pointing to the target element (often achieved with pseudo-elements or a library).

## 11. Navigation (Menus, Tabs)

- **Menus (Dropdowns, Side Nav):**
  - **Item Padding:** Adjust for density (e.g., `px-3 py-2`).
  - **Active/Hover States:** Use subtle backgrounds (e.g., `hover:bg-olive-4`, `aria-selected:bg-grass-3`).
  - **Separators:** `border-b border-olive-6`.
- **Tabs:**
  - **Active Tab:** Clear visual distinction (e.g., `bg-olive-3 border-b-2 border-grass-9`).
  - **Inactive Tabs:** Subtle text color (`text-slate-9`).

## 12. Tables

- **Focus:** Clarity for dense data.
- **Row Spacing:** Adequate padding within cells (e.g., `px-3 py-2` - `px-space-sm py-space-xs`).
- **Borders:** Subtle row separators (`border-b border-olive-4` or `border-b border-slate-4`). Header separator stronger.
- **Header:** `font-semibold`, slightly different background (`bg-olive-3`).

## 13. Iconography

- **Library:** Lucide Icons ([https://lucide.dev/](https://lucide.dev/)).
- **Default Size:** `w-4 h-4` (16px) or `w-5 h-5` (20px), can be scaled.
- **Color:** Typically `text-current` to inherit text color, or specific semantic/brand colors (e.g., `text-grass-9`).
- **Stroke Width:** Default Lucide stroke, can be adjusted if design requires (usually via SVG props if customizing).

---

This list isn't exhaustive but covers many common needs. We'll flesh these out further as we design specific features/sites.
