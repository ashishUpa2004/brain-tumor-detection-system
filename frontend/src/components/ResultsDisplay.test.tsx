import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResultsDisplay from './ResultsDisplay';
import * as apiClient from '../services/apiClient';
import type { PredictionResult } from '../types';

// Mock the apiClient module
vi.mock('../services/apiClient', () => ({
  downloadReport: vi.fn(),
}));

describe('ResultsDisplay', () => {
  const mockResult: PredictionResult = {
    prediction: 'glioma',
    confidence: 0.92,
    probabilities: {
      glioma: 0.92,
      meningioma: 0.05,
      pituitary: 0.02,
      noTumor: 0.01,
    },
    reportUrl: '/api/reports/scan-123.pdf',
    gradCamUrl: '/api/gradcam/scan-123.png',
    scanId: 'scan-123',
  };

  const mockMriImage = 'https://example.com/mri.png';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays tumor classification', () => {
    render(<ResultsDisplay result={mockResult} mriImage={mockMriImage} />);
    
    expect(screen.getByText('Classification')).toBeInTheDocument();
    expect(screen.getAllByText('Glioma').length).toBeGreaterThan(0);
  });

  it('displays confidence score as percentage', () => {
    render(<ResultsDisplay result={mockResult} mriImage={mockMriImage} />);
    
    expect(screen.getByText('Confidence Score')).toBeInTheDocument();
    expect(screen.getAllByText('92%').length).toBeGreaterThan(0);
  });

  it('displays probability bars for all classifications', () => {
    render(<ResultsDisplay result={mockResult} mriImage={mockMriImage} />);
    
    expect(screen.getByText('Classification Probabilities')).toBeInTheDocument();
    expect(screen.getAllByText('Glioma').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Meningioma').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Pituitary').length).toBeGreaterThan(0);
    expect(screen.getAllByText('No Tumor').length).toBeGreaterThan(0);
  });

  it('displays Download Report button', () => {
    render(<ResultsDisplay result={mockResult} mriImage={mockMriImage} />);
    
    const downloadButton = screen.getByRole('button', { name: /download report/i });
    expect(downloadButton).toBeInTheDocument();
  });

  it('initiates download on button click', async () => {
    const mockBlob = new Blob(['PDF content'], { type: 'application/pdf' });
    vi.mocked(apiClient.downloadReport).mockResolvedValue(mockBlob);

    // Mock URL.createObjectURL and URL.revokeObjectURL
    const mockCreateObjectURL = vi.fn(() => 'blob:mock-url');
    const mockRevokeObjectURL = vi.fn();
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    render(<ResultsDisplay result={mockResult} mriImage={mockMriImage} />);
    
    const downloadButton = screen.getByRole('button', { name: /download report/i });
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(apiClient.downloadReport).toHaveBeenCalledWith(mockResult.reportUrl);
    });

    expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob);
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('shows loading state during download', async () => {
    vi.mocked(apiClient.downloadReport).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(new Blob()), 100))
    );

    render(<ResultsDisplay result={mockResult} mriImage={mockMriImage} />);
    
    const downloadButton = screen.getByRole('button', { name: /download report/i });
    fireEvent.click(downloadButton);

    expect(screen.getByText('Downloading...')).toBeInTheDocument();
    expect(downloadButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.queryByText('Downloading...')).not.toBeInTheDocument();
    });
  });

  it('displays error message on download failure', async () => {
    vi.mocked(apiClient.downloadReport).mockRejectedValue(new Error('Network error'));

    render(<ResultsDisplay result={mockResult} mriImage={mockMriImage} />);
    
    const downloadButton = screen.getByRole('button', { name: /download report/i });
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to download report/i)).toBeInTheDocument();
    });
  });

  it('renders GradCAMVisualization when gradCamUrl is provided', () => {
    render(<ResultsDisplay result={mockResult} mriImage={mockMriImage} />);
    
    expect(screen.getByText('MRI Visualization')).toBeInTheDocument();
    expect(screen.getByAltText('MRI Scan')).toBeInTheDocument();
  });

  it('does not render GradCAMVisualization when gradCamUrl is missing', () => {
    const resultWithoutGradCam = { ...mockResult, gradCamUrl: undefined };
    render(<ResultsDisplay result={resultWithoutGradCam} mriImage={mockMriImage} />);
    
    expect(screen.queryByText('MRI Visualization')).not.toBeInTheDocument();
  });

  it('formats different tumor types correctly', () => {
    const { rerender } = render(<ResultsDisplay result={mockResult} mriImage={mockMriImage} />);
    expect(screen.getAllByText('Glioma').length).toBeGreaterThan(0);

    rerender(<ResultsDisplay result={{ ...mockResult, prediction: 'meningioma' }} mriImage={mockMriImage} />);
    expect(screen.getAllByText('Meningioma').length).toBeGreaterThan(0);

    rerender(<ResultsDisplay result={{ ...mockResult, prediction: 'pituitary' }} mriImage={mockMriImage} />);
    expect(screen.getByText('Pituitary Tumor')).toBeInTheDocument();

    rerender(<ResultsDisplay result={{ ...mockResult, prediction: 'no_tumor' }} mriImage={mockMriImage} />);
    expect(screen.getByText('No Tumor Detected')).toBeInTheDocument();
  });

  it('displays circular progress indicator', () => {
    render(<ResultsDisplay result={mockResult} mriImage={mockMriImage} />);
    
    // Check for SVG circles (progress indicator)
    const circles = screen.getAllByRole('img', { hidden: true });
    expect(circles.length).toBeGreaterThan(0);
  });
});
