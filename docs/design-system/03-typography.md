# 03: Typography

This document outlines the typographic system for the J5 family of sites, designed to ensure readability, hierarchy, and a consistent "Modern & Sleek," "Function-First," and "Expert-Oriented" aesthetic.

## Font Families

### 1. Primary Font Family (Sans-Serif)

- **Font:** **Geist Sans**
  - Referenced via CSS variable: `var(--font-sans)` (which should map to `var(--font-geist-sans)`)
- **Rationale:**
  - **Modern & Sleek:** Clean, geometric construction ideal for contemporary UIs.
  - **Function-First:** Designed for high clarity and readability in user interface contexts.
  - **Expert-Oriented:** Supports information-dense layouts effectively.
  - **Versatile:** Offers a good range of weights suitable for various UI elements.
- **Usage:** All general UI text, including headings, body copy, labels, buttons, navigation elements.

### 2. Monospaced Font Family

- **Font:** **Geist Mono**
  - Referenced via CSS variable: `var(--font-mono)` (which should map to `var(--font-geist-mono)`)
- **Rationale:**
  - **Consistency:** Harmonious visual pairing with Geist Sans.
  - **Clarity for Code/Data:** Essential for displaying code snippets, logs, tabular data, and other technical information where uniform character spacing is beneficial.
- **Usage:** Code blocks, inline code snippets, data tables requiring fixed-width columns, terminal-like outputs.

## Typographic Scale

The type scale is based on `rem` units for scalability and accessibility. These can be mapped to Tailwind CSS utility classes (e.g., `text-base`, `text-xl`).

| Tailwind Class | Size (rem) | Approx. Size (px @ 16px root) | Typical Use                             |
| :------------- | :--------- | :---------------------------- | :-------------------------------------- |
| `text-xs`      | 0.75rem    | 12px                          | Extra small text, captions, disclaimers |
| `text-sm`      | 0.875rem   | 14px                          | Small text, secondary info, labels      |
| `text-base`    | 1rem       | 16px                          | Default body text                       |
| `text-lg`      | 1.125rem   | 18px                          | Large body, subheadings (H4)            |
| `text-xl`      | 1.25rem    | 20px                          | Headings (H3)                           |
| `text-2xl`     | 1.5rem     | 24px                          | Headings (H2)                           |
| `text-3xl`     | 1.875rem   | 30px                          | Main headings (H1)                      |
| `text-4xl`     | 2.25rem    | 36px                          | Large display headings (optional)       |
| `text-5xl`     | 3rem       | 48px                          | X-Large display headings (optional)     |
| `text-6xl`     | 3.75rem    | 60px                          | XX-Large display headings (optional)    |

_(The px values are approximate and assume a root font size of 16px.)_

## Font Weights

Leverage the available weights from Geist Sans and Geist Mono. Common Tailwind utilities:

- **`font-light` (300):** For delicate text, if needed.
- **`font-normal` (400):** Default for body text and most UI elements.
- **`font-medium` (500):** For slight emphasis, some UI controls, or less prominent subheadings.
- **`font-semibold` (600):** For stronger emphasis, subheadings.
- **`font-bold` (700):** For primary headings (H1, H2, H3).
- **`font-extrabold` (800):** For very strong emphasis, if needed.
- **`font-black` (900):** For extremely strong, impactful text, use sparingly.

For `Geist Mono`, `font-normal` (400) will be the most common weight.

## Line Heights

Appropriate line height (leading) is crucial for readability. Tailwind examples:

- **Body Text:** `leading-normal` (1.5) or `leading-relaxed` (1.625) for paragraphs to ensure good spacing.
  - CSS: `line-height: 1.6;` or similar.
- **Headings:** `leading-tight` (1.25) or `leading-snug` (1.375) can be used as text is larger.
  - CSS: `line-height: 1.3;` or similar.
- **Code/Monospace:** `leading-normal` (1.5) or `leading-relaxed` (1.625) is often suitable.

Always test readability, especially with dense information and on dark backgrounds.

## Implementation Notes

- Ensure Geist Sans and Geist Mono fonts are correctly imported and available in the project.
- Define `--font-mono` in `globals.css` alongside `--font-sans`.
- Use Tailwind's typography utilities to apply these styles consistently.
