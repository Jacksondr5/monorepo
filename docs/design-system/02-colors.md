# 02: Color System

This document outlines the color palette for the J5 family of sites. The palette is based on Radix Colors scales ([https://www.radix-ui.com/colors/docs/palette-composition/scales](https://www.radix-ui.com/colors/docs/palette-composition/scales)), leveraging their dark themes to align with our "dark mode native" design philosophy.

When applying specific shades from these scales, refer to the Radix UI documentation on understanding the scale steps for appropriate use cases: [https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale).

## Core Palette

### 1. Primary Brand Color

- **Scale:** Radix `Grass` (Dark Scale)
- **Purpose:** The main identifying color for the J5 brand. Used for prominent UI elements, active states, accents, and potentially for solid backgrounds where a strong brand presence is desired.
- **CSS Prefix:** `--color-grass-*`

### 2. Neutral Colors

These form the backbone of the UI, used for backgrounds, text, borders, and general interface elements.

- **Primary Neutral:** Radix `Olive` (Dark Scale)
  - **Purpose:** App backgrounds, card backgrounds, subtle UI elements. Provides a warm, earthy alternative to pure grays.
  - **CSS Prefix:** `--color-olive-*`
- **Secondary Neutral:** Radix `Slate` (Dark Scale)
  - **Purpose:** Text, UI controls, borders, and separators where a cooler, more traditional tech gray is preferred. Offers flexibility and contrast against warmer neutrals.
  - **CSS Prefix:** `--color-slate-*`

### 3. Semantic Colors

Used for user feedback (success, error, warning, info). All use Radix dark scales.

- **Success:**
  - **Scale:** Radix `Green` (Dark Scale)
  - **Purpose:** Indicating successful operations, confirmations.
  - **CSS Prefix:** `--color-green-*`
- **Error:**
  - **Scale:** Radix `Red` (Dark Scale)
  - **Purpose:** Highlighting errors, critical alerts.
  - **CSS Prefix:** `--color-red-*`
- **Warning:**
  - **Scale:** Radix `Amber` (Dark Scale)
  - **Purpose:** Drawing attention to potential issues or cautionary messages.
  - **CSS Prefix:** `--color-amber-*`
- **Informational / Accent:**
  - **Scale:** Radix `Blue` (Dark Scale)
  - **Purpose:** Informational messages, links, or subtle accents that need to stand apart from the green/olive base.
  - **CSS Prefix:** `--color-blue-*`

## Application Guidance

- Always prioritize readability and accessibility when choosing shades.
- Use the 12-step Radix scales to select the appropriate shade for the UI element's state (e.g., step 3 for backgrounds, step 4 for hover, step 9 for solid backgrounds, step 11/12 for text).
- Maintain consistency in how colors are applied across all J5 sites.
