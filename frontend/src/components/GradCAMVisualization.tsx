import { useState } from 'react';
import type { GradCAMVisualizationProps } from '../types';

/**
 * GradCAMVisualization Component
 * 
 * Displays MRI image with optional Grad-CAM heatmap overlay.
 * Provides toggle control to enable/disable the activation mapping visualization.
 * Maintains toggle state during the session and ensures proper aspect ratio.
 * Mobile-optimized with touch-friendly toggle control.
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 10.2
 */

export default function GradCAMVisualization({
  mriImage,
  gradCamOverlay,
  enabled,
}: GradCAMVisualizationProps) {
  const [isOverlayEnabled, setIsOverlayEnabled] = useState(enabled);

  const handleToggle = () => {
    setIsOverlayEnabled(!isOverlayEnabled);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Toggle Control - Touch-friendly */}
      <div className="flex items-center justify-between">
        <label htmlFor="gradcam-toggle" className="text-xs sm:text-sm font-medium text-[#1E293B] dark:text-gray-100">
          Grad-CAM Visualization
        </label>
        <button
          id="gradcam-toggle"
          type="button"
          onClick={handleToggle}
          className={`relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 min-h-[44px] min-w-[44px] touch-manipulation ${
            isOverlayEnabled ? 'bg-[#3B82F6]' : 'bg-gray-300 dark:bg-gray-600'
          }`}
          role="switch"
          aria-checked={isOverlayEnabled}
          aria-label="Toggle Grad-CAM visualization"
        >
          <span
            className={`inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white transition-transform ${
              isOverlayEnabled ? 'translate-x-6 sm:translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Image Container with Overlay */}
      <div className="relative w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
        {/* MRI Image */}
        <img
          src={mriImage}
          alt="MRI Scan"
          className="w-full h-auto object-contain"
          style={{ aspectRatio: '1 / 1' }}
        />

        {/* Grad-CAM Overlay */}
        {isOverlayEnabled && gradCamOverlay && (
          <img
            src={gradCamOverlay}
            alt="Grad-CAM Heatmap Overlay"
            className="absolute inset-0 w-full h-full object-contain opacity-60 mix-blend-multiply"
            style={{ aspectRatio: '1 / 1' }}
          />
        )}
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-[#64748B] dark:text-gray-400 italic">
        {isOverlayEnabled
          ? 'Showing gradient-weighted class activation mapping highlighting regions that influenced the AI prediction.'
          : 'Toggle on to view Grad-CAM visualization overlay.'}
      </p>
    </div>
  );
}
