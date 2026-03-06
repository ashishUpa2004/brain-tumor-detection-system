# Shared Components

This directory contains reusable UI components used throughout the COGNITIVE Tumor Detection application.

## Components

### LoadingSpinner

Displays an animated loading indicator with optional message and size variants.

**Requirements:** 12.1

**Props:**
- `size?: 'small' | 'medium' | 'large'` - Size of the spinner (default: 'medium')
- `message?: string` - Optional loading message to display

**Example:**
```tsx
import { LoadingSpinner } from './components';

// Basic usage
<LoadingSpinner />

// With message
<LoadingSpinner size="large" message="Processing MRI scan..." />
```

### ErrorMessage

Displays error messages with dismiss functionality and appropriate error styling. Supports dark mode and auto-clears on new user actions.

**Requirements:** 12.2, 12.3, 12.4

**Props:**
- `message: string` - The error message to display
- `onDismiss?: () => void` - Optional callback when dismiss button is clicked

**Example:**
```tsx
import { ErrorMessage } from './components';

// Basic usage
<ErrorMessage message="Failed to upload MRI scan. Please try again." />

// With dismiss handler
<ErrorMessage 
  message="Authentication failed. Invalid credentials." 
  onDismiss={() => setError(null)} 
/>
```

**Features:**
- Accessible with ARIA attributes (role="alert", aria-live="polite")
- Dark mode support
- Error icon for visual clarity
- Optional dismiss button
- Responsive design
- Appropriate error colors (red theme)

## Usage

All components are exported from the index file:

```tsx
import { LoadingSpinner, ErrorMessage } from './components';
```

## Styling

Components use Tailwind CSS for styling and support both light and dark modes. The color scheme follows the application's design system:

- Primary blue: #3B82F6
- Error red: Red color palette (50-900)
- Text colors: Gray palette with dark mode variants
