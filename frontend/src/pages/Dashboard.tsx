import { useState } from 'react';
import Navbar from '../components/Navbar';
import UploadForm from '../components/UploadForm';
import ResultsDisplay from '../components/ResultsDisplay';
import ScanHistory from '../components/ScanHistory';
import Footer from '../components/Footer';
import type { User, PredictionResult } from '../types';

/**
 * Dashboard Component
 * 
 * Main dashboard page displayed after successful authentication.
 * Features hero section with heading and description, plus grid layout
 * for upload form and scan history sections.
 * Mobile-optimized with responsive layouts and touch-friendly interactions.
 * 
 * Requirements: 3.4, 3.5, 3.6, 10.1, 10.2, 10.3, 11.1, 11.2
 */

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [mriImageUrl, setMriImageUrl] = useState<string | null>(null);
  const [isScanHistoryExpanded, setIsScanHistoryExpanded] = useState(false);

  const handleUploadSuccess = (result: PredictionResult) => {
    setPredictionResult(result);
    // Store the MRI image URL from the file upload
    // In a real app, this would come from the API response
    // For now, we'll use a placeholder or the gradCamUrl
    setMriImageUrl(result.gradCamUrl || '');
  };

  const handleNewScan = () => {
    setPredictionResult(null);
    setMriImageUrl(null);
  };

  const handleSelectHistoricalScan = (result: PredictionResult, mriImageUrl: string) => {
    setPredictionResult(result);
    setMriImageUrl(mriImageUrl);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900 transition-colors flex flex-col">
      {/* Navbar */}
      <Navbar user={user} onLogout={onLogout} />

      {/* Main Content - Add padding-top to account for fixed navbar */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 w-full pt-24 sm:pt-28 lg:pt-32">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#1E293B] dark:text-gray-100 mb-3 sm:mb-4 lg:mb-6 transition-colors px-2">
            AI-Assisted Brain MRI Analysis
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-[#64748B] dark:text-gray-400 max-w-3xl mx-auto transition-colors px-4">
            Upload MRI scans for tumor detection analysis. Our AI-powered system provides accurate predictions with confidence metrics and detailed visualizations.
          </p>
        </div>

        {/* Conditional Rendering: Results or Upload Form */}
        {predictionResult && mriImageUrl ? (
          <div className="space-y-4 sm:space-y-6">
            {/* Results Display */}
            <ResultsDisplay result={predictionResult} mriImage={mriImageUrl} />
            
            {/* New Scan Button - Touch-friendly size (min 44x44px) */}
            <div className="flex justify-center">
              <button
                onClick={handleNewScan}
                className="bg-[#3B82F6] hover:bg-blue-600 active:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 min-h-[44px] touch-manipulation"
              >
                Analyze New Scan
              </button>
            </div>
          </div>
        ) : (
          /* Layout: Upload Form on left, Scan History below on right */
          <div className="space-y-6 sm:space-y-8 lg:space-y-12">
            {/* Upload Form Section - Full Width */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 lg:p-12 transition-colors">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1E293B] dark:text-gray-100 mb-6 sm:mb-8 transition-colors text-center">
                Upload MRI Scan
              </h2>
              <UploadForm onUploadSuccess={handleUploadSuccess} />
            </div>

            {/* Scan History Section - Collapsible, positioned on left side */}
            <div className="flex justify-start">
              <div className="w-full lg:w-1/2 transition-colors">
                {!isScanHistoryExpanded ? (
                  /* Collapsed State - Button */
                  <button
                    onClick={() => setIsScanHistoryExpanded(true)}
                    className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl shadow-lg p-6 sm:p-8 lg:p-12 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#1E293B] dark:text-gray-100 text-center">
                      Scan History
                    </h2>
                  </button>
                ) : (
                  /* Expanded State - Full Content */
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 lg:p-12 transition-colors">
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#1E293B] dark:text-gray-100 transition-colors">
                        Scan History
                      </h2>
                      <button
                        onClick={() => setIsScanHistoryExpanded(false)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Collapse scan history"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <ScanHistory onSelectScan={handleSelectHistoricalScan} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer with Privacy Compliance */}
      <Footer />
    </div>
  );
}
