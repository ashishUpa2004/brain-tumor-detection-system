/**
 * Example usage of ThemeProvider and useTheme hook
 * 
 * This file demonstrates how to integrate the theme provider into your application.
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
 */

import { ThemeProvider, useTheme } from './ThemeContext';

/**
 * Example component that uses the theme context
 */
function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded-lg bg-interactive-primary text-white hover:bg-interactive-hover"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  );
}

/**
 * Example App component wrapped with ThemeProvider
 */
function ExampleApp() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200">
        <header className="p-4 border-b border-[var(--border-primary)]">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">COGNITIVE</h1>
            <ThemeToggleButton />
          </div>
        </header>
        
        <main className="container mx-auto p-4">
          <div className="bg-[var(--bg-secondary)] p-6 rounded-lg border border-[var(--border-primary)]">
            <h2 className="text-xl font-semibold mb-4">Theme Example</h2>
            <p className="text-[var(--text-secondary)] mb-4">
              This demonstrates the theme provider with CSS variables.
            </p>
            <div className="space-y-2">
              <div className="p-3 bg-[var(--bg-tertiary)] rounded">
                Primary Background
              </div>
              <div className="p-3 bg-[var(--interactive-primary)] text-white rounded">
                Interactive Primary
              </div>
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default ExampleApp;

/**
 * Integration Instructions:
 * 
 * 1. Wrap your root App component with ThemeProvider in main.tsx:
 * 
 *    import { ThemeProvider } from './contexts';
 *    
 *    createRoot(document.getElementById('root')!).render(
 *      <StrictMode>
 *        <ThemeProvider>
 *          <App />
 *        </ThemeProvider>
 *      </StrictMode>
 *    );
 * 
 * 2. Use the useTheme hook in any component:
 * 
 *    import { useTheme } from './contexts';
 *    
 *    function MyComponent() {
 *      const { theme, toggleTheme } = useTheme();
 *      // Use theme and toggleTheme as needed
 *    }
 * 
 * 3. Use CSS variables in your components:
 * 
 *    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)]">
 *      Content
 *    </div>
 * 
 * 4. The theme preference is automatically persisted to localStorage
 *    and will be restored on page reload.
 */
