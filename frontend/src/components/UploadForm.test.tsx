import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UploadForm from './UploadForm';
import * as apiClient from '../services/apiClient';
import type { PredictionResult } from '../types';

// Mock the API client
vi.mock('../services/apiClient', () => ({
  predict: vi.fn(),
}));

describe('UploadForm', () => {
  const mockOnUploadSuccess = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<UploadForm onUploadSuccess={mockOnUploadSuccess} />);
    
    expect(screen.getByLabelText(/patient name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/patient age/i)).toBeInTheDocument();
    expect(screen.getByText(/tap to upload/i)).toBeInTheDocument();
    expect(screen.getByText(/secure processing/i)).toBeInTheDocument();
  });

  it('disables submit button when form is incomplete', () => {
    render(<UploadForm onUploadSuccess={mockOnUploadSuccess} />);
    
    const submitButton = screen.getByRole('button', { name: /upload & analyze/i });
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when all fields are filled', async () => {
    render(<UploadForm onUploadSuccess={mockOnUploadSuccess} />);
    
    // Fill in patient name
    const nameInput = screen.getByLabelText(/patient name/i);
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    
    // Fill in patient age
    const ageInput = screen.getByLabelText(/patient age/i);
    fireEvent.change(ageInput, { target: { value: '45' } });
    
    // Add a file
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    if (fileInput) {
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false,
      });
      fireEvent.change(fileInput);
    }
    
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /upload & analyze/i });
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('displays selected filename after file selection', async () => {
    render(<UploadForm onUploadSuccess={mockOnUploadSuccess} />);
    
    const file = new File(['dummy content'], 'brain-scan.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    if (fileInput) {
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false,
      });
      fireEvent.change(fileInput);
    }
    
    await waitFor(() => {
      expect(screen.getByText('brain-scan.png')).toBeInTheDocument();
    });
  });

  it('shows error for invalid file type', async () => {
    render(<UploadForm onUploadSuccess={mockOnUploadSuccess} />);
    
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    if (fileInput) {
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false,
      });
      fireEvent.change(fileInput);
    }
    
    await waitFor(() => {
      expect(screen.getByText(/invalid file type/i)).toBeInTheDocument();
    });
  });

  it('submits form with correct data', async () => {
    const mockResult: PredictionResult = {
      prediction: 'glioma',
      confidence: 0.92,
      probabilities: {
        glioma: 0.92,
        meningioma: 0.05,
        pituitary: 0.02,
        noTumor: 0.01,
      },
      reportUrl: '/api/reports/test.pdf',
      scanId: 'test-123',
    };
    
    vi.mocked(apiClient.predict).mockResolvedValue(mockResult);
    
    render(<UploadForm onUploadSuccess={mockOnUploadSuccess} />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/patient name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/patient age/i), { target: { value: '45' } });
    
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    if (fileInput) {
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false,
      });
      fireEvent.change(fileInput);
    }
    
    // Submit form
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /upload & analyze/i });
      expect(submitButton).not.toBeDisabled();
    });
    
    fireEvent.click(screen.getByRole('button', { name: /upload & analyze/i }));
    
    await waitFor(() => {
      expect(apiClient.predict).toHaveBeenCalled();
      expect(mockOnUploadSuccess).toHaveBeenCalledWith(mockResult);
    });
  });

  it('displays loading state during submission', async () => {
    vi.mocked(apiClient.predict).mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );
    
    render(<UploadForm onUploadSuccess={mockOnUploadSuccess} />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/patient name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/patient age/i), { target: { value: '45' } });
    
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    if (fileInput) {
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false,
      });
      fireEvent.change(fileInput);
    }
    
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /upload & analyze/i });
      expect(submitButton).not.toBeDisabled();
    });
    
    fireEvent.click(screen.getByRole('button', { name: /upload & analyze/i }));
    
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('displays error message on API failure', async () => {
    vi.mocked(apiClient.predict).mockRejectedValue(new Error('Network error'));
    
    render(<UploadForm onUploadSuccess={mockOnUploadSuccess} />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/patient name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/patient age/i), { target: { value: '45' } });
    
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    if (fileInput) {
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false,
      });
      fireEvent.change(fileInput);
    }
    
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /upload & analyze/i });
      expect(submitButton).not.toBeDisabled();
    });
    
    fireEvent.click(screen.getByRole('button', { name: /upload & analyze/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it('prevents duplicate submissions', async () => {
    vi.mocked(apiClient.predict).mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );
    
    render(<UploadForm onUploadSuccess={mockOnUploadSuccess} />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/patient name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/patient age/i), { target: { value: '45' } });
    
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    if (fileInput) {
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false,
      });
      fireEvent.change(fileInput);
    }
    
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /upload & analyze/i });
      expect(submitButton).not.toBeDisabled();
    });
    
    const submitButton = screen.getByRole('button', { name: /upload & analyze/i });
    
    // Click multiple times
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);
    
    // Should only call API once
    await waitFor(() => {
      expect(apiClient.predict).toHaveBeenCalledTimes(1);
    });
  });
});
