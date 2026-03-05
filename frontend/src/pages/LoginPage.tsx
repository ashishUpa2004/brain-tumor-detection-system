import { useState } from 'react';
import Brain3D from '../components/Brain3D';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { validateEmail, validatePasswordStrength } from '../utils/validation';
import { login, signup } from '../services/apiClient';
import type { LoginPageProps } from '../types';

/**
 * LoginPage Component
 * 
 * Authentication page with gradient background, 3D brain illustration,
 * and clean form design for login and signup.
 * Mobile-optimized with responsive layouts and touch-friendly interactions.
 * 
 * Requirements: 1.1, 1.2, 1.5, 1.6, 1.7, 1.8, 1.9, 2.1, 2.2, 2.3, 2.4, 2.5, 10.1, 10.2, 10.3, 11.4
 */
export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError(null);
    }
  };

  const handlePasswordBlur = () => {
    if (password) {
      const validation = validatePasswordStrength(password);
      if (!validation.isValid) {
        setPasswordError(validation.errors[0]);
      } else {
        setPasswordError(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate email
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate password
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors[0]);
      return;
    }

    // Validate name for signup
    if (isSignupMode && !name.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);

    try {
      if (isSignupMode) {
        const response = await signup({ email, password, name });
        localStorage.setItem('authToken', response.token);
        onLoginSuccess(response.token);
      } else {
        const response = await login({ email, password });
        localStorage.setItem('authToken', response.token);
        onLoginSuccess(response.token);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignupMode(!isSignupMode);
    setError(null);
    setEmailError(null);
    setPasswordError(null);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col transition-colors">
      {/* Header with tagline */}
      <div className="p-4 sm:p-6 md:p-8">
        <p className="text-[#94A3B8] dark:text-gray-400 text-xs sm:text-sm md:text-base font-light tracking-wide">
          Redefining Neural Intelligence
        </p>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center px-4 py-6 sm:py-8">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
          {/* Left side - Branding and form */}
          <div className="flex flex-col items-center md:items-start space-y-6 sm:space-y-8">
            {/* COGNITIVE heading with subtitle */}
            <div className="text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#1E293B] dark:text-gray-100 tracking-tight">
                COGNITIVE
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl text-[#64748B] dark:text-gray-400 italic font-serif mt-2">
                Tumor Detection
              </p>
            </div>

            {/* Form container - white rounded card */}
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 transition-colors">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Error message display */}
                {error && (
                  <ErrorMessage 
                    message={error} 
                    onDismiss={() => setError(null)} 
                  />
                )}

                {/* Name input (signup only) - Touch-friendly */}
                {isSignupMode && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#1E293B] dark:text-gray-100 mb-2">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 min-h-[44px] text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all touch-manipulation bg-white dark:bg-gray-700 text-[#1E293B] dark:text-gray-100"
                      placeholder="Dr. John Doe"
                      required={isSignupMode}
                    />
                  </div>
                )}

                {/* Email input with validation - Touch-friendly */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#1E293B] dark:text-gray-100 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError(null);
                    }}
                    onBlur={handleEmailBlur}
                    className={`w-full px-4 py-3 min-h-[44px] text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all touch-manipulation bg-white dark:bg-gray-700 text-[#1E293B] dark:text-gray-100 ${
                      emailError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="your.email@example.com"
                    required
                  />
                  {emailError && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{emailError}</p>
                  )}
                </div>

                {/* Password input with validation - Touch-friendly */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-[#1E293B] dark:text-gray-100 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError(null);
                    }}
                    onBlur={handlePasswordBlur}
                    className={`w-full px-4 py-3 min-h-[44px] text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all touch-manipulation bg-white dark:bg-gray-700 text-[#1E293B] dark:text-gray-100 ${
                      passwordError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="••••••••"
                    required
                  />
                  {passwordError && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{passwordError}</p>
                  )}
                  {isSignupMode && !passwordError && (
                    <p className="mt-1 text-xs text-[#64748B] dark:text-gray-400">
                      Min 8 characters, uppercase, lowercase, number, and special character
                    </p>
                  )}
                </div>

                {/* Submit buttons - Touch-friendly (min 44x44px) */}
                <div className="space-y-3">
                  {/* Login/Signup button - soft blue */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#3B82F6] text-white py-3 min-h-[44px] rounded-lg font-medium hover:bg-[#2563EB] active:bg-[#1d4ed8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center touch-manipulation"
                  >
                    {loading ? (
                      <LoadingSpinner size="small" />
                    ) : (
                      isSignupMode ? 'Sign Up' : 'Log In'
                    )}
                  </button>

                  {/* Toggle mode button - outlined border */}
                  <button
                    type="button"
                    onClick={toggleMode}
                    disabled={loading}
                    className="w-full bg-white dark:bg-gray-800 text-[#3B82F6] dark:text-blue-400 py-3 min-h-[44px] rounded-lg font-medium border-2 border-[#3B82F6] dark:border-blue-400 hover:bg-[#EFF6FF] dark:hover:bg-gray-700 active:bg-blue-100 dark:active:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base touch-manipulation"
                  >
                    {isSignupMode ? 'Already have an account? Log In' : 'Need an account? Sign Up'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right side - Brain3D illustration (hidden on mobile < 768px) */}
          <div className="hidden md:flex items-center justify-center h-64 md:h-96">
            <Brain3D animate={true} />
          </div>
        </div>
      </div>

      {/* Footer with inspirational quote */}
      <div className="p-4 sm:p-6 md:p-8 text-center">
        <p className="text-[#94A3B8] dark:text-gray-400 text-xs sm:text-sm md:text-base italic font-light max-w-2xl mx-auto px-4">
          "Early detection saves lives. Every scan brings us closer to a future where brain tumors are detected before symptoms appear."
        </p>
      </div>
    </div>
  );
}
