/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ThemeContextValue, ThemeMode } from '../types';

/**
 * Theme Context for managing light/dark mode
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
 */
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = 'cognitive-theme';

/**
 * ThemeProvider component that manages theme state and persistence
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize theme from localStorage or default to 'light'
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'light';
  });

  // Apply theme class to document root and persist to localStorage
  useEffect(() => {
    const root = document.documentElement;
    
    console.log('Theme changed to:', theme);
    console.log('HTML classes before:', root.className);
    
    // For Tailwind with darkMode: 'class', only add 'dark' class when in dark mode
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    console.log('HTML classes after:', root.className);
    
    // Persist to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  /**
   * Toggle between light and dark mode
   * Requirements: 9.1, 9.2, 9.3
   */
  const toggleTheme = () => {
    console.log('Toggle clicked, current theme:', theme);
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      console.log('Switching from', prevTheme, 'to', newTheme);
      return newTheme;
    });
  };

  const value: ThemeContextValue = {
    theme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Custom hook to use theme context
 * Throws error if used outside ThemeProvider
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Export for react-refresh compatibility
export default ThemeProvider;
