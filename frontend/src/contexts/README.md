# Context Providers

This directory contains React Context providers for global state management.

## ThemeContext

The ThemeContext provides dark mode support throughout the application.

### Features

- **Light/Dark Mode Toggle**: Switch between light and dark themes
- **LocalStorage Persistence**: Theme preference is saved and restored across sessions
- **CSS Variables**: Theme colors are defined as CSS variables for easy styling
- **Type-Safe**: Full TypeScript support with proper type definitions

### Requirements

Implements requirements 9.1, 9.2, 9.3, 9.4, 9.5:
- 9.1: Provides a dark mode toggle control
- 9.2: Applies dark color scheme when enabled
- 9.3: Applies light color scheme when disabled
- 9.4: Persists dark mode preference across sessions
- 9.5: Maintains sufficient contrast ratios for accessibility

### Usage

#### 1. Wrap your app with ThemeProvider

```tsx
import { ThemeProvider } from './contexts';

function main() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
```

#### 2. Use the useTheme hook in components

```tsx
import { useTheme } from './contexts';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

#### 3. Use CSS variables for styling

The following CSS variables are available:

**Light Mode:**
- `--bg-primary`: #ffffff (main background)
- `--bg-secondary`: #f8fafc (secondary background)
- `--bg-tertiary`: #f1f5f9 (tertiary background)
- `--text-primary`: #1e293b (primary text)
- `--text-secondary`: #64748b (secondary text)
- `--text-tertiary`: #94a3b8 (tertiary text)
- `--border-primary`: #e2e8f0 (primary border)
- `--border-secondary`: #cbd5e1 (secondary border)
- `--interactive-primary`: #3b82f6 (primary interactive)
- `--interactive-hover`: #2563eb (hover state)
- `--interactive-active`: #1d4ed8 (active state)

**Dark Mode:**
- `--bg-primary`: #0f172a (main background)
- `--bg-secondary`: #1e293b (secondary background)
- `--bg-tertiary`: #334155 (tertiary background)
- `--text-primary`: #f1f5f9 (primary text)
- `--text-secondary`: #cbd5e1 (secondary text)
- `--text-tertiary`: #94a3b8 (tertiary text)
- `--border-primary`: #334155 (primary border)
- `--border-secondary`: #475569 (secondary border)
- `--interactive-primary`: #3b82f6 (primary interactive)
- `--interactive-hover`: #60a5fa (hover state)
- `--interactive-active`: #93c5fd (active state)

**Status Colors (same in both modes):**
- `--success`: #10b981
- `--error`: #ef4444
- `--warning`: #f59e0b
- `--info`: #3b82f6

#### Example with Tailwind CSS

```tsx
<div className="bg-[var(--bg-primary)] text-[var(--text-primary)]">
  <button className="bg-[var(--interactive-primary)] hover:bg-[var(--interactive-hover)]">
    Click me
  </button>
</div>
```

### Implementation Details

- Theme state is managed using React Context API
- Initial theme is loaded from localStorage on mount
- Theme changes are automatically persisted to localStorage
- The theme class ('light' or 'dark') is applied to the document root element
- CSS variables are defined in `src/index.css` with `:root.light` and `:root.dark` selectors

### Files

- `ThemeContext.tsx`: Main implementation of ThemeContext and ThemeProvider
- `ThemeContext.example.tsx`: Example usage and integration guide
- `index.ts`: Exports ThemeProvider and useTheme hook

### See Also

- Type definitions in `src/types/index.ts` (ThemeMode, ThemeContextValue)
- CSS variables in `src/index.css`
