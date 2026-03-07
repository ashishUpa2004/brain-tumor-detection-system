import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Brain3D from './Brain3D';

/**
 * Tests for Brain3D Component
 * Requirements: 1.3, 1.4, 11.4
 */
describe('Brain3D', () => {
  it('renders without crashing', () => {
    const { container } = render(<Brain3D animate={true} />);
    expect(container).toBeTruthy();
  });

  it('renders SVG brain illustration', () => {
    const { container } = render(<Brain3D animate={true} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('contains tumor highlight area', () => {
    const { container } = render(<Brain3D animate={true} />);
    // Check for red circles representing tumor
    const circles = container.querySelectorAll('circle[fill="#EF4444"]');
    expect(circles.length).toBeGreaterThan(0);
  });

  it('is hidden on mobile screens (has md:flex class)', () => {
    const { container } = render(<Brain3D animate={true} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('hidden');
    expect(wrapper.className).toContain('md:flex');
  });

  it('renders with animation disabled', () => {
    const { container } = render(<Brain3D animate={false} />);
    expect(container).toBeTruthy();
  });

  it('contains brain hemisphere division', () => {
    const { container } = render(<Brain3D animate={true} />);
    const paths = container.querySelectorAll('path');
    // Should have multiple paths for brain structure
    expect(paths.length).toBeGreaterThan(3);
  });

  it('contains neural connection lines', () => {
    const { container } = render(<Brain3D animate={true} />);
    const lines = container.querySelectorAll('line[stroke="#3B82F6"]');
    expect(lines.length).toBeGreaterThan(0);
  });

  it('contains floating particles', () => {
    const { container } = render(<Brain3D animate={true} />);
    const particles = container.querySelectorAll('.bg-red-400, .bg-red-300');
    expect(particles.length).toBeGreaterThan(0);
  });
});
