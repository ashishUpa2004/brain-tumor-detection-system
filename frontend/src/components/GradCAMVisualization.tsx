import { useState, useEffect, useCallback, useRef } from 'react';
import apiClient from '../services/apiClient';
import type { GradCAMVisualizationProps } from '../types';

export default function GradCAMVisualization({
  mriImage,
  gradCamOverlay,
  enabled,
}: GradCAMVisualizationProps) {
  const [showOverlay, setShowOverlay] = useState(enabled);
  const [heatmapBlobUrl, setHeatmapBlobUrl] = useState<string | null>(null);
  const [mriBlobUrl, setMriBlobUrl] = useState<string | null>(null);
  const [heatmapError, setHeatmapError] = useState(false);
  const [mriError, setMriError] = useState(false);
  const [heatmapLoading, setHeatmapLoading] = useState(false);
  const [mriLoading, setMriLoading] = useState(false);

  // Use refs to track blob URLs for cleanup without triggering re-renders
  const heatmapBlobRef = useRef<string | null>(null);
  const mriBlobRef = useRef<string | null>(null);

  const isApiUrl = mriImage.startsWith('/api/');

  // Fetch original MRI whenever mriImage changes
  useEffect(() => {
    setMriError(false);
    setMriBlobUrl(null);

    if (!isApiUrl) {
      // Fresh upload blob URL - use directly, don't revoke on cleanup
      setMriBlobUrl(mriImage);
      mriBlobRef.current = null; // not owned by us, don't revoke
      return;
    }

    setMriLoading(true);
    let cancelled = false;
    apiClient
      .get(mriImage, { responseType: 'blob' })
      .then((res) => {
        if (cancelled) return;
        // Revoke previous owned blob
        if (mriBlobRef.current) URL.revokeObjectURL(mriBlobRef.current);
        const url = URL.createObjectURL(res.data);
        mriBlobRef.current = url;
        setMriBlobUrl(url);
      })
      .catch(() => {
        if (!cancelled) setMriError(true);
      })
      .finally(() => {
        if (!cancelled) setMriLoading(false);
      });

    return () => { cancelled = true; };
  }, [mriImage]);

  // Reset heatmap when scan changes
  useEffect(() => {
    if (heatmapBlobRef.current) {
      URL.revokeObjectURL(heatmapBlobRef.current);
      heatmapBlobRef.current = null;
    }
    setHeatmapBlobUrl(null);
    setHeatmapError(false);
  }, [gradCamOverlay]);

  const fetchHeatmap = useCallback(() => {
    if (!gradCamOverlay) return;
    setHeatmapLoading(true);
    setHeatmapError(false);
    apiClient
      .get(gradCamOverlay, { responseType: 'blob' })
      .then((res) => {
        if (heatmapBlobRef.current) URL.revokeObjectURL(heatmapBlobRef.current);
        const url = URL.createObjectURL(res.data);
        heatmapBlobRef.current = url;
        setHeatmapBlobUrl(url);
      })
      .catch(() => setHeatmapError(true))
      .finally(() => setHeatmapLoading(false));
  }, [gradCamOverlay]);

  // Fetch heatmap when toggle ON and not yet loaded
  useEffect(() => {
    if (showOverlay && !heatmapBlobUrl && !heatmapError && !heatmapLoading) {
      fetchHeatmap();
    }
  }, [showOverlay, heatmapBlobUrl, heatmapError, heatmapLoading, fetchHeatmap]);

  // Cleanup on unmount only
  useEffect(() => {
    return () => {
      if (heatmapBlobRef.current) URL.revokeObjectURL(heatmapBlobRef.current);
      if (mriBlobRef.current) URL.revokeObjectURL(mriBlobRef.current);
    };
  }, []);

  return (
    <div className="space-y-3">
      {/* Toggle row */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {showOverlay
            ? 'Red/Yellow = high attention · Blue/Green = low attention'
            : 'Toggle ON to see heatmap'}
        </p>
        <button
          type="button"
          onClick={() => setShowOverlay((v) => !v)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 ${
            showOverlay ? 'bg-cyan-500' : 'bg-gray-300 dark:bg-gray-600'
          }`}
          role="switch"
          aria-checked={showOverlay}
          aria-label="Toggle Grad-CAM overlay"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              showOverlay ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {showOverlay ? (
        /* Heatmap when toggle ON */
        <div className="space-y-1">
          <p className="text-xs text-center font-medium text-cyan-600 dark:text-cyan-400">
            Grad-CAM Heatmap
          </p>
          <div className="rounded-lg overflow-hidden border-2 border-cyan-400 dark:border-cyan-600 bg-black flex items-center justify-center min-h-[120px]">
            {heatmapLoading ? (
              <div className="flex flex-col items-center gap-2 p-4">
                <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-gray-400">Loading heatmap...</p>
              </div>
            ) : heatmapBlobUrl ? (
              <img src={heatmapBlobUrl} alt="Grad-CAM Heatmap" className="w-full h-auto object-contain block" />
            ) : heatmapError ? (
              <div className="flex flex-col items-center gap-2 p-4">
                <p className="text-xs text-gray-400 text-center">Failed to load heatmap</p>
                <button onClick={fetchHeatmap} className="text-xs text-cyan-500 underline hover:text-cyan-400">
                  Retry
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        /* Original MRI when toggle OFF */
        <div className="rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600 bg-black flex items-center justify-center min-h-[120px]">
          {mriLoading ? (
            <div className="flex flex-col items-center gap-2 p-4">
              <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-gray-400">Loading...</p>
            </div>
          ) : mriError ? (
            <p className="text-xs text-gray-400 p-4">Failed to load MRI image</p>
          ) : mriBlobUrl ? (
            <img src={mriBlobUrl} alt="MRI Scan" className="w-full h-auto object-contain block" />
          ) : null}
        </div>
      )}
    </div>
  );
}
