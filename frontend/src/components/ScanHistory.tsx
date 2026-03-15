import { useEffect, useState } from 'react';
import { getHistory } from '../services/apiClient';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import type { HistoricalScan, PredictionResult } from '../types';

/**
 * ScanHistory Component
 * 
 * Displays a list of previous MRI scan analyses with patient names and dates.
 * Allows users to select historical scans to view stored analysis results.
 * Mobile-optimized with touch-friendly interactions.
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4, 10.2
 */

interface ScanHistoryProps {
  onSelectScan: (result: PredictionResult, mriImageUrl: string) => void;
}

export default function ScanHistory({ onSelectScan }: ScanHistoryProps) {
  const [scans, setScans] = useState<HistoricalScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(5); // Initially show 5 scans
  const SCANS_PER_PAGE = 5;

  useEffect(() => {
    fetchScanHistory();
  }, []);

  const fetchScanHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getHistory();
      // Sort scans by most recent first (Requirement 8.4)
      const sortedScans = response.scans.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setScans(sortedScans);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load scan history');
    } finally {
      setLoading(false);
    }
  };

  const handleShowMore = () => {
    setVisibleCount(prev => prev + SCANS_PER_PAGE);
  };

  const visibleScans = scans.slice(0, visibleCount);
  const hasMore = visibleCount < scans.length;

  const handleScanClick = (scan: HistoricalScan) => {
    // Convert HistoricalScan to PredictionResult format
    const predictionResult: PredictionResult = {
      prediction: scan.prediction,
      confidence: scan.confidence,
      probabilities: {
        glioma: scan.prediction === 'glioma' ? scan.confidence : (1 - scan.confidence) / 3,
        meningioma: scan.prediction === 'meningioma' ? scan.confidence : (1 - scan.confidence) / 3,
        pituitary: scan.prediction === 'pituitary' ? scan.confidence : (1 - scan.confidence) / 3,
        noTumor: scan.prediction === 'no_tumor' ? scan.confidence : (1 - scan.confidence) / 3,
      },
      reportUrl: scan.reportUrl,
      scanId: scan.id,
      gradCamUrl: scan.heatmapUrl || `/api/heatmap/${scan.id}`,
    };

    // Pass original MRI image URL (fetched from backend)
    const mriImageUrl = scan.imageUrl || `/api/image/${scan.id}`;
    onSelectScan(predictionResult, mriImageUrl);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTumorLabel = (prediction: string) => {
    const labels: Record<string, string> = {
      glioma: 'Glioma',
      meningioma: 'Meningioma',
      pituitary: 'Pituitary',
      no_tumor: 'No Tumor',
    };
    return labels[prediction] || prediction;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-400';
    if (confidence >= 0.75) return 'text-cyan-400';
    return 'text-yellow-400';
  };

  // Loading state (Requirement 8.1)
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="medium" message="Loading scan history..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onDismiss={() => setError(null)} 
      />
    );
  }

  // Empty state
  if (scans.length === 0) {
    return (
      <div className="text-center py-16">
        <svg
          className="mx-auto h-16 w-16 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-[#1E293B] dark:text-gray-200">
          No scan history
        </h3>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
          Upload your first MRI scan to get started.
        </p>
      </div>
    );
  }

  // Scan list (Requirements 8.1, 8.2, 8.3, 8.4, 10.2)
  return (
    <div className="space-y-4">
      {/* Scan Cards */}
      {visibleScans.map((scan) => (
        <button
          key={scan.id}
          onClick={() => handleScanClick(scan)}
          className="w-full text-left bg-gray-50 dark:bg-[#0a1628] hover:bg-gray-100 dark:hover:bg-[#0d1f35] active:bg-gray-100 dark:active:bg-[#0d1f35] border border-gray-300 dark:border-cyan-500/30 rounded-xl p-5 min-h-[80px] transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 touch-manipulation"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-[#1E293B] dark:text-gray-200 truncate">
                {scan.patientName}
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-400 mt-1">
                Age: {scan.patientAge}
              </p>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-500 ml-2 flex-shrink-0">
              {formatDate(scan.date)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <span className="text-base font-medium text-cyan-500 dark:text-cyan-400">
                {getTumorLabel(scan.prediction)}
              </span>
            </div>
            <div className={`text-base font-semibold ${getConfidenceColor(scan.confidence)}`}>
              {(scan.confidence * 100).toFixed(1)}% confidence
            </div>
          </div>
        </button>
      ))}

      {/* Show Older Button */}
      {hasMore && (
        <button
          onClick={handleShowMore}
          className="w-full py-4 px-6 min-h-[56px] text-base font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 bg-gray-50 dark:bg-[#0a1628] hover:bg-gray-100 dark:hover:bg-[#0d1f35] border-2 border-dashed border-cyan-500/50 dark:border-cyan-500/30 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 touch-manipulation flex items-center justify-center space-x-2"
        >
          <span>Show Older Scans</span>
          <span className="text-sm text-gray-500 dark:text-gray-500">
            ({scans.length - visibleCount} more)
          </span>
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 9l-7 7-7-7" 
            />
          </svg>
        </button>
      )}

      {/* Showing count indicator */}
      {scans.length > 0 && (
        <div className="text-center pt-2">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Showing {visibleScans.length} of {scans.length} scans
          </p>
        </div>
      )}
    </div>
  );
}
