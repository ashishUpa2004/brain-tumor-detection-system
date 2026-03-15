import { useState } from 'react';
import GradCAMVisualization from './GradCAMVisualization';
import LoadingSpinner from './LoadingSpinner';
import { downloadReport } from '../services/apiClient';
import type { ResultsDisplayProps, TumorType } from '../types';

/**
 * ResultsDisplay Component
 * 
 * Displays tumor detection results with confidence metrics, probability bars,
 * and Grad-CAM visualization. Provides report download functionality.
 * Mobile-optimized with responsive layouts and touch-friendly interactions.
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 7.1, 7.2, 7.3, 7.4, 10.1, 10.2
 */

export default function ResultsDisplay({ result, mriImage }: ResultsDisplayProps) {
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // Format tumor type for display
  const formatTumorType = (type: TumorType): string => {
    const typeMap: Record<TumorType, string> = {
      glioma: 'Glioma',
      meningioma: 'Meningioma',
      pituitary: 'Pituitary Tumor',
      no_tumor: 'No Tumor Detected',
    };
    return typeMap[type];
  };

  // Handle report download
  const handleDownloadReport = async () => {
    setDownloadingReport(true);
    setDownloadError(null);

    try {
      const blob = await downloadReport(result.reportUrl);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tumor-detection-report-${result.scanId}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      setDownloadError('Failed to download report. Please try again.');
    } finally {
      setDownloadingReport(false);
    }
  };

  // Calculate circular progress
  const confidencePercentage = Math.round(result.confidence * 100);
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (result.confidence * circumference);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Results Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 lg:p-8 transition-colors">
        {/* Header */}
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1E293B] dark:text-gray-100 mb-4 sm:mb-6">
          Analysis Results
        </h2>

        {/* Main Results Grid - Stack on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column: Classification and Confidence */}
          <div className="space-y-4 sm:space-y-6">
            {/* Tumor Classification */}
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
                Classification
              </h3>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#3B82F6] dark:text-blue-400">
                {formatTumorType(result.prediction)}
              </p>
            </div>

            {/* Circular Confidence Indicator */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                <svg className="transform -rotate-90 w-20 h-20 sm:w-24 sm:h-24">
                  {/* Background circle */}
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="7"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700 sm:hidden"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700 hidden sm:block"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="7"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 36}
                    strokeDashoffset={2 * Math.PI * 36 - (result.confidence * 2 * Math.PI * 36)}
                    strokeLinecap="round"
                    className="text-[#3B82F6] dark:text-blue-400 transition-all duration-1000 ease-out sm:hidden"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="text-[#3B82F6] dark:text-blue-400 transition-all duration-1000 ease-out hidden sm:block"
                  />
                </svg>
                {/* Percentage text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg sm:text-xl font-bold text-[#1E293B] dark:text-gray-100">
                    {confidencePercentage}%
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-[#64748B] dark:text-gray-400 mb-1">
                  Confidence Score
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] dark:text-gray-400">
                  Model certainty in prediction
                </p>
              </div>
            </div>

            {/* Download Report Button - Touch-friendly */}
            <button
              onClick={handleDownloadReport}
              disabled={downloadingReport}
              className="w-full bg-[#3B82F6] hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 min-h-[44px] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 flex items-center justify-center space-x-2 touch-manipulation"
            >
              {downloadingReport ? (
                <>
                  <LoadingSpinner size="small" />
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Download Report</span>
                </>
              )}
            </button>

            {downloadError && (
              <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">{downloadError}</p>
            )}
          </div>

          {/* Right Column: Probability Bars */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2 sm:mb-3">
              Classification Probabilities
            </h3>

            {/* Glioma */}
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-1">
                <span className="text-[#1E293B] dark:text-gray-100">Glioma</span>
                <span className="text-[#64748B] dark:text-gray-400">
                  {Math.round(result.probabilities.glioma * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-[#3B82F6] h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${result.probabilities.glioma * 100}%` }}
                />
              </div>
            </div>

            {/* Meningioma */}
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-1">
                <span className="text-[#1E293B] dark:text-gray-100">Meningioma</span>
                <span className="text-[#64748B] dark:text-gray-400">
                  {Math.round(result.probabilities.meningioma * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${result.probabilities.meningioma * 100}%` }}
                />
              </div>
            </div>

            {/* Pituitary */}
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-1">
                <span className="text-[#1E293B] dark:text-gray-100">Pituitary</span>
                <span className="text-[#64748B] dark:text-gray-400">
                  {Math.round(result.probabilities.pituitary * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${result.probabilities.pituitary * 100}%` }}
                />
              </div>
            </div>

            {/* No Tumor */}
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-1">
                <span className="text-[#1E293B] dark:text-gray-100">No Tumor</span>
                <span className="text-[#64748B] dark:text-gray-400">
                  {Math.round(result.probabilities.noTumor * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gray-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${result.probabilities.noTumor * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grad-CAM Visualization Card - always show when we have an MRI image */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 lg:p-8 transition-colors">
        <div className="mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1E293B] dark:text-gray-100">
            Grad-CAM Visualization
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-gray-400 mt-1">
            Highlights the brain regions the AI focused on to make its prediction
          </p>
        </div>
        <GradCAMVisualization
          mriImage={mriImage}
          gradCamOverlay={result.gradCamUrl || null}
          enabled={false}
        />
      </div>
    </div>
  );
}
