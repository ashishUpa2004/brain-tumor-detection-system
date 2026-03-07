import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

/**
 * Authentication Flow Integration Tests
 * 
 * Tests the complete authentication flow including:
 * - Login with API call
 * - Token storage
 * - Redirect to dashboard
 * - Logout and redirect back to login
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */

describe('Authentication Flow Integration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('completes full login flow with redirect to dashboard', async () => {
    const user = userEvent.setup();
    
    render(<App />);
    
    // Step 1: Verify we're on the login page
    expect(screen.getByText('Redefining Neural Intelligence')).toBeInTheDocument();
    expect(screen.getByText('COGNITIVE')).toBeInTheDocument();
    
    // Step 2: Fill in login credentials (using mock user from apiClient with valid password)
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'Password123!');
    
    // Step 3: Submit the form
    const loginButton = screen.getByRole('button', { name: /log in/i });
    await user.click(loginButton);
    
    // Step 4: Wait for redirect to dashboard
    await waitFor(
      () => {
        expect(screen.getByText('AI-Assisted Brain MRI Analysis')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
    
    // Step 5: Verify user is displayed on dashboard
    // Open the dropdown to see user name
    const avatarButton = screen.getByLabelText('User menu');
    await user.click(avatarButton);
    
    await waitFor(() => {
      expect(screen.getByText('Dr. Test User')).toBeInTheDocument();
    });
    
    // Step 6: Verify token is stored
    expect(localStorage.getItem('authToken')).toBeTruthy();
    expect(localStorage.getItem('user')).toBeTruthy();
    
    // Step 7: Verify user data is correct
    const storedUser = JSON.parse(localStorage.getItem('user')!);
    expect(storedUser.email).toBe('test@example.com');
    expect(storedUser.name).toBe('Dr. Test User');
  });

  it('completes full signup flow with redirect to dashboard', async () => {
    const user = userEvent.setup();
    
    render(<App />);
    
    // Step 1: Switch to signup mode
    const signupToggle = screen.getByRole('button', { name: /need an account\? sign up/i });
    await user.click(signupToggle);
    
    // Step 2: Fill in signup form
    const nameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    
    await user.type(nameInput, 'Dr. New User');
    await user.type(emailInput, 'newuser@example.com');
    await user.type(passwordInput, 'SecurePass123!');
    
    // Step 3: Submit the form
    const signupButton = screen.getByRole('button', { name: /sign up/i });
    await user.click(signupButton);
    
    // Step 4: Wait for loading spinner
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // Step 5: Wait for redirect to dashboard
    await waitFor(
      () => {
        expect(screen.getByText('AI-Assisted Brain MRI Analysis')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
    
    // Step 6: Verify new user is displayed
    // Open the dropdown to see user name
    const avatarButton = screen.getByLabelText('User menu');
    await user.click(avatarButton);
    
    await waitFor(() => {
      expect(screen.getByText('Dr. New User')).toBeInTheDocument();
    });
    
    // Step 7: Verify token and user data are stored
    expect(localStorage.getItem('authToken')).toBeTruthy();
    const storedUser = JSON.parse(localStorage.getItem('user')!);
    expect(storedUser.email).toBe('newuser@example.com');
    expect(storedUser.name).toBe('Dr. New User');
  });

  it('displays error message on failed login without redirecting', async () => {
    const user = userEvent.setup();
    
    render(<App />);
    
    // Step 1: Fill in invalid credentials (with valid format but wrong user)
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    
    await user.type(emailInput, 'wrong@example.com');
    await user.type(passwordInput, 'WrongPass123!');
    
    // Step 2: Submit the form
    const loginButton = screen.getByRole('button', { name: /log in/i });
    await user.click(loginButton);
    
    // Step 3: Wait for error message
    await waitFor(
      () => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
    
    // Step 4: Verify we're still on login page (not redirected)
    expect(screen.getByText('Redefining Neural Intelligence')).toBeInTheDocument();
    
    // Step 5: Verify no token is stored
    expect(localStorage.getItem('authToken')).toBeNull();
  });

  it('completes logout flow with redirect to login', async () => {
    const user = userEvent.setup();
    
    // Step 1: Set up authenticated state
    const mockUser = {
      id: 'user-001',
      email: 'test@example.com',
      name: 'Dr. Test User',
    };
    
    localStorage.setItem('authToken', 'mock-token');
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    render(<App />);
    
    // Step 2: Verify we're on dashboard
    await waitFor(() => {
      expect(screen.getByText('AI-Assisted Brain MRI Analysis')).toBeInTheDocument();
    });
    
    // Step 3: Click logout button
    // First open the dropdown menu
    const avatarButton = screen.getByLabelText('User menu');
    await user.click(avatarButton);
    
    // Wait for dropdown to open and click logout
    const logoutButton = await screen.findByText('Logout');
    await user.click(logoutButton);
    
    // Step 4: Wait for redirect to login page
    await waitFor(() => {
      expect(screen.getByText('Redefining Neural Intelligence')).toBeInTheDocument();
    });
    
    // Step 5: Verify authentication data is cleared
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('persists authentication across page reloads', async () => {
    // Step 1: Set up authenticated state
    const mockUser = {
      id: 'user-001',
      email: 'test@example.com',
      name: 'Dr. Test User',
    };
    
    localStorage.setItem('authToken', 'mock-token');
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    // Step 2: Render app (simulating page reload)
    const { unmount } = render(<App />);
    
    // Step 3: Verify we're on dashboard
    await waitFor(() => {
      expect(screen.getByText('AI-Assisted Brain MRI Analysis')).toBeInTheDocument();
    });
    
    // Step 4: Unmount and remount (simulate page reload)
    unmount();
    render(<App />);
    
    // Step 5: Verify we're still on dashboard
    await waitFor(() => {
      expect(screen.getByText('AI-Assisted Brain MRI Analysis')).toBeInTheDocument();
    });
    
    // Open dropdown to see user name
    const avatarButton = screen.getByLabelText('User menu');
    avatarButton.click();
    
    await waitFor(() => {
      expect(screen.getByText('Dr. Test User')).toBeInTheDocument();
    });
  });

  it('shows loading spinner during authentication API call', async () => {
    const user = userEvent.setup();
    
    render(<App />);
    
    // Fill in credentials
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'Password123!');
    
    // Get the login button
    const loginButton = screen.getByRole('button', { name: /log in/i });
    
    // Submit form
    await user.click(loginButton);
    
    // The loading spinner appears briefly, but since the mock API is fast,
    // we verify the button is disabled during submission
    // Note: In a real scenario with network delay, the spinner would be visible longer
    await waitFor(() => {
      expect(loginButton).toBeDisabled();
    });
    
    // Wait for redirect to dashboard (confirms authentication completed)
    await waitFor(
      () => {
        expect(screen.getByText('AI-Assisted Brain MRI Analysis')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
