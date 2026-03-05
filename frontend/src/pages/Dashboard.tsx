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

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 w-full">
        {/* Hero Section */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1E293B] dark:text-gray-100 mb-2 sm:mb-3 lg:mb-4 transition-colors px-2">
            AI-Assisted Brain MRI Analysis
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-[#64748B] dark:text-gray-400 max-w-2xl mx-auto transition-colors px-4">
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
          /* Grid Layout for Upload Form and Scan History */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Upload Form Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 lg:p-8 transition-colors">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#1E293B] dark:text-gray-100 mb-3 sm:mb-4 transition-colors">
                Upload MRI Scan
              </h2>
              <UploadForm onUploadSuccess={handleUploadSuccess} />
            </div>

            {/* Scan History Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 lg:p-8 transition-colors">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#1E293B] dark:text-gray-100 mb-3 sm:mb-4 transition-colors">
                Scan History
              </h2>
              <ScanHistory onSelectScan={handleSelectHistoricalScan} />
            </div>
          </div>
        )}
      </main>

      {/* Footer with Privacy Compliance */}
      <Footer />
    </div>
  );
}
