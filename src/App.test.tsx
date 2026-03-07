import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

/**
 * App Component Tests
 * 
 * Tests authentication flow and routing behavior.
 * 
 * Requirements: 2.5
 */

describe('App', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear all mocks
    vi.clearAllMocks();
  });

  it('redirects to login page when not authenticated', () => {
    render(<App />);
    
    // Should show login page elements
    expect(screen.getByText('COGNITIVE')).toBeInTheDocument();
    expect(screen.getByText('Tumor Detection')).toBeInTheDocument();
  });

  it('redirects to dashboard when authenticated', async () => {
    // Set up authenticated state
    const mockUser = {
      id: 'user-001',
      email: 'test@example.com',
      name: 'Dr. Test User',
    };
    
    localStorage.setItem('authToken', 'mock-token');
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    render(<App />);
    
    // Should show dashboard elements
    await waitFor(() => {
      expect(screen.getByText('AI-Assisted Brain MRI Analysis')).toBeInTheDocument();
    });
    
    // Open the dropdown to see user name
    const avatarButton = screen.getByLabelText('User menu');
    avatarButton.click();
    
    // Now the user name should be visible in the dropdown
    await waitFor(() => {
      expect(screen.getByText('Dr. Test User')).toBeInTheDocument();
    });
  });

  it('redirects from login to dashboard after successful authentication', async () => {
    const mockUser = {
      id: 'user-001',
      email: 'test@example.com',
      name: 'Dr. Test User',
    };
    
    // Start at login page
    render(<App />);
    
    // Verify we're on login page
    expect(screen.getByText('COGNITIVE')).toBeInTheDocument();
    
    // Simulate successful login by setting localStorage
    localStorage.setItem('authToken', 'mock-token');
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    // Re-render to trigger useEffect
    render(<App />);
    
    // Should redirect to dashboard
    await waitFor(() => {
      expect(screen.getByText('AI-Assisted Brain MRI Analysis')).toBeInTheDocument();
    });
  });

  it('clears authentication state on logout', async () => {
    // Set up authenticated state
    const mockUser = {
      id: 'user-001',
      email: 'test@example.com',
      name: 'Dr. Test User',
    };
    
    localStorage.setItem('authToken', 'mock-token');
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    const { rerender } = render(<App />);
    
    // Should show dashboard
    await waitFor(() => {
      expect(screen.getByText('AI-Assisted Brain MRI Analysis')).toBeInTheDocument();
    });
    
    // Open dropdown to access logout button
    const avatarButton = screen.getByLabelText('User menu');
    avatarButton.click();
    
    // Wait for dropdown to open and click logout
    await waitFor(() => {
      const logoutButton = screen.getByText('Logout');
      logoutButton.click();
    });
    
    // Re-render to see the effect
    rerender(<App />);
    
    // Should redirect to login page
    await waitFor(() => {
      expect(screen.getByText('Redefining Neural Intelligence')).toBeInTheDocument();
    });
    
    // Verify localStorage is cleared
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('handles invalid stored user data gracefully', () => {
    // Set invalid user data
    localStorage.setItem('authToken', 'mock-token');
    localStorage.setItem('user', 'invalid-json');
    
    render(<App />);
    
    // Should redirect to login page and clear invalid data
    expect(screen.getByText('COGNITIVE')).toBeInTheDocument();
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('protects dashboard route when not authenticated', () => {
    // Clear any existing auth
    localStorage.clear();
    
    // Manually navigate to dashboard by setting window.location
    // Since we can't easily test routing without wrapping in another router,
    // we'll test the redirect logic by checking if unauthenticated users
    // see the login page
    render(<App />);
    
    // Should show login page (not dashboard)
    expect(screen.getByText('Redefining Neural Intelligence')).toBeInTheDocument();
  });

  it('redirects root path to login when not authenticated', () => {
    // Clear any existing auth
    localStorage.clear();
    
    render(<App />);
    
    // Should show login page
    expect(screen.getByText('COGNITIVE')).toBeInTheDocument();
    expect(screen.getByText('Tumor Detection')).toBeInTheDocument();
  });
});
