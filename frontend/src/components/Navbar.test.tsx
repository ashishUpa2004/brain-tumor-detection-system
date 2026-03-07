import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from './Navbar';
import { ThemeProvider } from '../contexts/ThemeContext';
import type { User } from '../types';

describe('Navbar Component', () => {
  const mockUser: User = {
    id: '1',
    email: 'john.doe@example.com',
    name: 'John Doe',
  };

  const mockOnLogout = vi.fn();

  beforeEach(() => {
    mockOnLogout.mockClear();
    localStorage.clear();
  });

  const renderNavbar = () => {
    return render(
      <ThemeProvider>
        <Navbar user={mockUser} onLogout={mockOnLogout} />
      </ThemeProvider>
    );
  };

  it('displays COGNITIVE logo', () => {
    renderNavbar();
    expect(screen.getByText('COGNITIVE')).toBeInTheDocument();
  });

  it('displays user initials in circular avatar', () => {
    renderNavbar();
    const avatar = screen.getByText('JD');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass('rounded-full');
  });

  it('opens dropdown menu when avatar is clicked', () => {
    renderNavbar();
    const avatarButton = screen.getByLabelText('User menu');
    
    // Dropdown should not be visible initially
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    
    // Click avatar to open dropdown
    fireEvent.click(avatarButton);
    
    // Dropdown should now be visible
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('displays user name and email in dropdown', () => {
    renderNavbar();
    const avatarButton = screen.getByLabelText('User menu');
    
    fireEvent.click(avatarButton);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', () => {
    renderNavbar();
    const avatarButton = screen.getByLabelText('User menu');
    
    // Open dropdown
    fireEvent.click(avatarButton);
    expect(screen.getByText('Profile')).toBeInTheDocument();
    
    // Click outside
    fireEvent.mouseDown(document.body);
    
    // Dropdown should be closed
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });

  it('calls onLogout when Logout is clicked', () => {
    renderNavbar();
    const avatarButton = screen.getByLabelText('User menu');
    
    // Open dropdown
    fireEvent.click(avatarButton);
    
    // Click Logout
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });

  it('displays dark mode toggle button', () => {
    renderNavbar();
    const toggleButton = screen.getByLabelText('Toggle dark mode');
    expect(toggleButton).toBeInTheDocument();
  });

  it('toggles theme when dark mode button is clicked', () => {
    renderNavbar();
    const toggleButton = screen.getByLabelText('Toggle dark mode');
    
    // Initial theme should be light
    expect(document.documentElement.classList.contains('light')).toBe(true);
    
    // Click to toggle to dark
    fireEvent.click(toggleButton);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    
    // Click to toggle back to light
    fireEvent.click(toggleButton);
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });

  it('handles single-word names correctly', () => {
    const singleNameUser: User = {
      id: '2',
      email: 'madonna@example.com',
      name: 'Madonna',
    };

    render(
      <ThemeProvider>
        <Navbar user={singleNameUser} onLogout={mockOnLogout} />
      </ThemeProvider>
    );

    expect(screen.getByText('M')).toBeInTheDocument();
  });

  it('handles names with more than two words', () => {
    const longNameUser: User = {
      id: '3',
      email: 'john.smith@example.com',
      name: 'John Michael Smith',
    };

    render(
      <ThemeProvider>
        <Navbar user={longNameUser} onLogout={mockOnLogout} />
      </ThemeProvider>
    );

    // Should only show first two initials
    expect(screen.getByText('JM')).toBeInTheDocument();
  });
});
