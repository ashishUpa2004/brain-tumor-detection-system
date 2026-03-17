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
    <div className="min-h-screen bg-[#0a1628] flex flex-col relative overflow-hidden">
      {/* Background with brain image */}
      <div className="absolute inset-0">
        {/* Brain background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{
            backgroundImage: `url('/brain-bg.png')`,
            filter: 'brightness(0.8) contrast(1.2)'
          }}
        ></div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628]/85 via-[#0d1f35]/80 to-[#0a1628]/85 z-10"></div>
        
        {/* Animated dots */}
        <div className="absolute inset-0 z-20">
          <div className="absolute top-20 left-10 w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-32 left-1/4 w-1 h-1 bg-cyan-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </div>

      {/* Header with tagline */}
      <div className="relative z-30 p-6 md:p-8">
        <p className="text-[#a0b0cc] text-xs md:text-sm tracking-[0.3em] uppercase font-medium">
          REDEFINING NEURAL INTELLIGENCE
        </p>
      </div>

      {/* Main content area */}
      <div className="relative z-30 flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center md:pl-52">
          {/* Left side - Branding and form */}
          <div className="flex flex-col items-center md:items-start space-y-6">
            {/* COGNITIVE heading */}
            <div className="text-center md:text-left space-y-1">
              <div className="flex items-center justify-center md:justify-start">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-cyan-400 tracking-tight leading-none">
                  C
                </h1>
                <div className="inline-block w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 -mx-1 translate-y-1">
                  <Brain3D animate={true} />
                </div>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-cyan-400 tracking-tight leading-none">
                  GNITIVE
                </h1>
              </div>
              <p className="text-base sm:text-lg md:text-xl text-[#94a3b8] font-light tracking-wide">
                Brain Tumor Detection
              </p>
            </div>

            {/* Form container */}
            <div className="w-full max-w-md bg-[#0d1f35]/90 backdrop-blur-sm border-2 border-cyan-500/30 rounded-2xl shadow-2xl p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <ErrorMessage 
                    message={error} 
                    onDismiss={() => setError(null)} 
                  />
                )}

                {isSignupMode && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1.5">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-[#0a1628] border border-cyan-500/30 text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all placeholder-[#94a3b8]"
                      placeholder="Dr. John Doe"
                      required={isSignupMode}
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1.5">
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
                    className={`w-full px-4 py-3 text-sm bg-[#0a1628] border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all text-gray-200 placeholder-[#94a3b8] ${
                      emailError ? 'border-red-500' : 'border-cyan-500/30'
                    }`}
                    placeholder="your.email@example.com"
                    required
                  />
                  {emailError && (
                    <p className="mt-1 text-xs text-red-400">{emailError}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1.5">
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
                    className={`w-full px-4 py-3 text-sm bg-[#0a1628] border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all text-gray-200 placeholder-[#94a3b8] ${
                      passwordError ? 'border-red-500' : 'border-cyan-500/30'
                    }`}
                    placeholder="••••••••"
                    required
                  />
                  {passwordError && (
                    <p className="mt-1 text-xs text-red-400">{passwordError}</p>
                  )}
                  {isSignupMode && !passwordError && (
                    <p className="mt-1 text-xs text-gray-400">
                      Min 8 characters, uppercase, lowercase, number, and special character
                    </p>
                  )}
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl text-sm font-semibold hover:from-cyan-400 hover:to-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-cyan-500/30"
                  >
                    {loading ? (
                      <LoadingSpinner size="small" />
                    ) : (
                      <>
                        {isSignupMode ? 'Sign Up' : 'Log In'}
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={toggleMode}
                    disabled={loading}
                    className="w-full text-cyan-300 text-sm hover:text-cyan-200 transition-colors disabled:opacity-50 py-2"
                  >
                    {isSignupMode ? 'Already have an account? Log In' : 'Need an account? Sign Up'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right side - Brain3D illustration */}
          <div className="hidden md:flex items-center justify-center">
            <div className="transform scale-125">
              <Brain3D animate={true} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-30 p-6 md:p-8 text-center">
        <p className="text-[#a0b0cc] text-xs md:text-sm italic font-medium max-w-2xl mx-auto tracking-wide leading-relaxed">
          "Early detection saves lives - detects before symptoms appear"
        </p>
      </div>
    </div>
  );
}
