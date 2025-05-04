# Dark Theme UI Components

This directory contains UI components designed for a dark-themed application. The design system provides consistent styling across the application with a focus on readability and modern aesthetics.

## Core Components

### `Button`

A customized button component with various variants:

```jsx
import { Button } from '../components/ui';

// Variants: primary, secondary, ghost, danger
<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="danger">Danger Button</Button>
```

### `Card`

A card component with consistent styling:

```jsx
import { Card } from '../components/ui';

// Basic usage
<Card>Content goes here</Card>

// With title and subtitle
<Card
  title="Card Title"
  subtitle="Optional subtitle"
>
  Content goes here
</Card>

// Interactive card
<Card isHoverable={true} onClick={handleClick}>
  Hoverable card
</Card>

// Selected state
<Card isSelected={true}>
  Selected card
</Card>
```

## Color System

The design system uses a consistent color palette defined in `styles.ts`:

```tsx
import { colors } from "../components/ui";

// Available color categories:
// - colors.brand: Primary brand colors
// - colors.background: Background color variations
// - colors.text: Text color variations
// - colors.border: Border color variations
// - colors.status: Status colors (success, error, warning, info)

// Example usage
<Box bg={colors.background.card} color={colors.text.primary}>
  Content with themed colors
</Box>;
```

## Style Objects

Pre-defined style objects for common components:

```tsx
import {
  buttonStyles,
  cardStyles,
  inputStyles,
  headingStyles,
  badgeStyles,
} from "../components/ui";

// Apply styles to Chakra components
<Box {...cardStyles}>Content in card style</Box>;
```

## Usage Guidelines

1. Always use the UI components from this directory instead of basic Chakra UI components for a consistent look and feel.

2. For custom components, reference the color system from `styles.ts` to maintain visual consistency.

3. When adding new UI components, follow the established pattern of:

   - Using the dark theme color palette
   - Providing hover/active states
   - Implementing appropriate transitions

4. The application is set to always use dark mode through the theme configuration.
