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
      gradCamUrl: `/api/gradcam/${scan.id}.png`, // Construct Grad-CAM URL
    };

    // Use Grad-CAM URL as the MRI image URL
    onSelectScan(predictionResult, predictionResult.gradCamUrl || '');
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
    if (confidence >= 0.9) return 'text-green-600 dark:text-green-400';
    if (confidence >= 0.75) return 'text-blue-600 dark:text-blue-400';
    return 'text-yellow-600 dark:text-yellow-400';
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
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"
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
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
          No scan history
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Upload your first MRI scan to get started.
        </p>
      </div>
    );
  }

  // Scan list (Requirements 8.1, 8.2, 8.3, 8.4, 10.2)
  return (
    <div className="space-y-2 sm:space-y-3">
      {scans.map((scan) => (
        <button
          key={scan.id}
          onClick={() => handleScanClick(scan)}
          className="w-full text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 active:bg-gray-200 dark:active:bg-gray-500 rounded-lg p-3 sm:p-4 min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 dark:focus:ring-offset-gray-800 touch-manipulation"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base text-[#1E293B] dark:text-gray-100 truncate">
                {scan.patientName}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Age: {scan.patientAge}
              </p>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
              {formatDate(scan.date)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                {getTumorLabel(scan.prediction)}
              </span>
            </div>
            <div className={`text-xs sm:text-sm font-semibold ${getConfidenceColor(scan.confidence)}`}>
              {(scan.confidence * 100).toFixed(1)}% confidence
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
