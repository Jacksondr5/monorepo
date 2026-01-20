# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a pnpm monorepo using Nx as the build orchestrator. It contains multiple Next.js applications, a shared component library, and custom Nx plugins.

- **Package Manager**: pnpm (version in package.json)
- **Node Version**: See `.nvmrc`
- **Build System**: Nx with task distribution via Nx Cloud

## Common Commands

```bash
# Development
pnpm nx dev <app>                    # Run Next.js dev server
pnpm nx storybook component-library  # Run component library Storybook

# Building
pnpm nx build <project>              # Build a project
pnpm nx build-storybook <project>    # Build Storybook

# Testing
pnpm nx test <project>               # Run unit tests (Vitest)
pnpm nx e2e-ci <e2e-app>             # Run E2E tests (Playwright)
pnpm nx lint <project>               # Lint code
pnpm nx typecheck <project>          # TypeScript check

# Before committing
pnpm nx format                       # Format all code (run from monorepo root, no args)
pnpm nx affected -t typecheck lint   # Verify affected projects

# CI runs these affected tasks
pnpm nx affected -t lint test build-storybook chromatic vercel-build-deploy e2e-ci
```

## Architecture

### Directory Structure

- `apps/` - Next.js applications (todo, hackathon, hire, packing-list, etc.)
- `apps/*-e2e/` - Playwright E2E tests for each app
- `libs/component-library/` - Shared React component library (`@j5/component-library`)
- `libs/chromatic/` - Chromatic visual regression testing aggregator
- `tools/` - Custom Nx plugins (convex, vercel, playwright-env)

### Technology Stack

- **Framework**: Next.js with React
- **Styling**: Tailwind CSS (dark mode only - use `text-slate-11` or `text-slate-12` for text)
- **Forms**: TanStack React Form with Zod validation
- **Backend**: Convex (serverless with real-time sync and offline support)
- **Auth**: Clerk
- **Testing**: Vitest (unit), Playwright (E2E), Storybook + Chromatic (visual regression)
- **UI**: Radix UI primitives, custom component library with CVA for variants

### Custom Nx Plugins (in `tools/`)

- `convex/plugin.ts` - Creates `convex-deploy` targets for Convex projects
- `vercel/plugin.ts` - Handles Vercel deployment configuration
- `playwright-env/plugin.ts` - Sets up Playwright environment variables

## Code Conventions

### General Rules

- Alphabetize object keys
- For long-running processes (dev servers), ask the user to start them instead of running them yourself
- Use Tailwind for all styling
- Apps are permanently in dark mode - use light text colors (`text-slate-11`, `text-slate-12`)

### TypeScript Path Aliases

Apps use `~/*` alias pointing to `./src/*` (e.g., `~/components/Button`)

### Convex Guidelines

When working with Convex:

- Use the new function syntax with `args` and `returns` validators
- Always include return validators (use `returns: v.null()` if no return value)
- Use `Id<'tableName'>` for document ID types
- Use `internalQuery`/`internalMutation`/`internalAction` for private functions
- Do NOT use `filter` in queries - define indexes and use `withIndex`
- Actions cannot access `ctx.db` - call queries/mutations from actions instead
- Add `"use node";` at top of files using Node.js modules in actions
- When running Convex MCP tools requesting "projectDir", use the app directory (e.g., `apps/hire`), never the monorepo root

### Component Library

- Field components (e.g., `FieldInput`) wrap base components for form integration
- Use `useFieldContext<T>()` for form state
- Test IDs follow pattern: `${field.name}-{element-type}` (e.g., `email-input`, `email-error`)
- Export both base and Field variants from component directories

### Storybook Testing

Two story types are required for component library components:

1. **Visual Matrix Story** (`Visual: All States`) - Shows all prop combinations in a grid
2. **Interaction Test Story** (`Test: <description>`) - Uses `play` function for user interaction tests

Use `storybook/test` imports (Vitest methods), not Jest. Stories should use `data-testid` selectors only.

### Playwright E2E Testing

- Use Page Object Model (POM) pattern
- All selectors must be `data-testid` attributes
- Combine related assertions into single tests to reduce page loads
- POMs go in `apps/<app>-e2e/src/pages/*.page.ts`

## PR Workflow

1. Create branch (use Linear issue name if available: `jackson/jac-XX-description`)
2. Run `pnpm nx format` before committing
3. Run `pnpm nx affected -t typecheck lint` to verify
4. Commit with conventional format and Linear reference:

   ```
   feat: description

   - Change 1
   - Change 2

   Fixes JAC-XX
   ```

5. Create PR with `gh pr create`