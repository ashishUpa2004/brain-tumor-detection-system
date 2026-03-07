import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GradCAMVisualization from './GradCAMVisualization';

describe('GradCAMVisualization', () => {
  const mockProps = {
    mriImage: 'https://example.com/mri.png',
    gradCamOverlay: 'https://example.com/gradcam.png',
    enabled: false,
  };

  it('renders MRI image', () => {
    render(<GradCAMVisualization {...mockProps} />);
    
    const mriImage = screen.getByAltText('MRI Scan');
    expect(mriImage).toBeInTheDocument();
    expect(mriImage).toHaveAttribute('src', mockProps.mriImage);
  });

  it('renders toggle control', () => {
    render(<GradCAMVisualization {...mockProps} />);
    
    const toggle = screen.getByRole('switch', { name: /toggle grad-cam visualization/i });
    expect(toggle).toBeInTheDocument();
  });

  it('does not show overlay when disabled', () => {
    render(<GradCAMVisualization {...mockProps} enabled={false} />);
    
    const overlay = screen.queryByAltText('Grad-CAM Heatmap Overlay');
    expect(overlay).not.toBeInTheDocument();
  });

  it('shows overlay when enabled', () => {
    render(<GradCAMVisualization {...mockProps} enabled={true} />);
    
    const overlay = screen.getByAltText('Grad-CAM Heatmap Overlay');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveAttribute('src', mockProps.gradCamOverlay);
  });

  it('toggles overlay on button click', () => {
    render(<GradCAMVisualization {...mockProps} enabled={false} />);
    
    const toggle = screen.getByRole('switch');
    
    // Initially disabled
    expect(screen.queryByAltText('Grad-CAM Heatmap Overlay')).not.toBeInTheDocument();
    
    // Click to enable
    fireEvent.click(toggle);
    expect(screen.getByAltText('Grad-CAM Heatmap Overlay')).toBeInTheDocument();
    
    // Click to disable
    fireEvent.click(toggle);
    expect(screen.queryByAltText('Grad-CAM Heatmap Overlay')).not.toBeInTheDocument();
  });

  it('displays appropriate description based on toggle state', () => {
    render(<GradCAMVisualization {...mockProps} enabled={false} />);
    
    expect(screen.getByText(/toggle on to view grad-cam visualization overlay/i)).toBeInTheDocument();
    
    // Click toggle to enable
    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);
    
    expect(screen.getByText(/showing gradient-weighted class activation mapping/i)).toBeInTheDocument();
  });

  it('maintains toggle state during session', () => {
    render(<GradCAMVisualization {...mockProps} enabled={false} />);
    
    const toggle = screen.getByRole('switch');
    
    // Enable overlay
    fireEvent.click(toggle);
    expect(screen.getByAltText('Grad-CAM Heatmap Overlay')).toBeInTheDocument();
    
    // State should persist
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });
});
