# @jacksondr5/component-library

A React component library built with TypeScript, Tailwind CSS, and Radix UI primitives. This library provides both standalone UI components and form-integrated field components for building modern web applications. It was built to meet my personal needs when building React apps.

## Overview

This library offers two types of components:

- **Base Components**: Standalone UI components (e.g., `Button`, `Input`, `Select`) that can be used independently
- **Field Components**: Form-integrated wrappers (e.g., `FieldInput`, `FieldTextarea`, `FieldSelect`) that work seamlessly with [@tanstack/react-form](https://tanstack.com/form/latest)

## Features

- 🎨 Built with Tailwind CSS for consistent, customizable styling
- ♿ Accessibility-first design using Radix UI primitives
- 📝 Form integration with TanStack Form
- 🧪 Comprehensive test coverage with Storybook
- 📦 Tree-shakeable exports
- 🎭 TypeScript support with full type definitions
- 🌙 Dark mode support via next-themes

## Available Components

### UI Components

- **Avatar** - User avatar with fallback support and avatar groups
- **Badge** - Status and category indicators
- **Button** - Primary UI actions with variants
- **Card** - Content containers with header, content, and footer sections
- **Dialog** - Modal dialogs for user interactions
- **Popover** - Floating content containers
- **Separator** - Visual dividers
- **Sheet** - Slide-out panels
- **Sidebar** - Application navigation sidebar
- **Skeleton** - Loading state placeholders
- **Tabs** - Tabbed content containers
- **Tag** - Removable labels and tags
- **Tooltip** - Contextual help tooltips

### Form Components

- **Calendar** - Date selection calendar
- **Checkbox** - Single or group checkbox inputs
- **Date Picker** - Date selection with calendar popover
- **Input** - Text input fields
- **Radio Group** - Radio button groups
- **Select** - Dropdown selection
- **Textarea** - Multi-line text input

### Utilities

- **Sortable List** - Drag-and-drop sortable lists with dnd-kit
- **Sonner** - Toast notifications
- **Form Contexts** - Form state management utilities
- **useAppForm** - Form hook with validation
- **useMobile** - Responsive design hook
- **cn** - Tailwind class name utility

## Installation

```bash
pnpm add @jacksondr5/component-library
```

## Usage

### Basic Components

```tsx
import { Button, Input, Card } from "@jacksondr5/component-library";

function MyComponent() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Welcome</Card.Title>
      </Card.Header>
      <Card.Content>
        <Input placeholder="Enter your name" />
      </Card.Content>
      <Card.Footer>
        <Button>Submit</Button>
      </Card.Footer>
    </Card>
  );
}
```

### Form Components

```tsx
import { useForm } from "@tanstack/react-form";
import { FieldInput, FieldSelect } from "@jacksondr5/component-library";

function MyForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      role: "",
    },
  });

  return (
    <form.Field name="name">
      {(field) => <FieldInput label="Name" placeholder="Enter your name" />}
    </form.Field>
  );
}
```

## Development

### Building

```bash
nx build component-library
```

### Running Storybook

```bash
nx storybook component-library
```

### Testing

```bash
nx test component-library
```

## Component Development Guidelines

When developing components for this library, follow these principles:

1. **Simplicity**: Follow KISS and YAGNI principles
2. **Accessibility**: Ensure all components meet WCAG standards
3. **Type Safety**: Maintain strict TypeScript typing
4. **Consistency**: Follow existing patterns and naming conventions
5. **Testing**: Write comprehensive Storybook stories for visual and interaction testing

See the workspace rules for detailed guidelines on developing Field components.

## License

MIT © Jackson Miller
