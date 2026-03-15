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
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 px-4 sm:px-6 py-4 sm:py-6 transition-colors z-50">
      <div className="flex justify-between items-center">
        {/* Left: Logo with subtitle */}
        <div className="flex flex-col items-start">
          <div className="flex items-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3B82F6] dark:text-blue-400">
              C
            </h1>
            
            {/* Brain icon replacing "O" - Larger size */}
            <svg
              viewBox="0 0 200 200"
              className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 -mx-0.5"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Main brain shape */}
              <path
                d="M100 20 C120 20, 140 30, 150 50 C160 70, 165 90, 160 110 C155 130, 145 145, 130 155 C115 165, 100 170, 85 165 C70 160, 55 150, 45 135 C35 120, 30 100, 35 80 C40 60, 55 40, 75 30 C85 25, 92 20, 100 20 Z"
                fill="none"
                stroke="#1E40AF"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <animate
                  attributeName="stroke"
                  values="#1E40AF;#0891B2;#1E40AF"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </path>

              {/* Brain hemisphere division */}
              <path
                d="M100 20 Q100 100, 100 170"
                fill="none"
                stroke="#1E40AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="5,5"
                opacity="0.7"
              >
                <animate
                  attributeName="stroke"
                  values="#1E40AF;#0891B2;#1E40AF"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </path>

              {/* Tumor highlight area - pulsing red circle */}
              <circle
                cx="120"
                cy="80"
                r="8"
                fill="#DC2626"
                opacity="0.8"
              >
                <animate
                  attributeName="r"
                  values="8;10;8"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.7;0.9;0.7"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3B82F6] dark:text-blue-400">
              GNITIVE
            </h1>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-white italic font-bold mt-1" style={{ fontFamily: 'Georgia, serif' }}>
            a brain tumor detection system
          </p>
        </div>

        {/* Right side: Dark mode toggle and User avatar - Bigger */}
        <div className="flex items-center space-x-3 sm:space-x-6">
          {/* Dark Mode Toggle - Touch-friendly and bigger */}
          <button
            onClick={toggleTheme}
            className="p-3 sm:p-4 min-h-[56px] min-w-[56px] flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-colors touch-manipulation"
            aria-label="Toggle dark mode"
          >
            {theme === 'light' ? (
              <svg
                className="w-7 h-7 sm:w-8 sm:h-8 text-gray-600 dark:text-gray-300"
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
                className="w-7 h-7 sm:w-8 sm:h-8 text-gray-300"
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

          {/* User Avatar with Dropdown - Touch-friendly and bigger */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 sm:space-x-3 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] rounded-lg p-1 min-h-[56px] touch-manipulation"
              aria-label="User menu"
              aria-expanded={isDropdownOpen}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#3B82F6] dark:bg-blue-500 flex items-center justify-center text-white font-semibold text-lg sm:text-xl transition-colors">
                {getInitials(user.name)}
              </div>
            </button>

            {/* Dropdown Menu - Touch-optimized and bigger */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-96 sm:w-[28rem] bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-4 z-50">
                {/* User Info */}
                <div className="px-10 py-8 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-2xl font-medium text-[#1E293B] dark:text-gray-200 truncate">
                    {user.name}
                  </p>
                  <p className="text-xl text-[#64748B] dark:text-gray-400 truncate mt-3">
                    {user.email}
                  </p>
                </div>

                {/* Menu Items - Touch-friendly and bigger */}
                <button
                  onClick={handleProfileClick}
                  className="w-full text-left px-10 py-8 min-h-[72px] text-2xl text-[#1E293B] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-colors touch-manipulation"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogoutClick}
                  className="w-full text-left px-10 py-8 min-h-[72px] text-2xl text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-colors touch-manipulation"
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
