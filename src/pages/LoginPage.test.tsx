import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './LoginPage';
import * as apiClient from '../services/apiClient';

// Mock the API client
vi.mock('../services/apiClient', () => ({
  login: vi.fn(),
  signup: vi.fn(),
}));

describe('LoginPage', () => {
  const mockOnLoginSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders the tagline "Redefining Neural Intelligence"', () => {
    render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
    expect(screen.getByText('Redefining Neural Intelligence')).toBeInTheDocument();
  });

  it('renders the COGNITIVE heading', () => {
    render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
    expect(screen.getByText('COGNITIVE')).toBeInTheDocument();
  });

  it('renders the "Tumor Detection" subtitle', () => {
    render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
    expect(screen.getByText('Tumor Detection')).toBeInTheDocument();
  });

  it('renders the inspirational quote at the bottom', () => {
    render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
    expect(
      screen.getByText(/Early detection saves lives/i)
    ).toBeInTheDocument();
  });

  it('renders the white rounded card container', () => {
    const { container } = render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
    const card = container.querySelector('.bg-white.rounded-2xl');
    expect(card).toBeInTheDocument();
  });

  it('applies gradient background', () => {
    const { container } = render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('bg-gradient-to-br', 'from-white', 'to-blue-50');
  });

  describe('Login Form', () => {
    it('renders email and password input fields', () => {
      render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('renders login button with soft blue color', () => {
      render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
      const loginButton = screen.getByRole('button', { name: /log in/i });
      expect(loginButton).toBeInTheDocument();
      expect(loginButton).toHaveClass('bg-[#3B82F6]');
    });

    it('renders signup toggle button with outlined border', () => {
      render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
      const signupButton = screen.getByRole('button', { name: /need an account\? sign up/i });
      expect(signupButton).toBeInTheDocument();
      expect(signupButton).toHaveClass('border-2', 'border-[#3B82F6]');
    });

    it('validates email format on blur', async () => {
      render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
      const emailInput = screen.getByLabelText(/email address/i);
      
      await userEvent.type(emailInput, 'invalid-email');
      fireEvent.blur(emailInput);
      
      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      });
    });

    it('validates password strength on blur', async () => {
      render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
      const passwordInput = screen.getByLabelText(/password/i);
      
      await userEvent.type(passwordInput, 'weak');
      fireEvent.blur(passwordInput);
      
      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      });
    });

    it('submits login form with valid credentials', async () => {
      const mockResponse = {
        token: 'mock-token',
        user: { id: '1', email: 'test@example.com', name: 'Test User' },
      };
      vi.mocked(apiClient.login).mockResolvedValue(mockResponse);

      render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /log in/i });

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'Password123!');
      await userEvent.click(loginButton);

      await waitFor(() => {
        expect(apiClient.login).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'Password123!',
        });
        expect(mockOnLoginSuccess).toHaveBeenCalledWith('mock-token');
        expect(localStorage.getItem('authToken')).toBe('mock-token');
      });
    });

    it('displays error message on login failure', async () => {
      vi.mocked(apiClient.login).mockRejectedValue(new Error('Invalid credentials'));

      render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /log in/i });

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'Password123!');
      await userEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });

    it('shows loading spinner during login', async () => {
      vi.mocked(apiClient.login).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
      
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /log in/i });

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'Password123!');
      await userEvent.click(loginButton);

      expect(loginButton).toBeDisabled();
    });
  });

  describe('Signup Form', () => {
    it('toggles to signup mode when signup button is clicked', async () => {
      render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
      
      const signupToggle = screen.getByRole('button', { name: /need an account\? sign up/i });
      await userEvent.click(signupToggle);

      expect(screen.getByRole('button', { name: /^sign up$/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    });

    it('renders name input field in signup mode', async () => {
      render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
      
      const signupToggle = screen.getByRole('button', { name: /need an account\? sign up/i });
      await userEvent.click(signupToggle);

      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    });

    it('submits signup form with valid data', async () => {
      const mockResponse = {
        token: 'mock-token',
        user: { id: '1', email: 'newuser@example.com', name: 'New User' },
      };
      vi.mocked(apiClient.signup).mockResolvedValue(mockResponse);

      render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
      
      const signupToggle = screen.getByRole('button', { name: /need an account\? sign up/i });
      await userEvent.click(signupToggle);

      const nameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const signupButton = screen.getByRole('button', { name: /^sign up$/i });

      await userEvent.type(nameInput, 'New User');
      await userEvent.type(emailInput, 'newuser@example.com');
      await userEvent.type(passwordInput, 'Password123!');
      await userEvent.click(signupButton);

      await waitFor(() => {
        expect(apiClient.signup).toHaveBeenCalledWith({
          email: 'newuser@example.com',
          password: 'Password123!',
          name: 'New User',
        });
        expect(mockOnLoginSuccess).toHaveBeenCalledWith('mock-token');
        expect(localStorage.getItem('authToken')).toBe('mock-token');
      });
    });

    it('displays password requirements hint in signup mode', async () => {
      render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
      
      const signupToggle = screen.getByRole('button', { name: /need an account\? sign up/i });
      await userEvent.click(signupToggle);

      const passwordInput = screen.getByLabelText(/password/i);
      await userEvent.type(passwordInput, 'P');

      expect(screen.getByText(/min 8 characters/i)).toBeInTheDocument();
    });

    it('toggles back to login mode', async () => {
      render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
      
      const signupToggle = screen.getByRole('button', { name: /need an account\? sign up/i });
      await userEvent.click(signupToggle);

      const loginToggle = screen.getByRole('button', { name: /already have an account\? log in/i });
      await userEvent.click(loginToggle);

      expect(screen.getByRole('button', { name: /^log in$/i })).toBeInTheDocument();
      expect(screen.queryByLabelText(/full name/i)).not.toBeInTheDocument();
    });
  });
});
