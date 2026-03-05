import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import type { User } from '../types';

/**
 * Navbar Component
 * 
 * Navigation bar with logo, user avatar dropdown, and dark mode toggle.
 * Mobile-optimized with touch-friendly interactions.
 * Requirements: 3.1, 3.2, 3.3, 9.1, 10.2
 */

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  // Get user initials from name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleProfileClick = () => {
    // TODO: Navigate to profile page when implemented
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    onLogout();
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 transition-colors">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-[#3B82F6] dark:text-blue-400">
            COGNITIVE
          </h1>
        </div>

        {/* Right side: Dark mode toggle and User avatar */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Dark Mode Toggle - Touch-friendly (min 44x44px) */}
          <button
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-colors touch-manipulation"
            aria-label="Toggle dark mode"
          >
            {theme === 'light' ? (
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            )}
          </button>

          {/* User Avatar with Dropdown - Touch-friendly */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 sm:space-x-3 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] rounded-lg p-1 min-h-[44px] touch-manipulation"
              aria-label="User menu"
              aria-expanded={isDropdownOpen}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#3B82F6] dark:bg-blue-500 flex items-center justify-center text-white font-semibold text-sm sm:text-base transition-colors">
                {getInitials(user.name)}
              </div>
            </button>

            {/* Dropdown Menu - Touch-optimized */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-[#1E293B] dark:text-gray-200 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-[#64748B] dark:text-gray-400 truncate mt-1">
                    {user.email}
                  </p>
                </div>

                {/* Menu Items - Touch-friendly (min 44px height) */}
                <button
                  onClick={handleProfileClick}
                  className="w-full text-left px-4 py-3 min-h-[44px] text-sm text-[#1E293B] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-colors touch-manipulation"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogoutClick}
                  className="w-full text-left px-4 py-3 min-h-[44px] text-sm text-[#1E293B] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-colors touch-manipulation"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
