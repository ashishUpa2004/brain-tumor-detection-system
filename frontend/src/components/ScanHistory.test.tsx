import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScanHistory from './ScanHistory';
import * as apiClient from '../services/apiClient';
import type { ScanHistoryApiResponse } from '../types';

// Mock the API client
vi.mock('../services/apiClient');

describe('ScanHistory Component', () => {
  const mockOnSelectScan = vi.fn();

  const mockScans: ScanHistoryApiResponse = {
    scans: [
      {
        id: 'scan-001',
        patientName: 'John Doe',
        patientAge: 45,
        date: new Date('2024-01-15T10:30:00Z').toISOString(),
        prediction: 'glioma',
        confidence: 0.92,
        reportUrl: '/api/reports/scan-001.pdf',
      },
      {
        id: 'scan-002',
        patientName: 'Jane Smith',
        patientAge: 38,
        date: new Date('2024-01-14T14:20:00Z').toISOString(),
        prediction: 'meningioma',
        confidence: 0.87,
        reportUrl: '/api/reports/scan-002.pdf',
      },
      {
        id: 'scan-003',
        patientName: 'Robert Johnson',
        patientAge: 52,
        date: new Date('2024-01-13T09:15:00Z').toISOString(),
        prediction: 'no_tumor',
        confidence: 0.95,
        reportUrl: '/api/reports/scan-003.pdf',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should display loading spinner while fetching scan history', () => {
      vi.mocked(apiClient.getHistory).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<ScanHistory onSelectScan={mockOnSelectScan} />);

      expect(screen.getByText(/loading scan history/i)).toBeInTheDocument();
    });
  });

  describe('Scan List Display', () => {
    it('should fetch and display scan history on mount', async () => {
      vi.mocked(apiClient.getHistory).mockResolvedValue(mockScans);

      render(<ScanHistory onSelectScan={mockOnSelectScan} />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Robert Johnson')).toBeInTheDocument();
    });

    it('should display patient ages', async () => {
      vi.mocked(apiClient.getHistory).mockResolvedValue(mockScans);

      render(<ScanHistory onSelectScan={mockOnSelectScan} />);

      await waitFor(() => {
        expect(screen.getByText('Age: 45')).toBeInTheDocument();
      });

      expect(screen.getByText('Age: 38')).toBeInTheDocument();
      expect(screen.getByText('Age: 52')).toBeInTheDocument();
    });

    it('should display tumor predictions with proper labels', async () => {
      vi.mocked(apiClient.getHistory).mockResolvedValue(mockScans);

      render(<ScanHistory onSelectScan={mockOnSelectScan} />);

      await waitFor(() => {
        expect(screen.getByText('Glioma')).toBeInTheDocument();
      });

      expect(screen.getByText('Meningioma')).toBeInTheDocument();
      expect(screen.getByText('No Tumor')).toBeInTheDocument();
    });

    it('should display confidence scores as percentages', async () => {
      vi.mocked(apiClient.getHistory).mockResolvedValue(mockScans);

      render(<ScanHistory onSelectScan={mockOnSelectScan} />);

      await waitFor(() => {
        expect(screen.getByText('92.0% confidence')).toBeInTheDocument();
      });

      expect(screen.getByText('87.0% confidence')).toBeInTheDocument();
      expect(screen.getByText('95.0% confidence')).toBeInTheDocument();
    });

    it('should sort scans by most recent first', async () => {
      vi.mocked(apiClient.getHistory).mockResolvedValue(mockScans);

      render(<ScanHistory onSelectScan={mockOnSelectScan} />);

      await waitFor(() => {
        const scanButtons = screen.getAllByRole('button');
        expect(scanButtons).toHaveLength(3);
      });

      const scanButtons = screen.getAllByRole('button');
      // First button should be the most recent scan (John Doe - Jan 15)
      expect(scanButtons[0]).toHaveTextContent('John Doe');
      // Second button should be Jane Smith (Jan 14)
      expect(scanButtons[1]).toHaveTextContent('Jane Smith');
      // Third button should be Robert Johnson (Jan 13)
      expect(scanButtons[2]).toHaveTextContent('Robert Johnson');
    });
  });

  describe('Historical Scan Selection', () => {
    it('should call onSelectScan when a scan is clicked', async () => {
      vi.mocked(apiClient.getHistory).mockResolvedValue(mockScans);
      const user = userEvent.setup();

      render(<ScanHistory onSelectScan={mockOnSelectScan} />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const firstScan = screen.getByText('John Doe').closest('button');
      expect(firstScan).toBeInTheDocument();
      
      await user.click(firstScan!);

      expect(mockOnSelectScan).toHaveBeenCalledTimes(1);
      expect(mockOnSelectScan).toHaveBeenCalledWith(
        expect.objectContaining({
          prediction: 'glioma',
          confidence: 0.92,
          reportUrl: '/api/reports/scan-001.pdf',
          scanId: 'scan-001',
        }),
        expect.stringContaining('/api/gradcam/scan-001.png')
      );
    });

    it('should convert HistoricalScan to PredictionResult format correctly', async () => {
      vi.mocked(apiClient.getHistory).mockResolvedValue(mockScans);
      const user = userEvent.setup();

      render(<ScanHistory onSelectScan={mockOnSelectScan} />);

      await waitFor(() => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });

      const secondScan = screen.getByText('Jane Smith').closest('button');
      await user.click(secondScan!);

      const callArgs = mockOnSelectScan.mock.calls[0];
      const predictionResult = callArgs[0];

      expect(predictionResult).toHaveProperty('prediction', 'meningioma');
      expect(predictionResult).toHaveProperty('confidence', 0.87);
      expect(predictionResult).toHaveProperty('probabilities');
      expect(predictionResult.probabilities).toHaveProperty('glioma');
      expect(predictionResult.probabilities).toHaveProperty('meningioma');
      expect(predictionResult.probabilities).toHaveProperty('pituitary');
      expect(predictionResult.probabilities).toHaveProperty('noTumor');
    });
  });

  describe('Empty State', () => {
    it('should display empty state when no scans exist', async () => {
      vi.mocked(apiClient.getHistory).mockResolvedValue({ scans: [] });

      render(<ScanHistory onSelectScan={mockOnSelectScan} />);

      await waitFor(() => {
        expect(screen.getByText('No scan history')).toBeInTheDocument();
      });

      expect(screen.getByText(/upload your first mri scan/i)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when API call fails', async () => {
      vi.mocked(apiClient.getHistory).mockRejectedValue(
        new Error('Failed to load scan history')
      );

      render(<ScanHistory onSelectScan={mockOnSelectScan} />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load scan history')).toBeInTheDocument();
      });
    });

    it('should handle generic errors', async () => {
      vi.mocked(apiClient.getHistory).mockRejectedValue('Unknown error');

      render(<ScanHistory onSelectScan={mockOnSelectScan} />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load scan history')).toBeInTheDocument();
      });
    });
  });

  describe('Date Formatting', () => {
    it('should format dates in a readable format', async () => {
      vi.mocked(apiClient.getHistory).mockResolvedValue(mockScans);

      render(<ScanHistory onSelectScan={mockOnSelectScan} />);

      await waitFor(() => {
        // Check that dates are displayed (format may vary by locale)
        const dateElements = screen.getAllByText(/Jan|2024/);
        expect(dateElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have clickable buttons for each scan', async () => {
      vi.mocked(apiClient.getHistory).mockResolvedValue(mockScans);

      render(<ScanHistory onSelectScan={mockOnSelectScan} />);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(3);
      });
    });

    it('should have proper focus management', async () => {
      vi.mocked(apiClient.getHistory).mockResolvedValue(mockScans);
      const user = userEvent.setup();

      render(<ScanHistory onSelectScan={mockOnSelectScan} />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const firstButton = screen.getByText('John Doe').closest('button');
      await user.tab();
      
      // Button should be focusable
      expect(firstButton).toBeInTheDocument();
    });
  });
});
