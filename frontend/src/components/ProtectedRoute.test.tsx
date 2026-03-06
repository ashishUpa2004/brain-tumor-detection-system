import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

/**
 * ProtectedRoute Component Tests
 * 
 * Tests authentication guard behavior for protected routes.
 * 
 * Requirements: 2.5
 */

describe('ProtectedRoute', () => {
  const TestComponent = () => <div>Protected Content</div>;
  const LoginComponent = () => <div>Login Page</div>;

  const renderProtectedRoute = (isAuthenticated: boolean, initialRoute = '/protected') => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/login" element={<LoginComponent />} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <TestComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders children when authenticated', () => {
    renderProtectedRoute(true);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when not authenticated', () => {
    renderProtectedRoute(false);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('uses custom redirect path when provided', () => {
    const CustomRedirect = () => <div>Custom Redirect</div>;
    
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/custom" element={<CustomRedirect />} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute isAuthenticated={false} redirectTo="/custom">
                <TestComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Custom Redirect')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('defaults to /login redirect path when not specified', () => {
    renderProtectedRoute(false);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});
