import { useState } from 'react';
import Navbar from '../components/Navbar';
import UploadForm from '../components/UploadForm';
import ResultsDisplay from '../components/ResultsDisplay';
import ScanHistory from '../components/ScanHistory';
import type { User, PredictionResult } from '../types';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [mriImageUrl, setMriImageUrl] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleUploadStart = () => {
    setIsAnalyzing(true);
    setPredictionResult(null);
  };

  const handleUploadSuccess = (result: PredictionResult, imageUrl: string) => {
    setPredictionResult(result);
    setMriImageUrl(imageUrl);
    setIsAnalyzing(false);
  };

  const handleUploadError = () => setIsAnalyzing(false);

  const handleNewScan = () => {
    setPredictionResult(null);
    setMriImageUrl(null);
    setIsAnalyzing(false);
  };

  const handleSelectHistoricalScan = (result: PredictionResult, imageUrl: string) => {
    setPredictionResult(result);
    setMriImageUrl(imageUrl);
    setShowHistory(false);
  };

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC] dark:bg-gray-900 overflow-hidden">
      <Navbar user={user} onLogout={onLogout} />

      {/* Full height content below navbar */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ paddingTop: '52px' }}>
        {/* Header strip */}
        <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-[#1E293B] dark:text-gray-100">
              AI-Assisted Brain MRI Analysis
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Upload MRI scans for tumor detection
            </p>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-xs px-3 py-1.5 rounded-lg border border-cyan-500 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors"
          >
            {showHistory ? 'Hide History' : 'Scan History'}
          </button>
        </div>

        {/* Main 2-column layout */}
        <div className="flex-1 flex overflow-hidden p-4 gap-4">
          {/* Left: Upload Form */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#1E293B] dark:text-gray-100">Upload MRI Scan</h2>
              {(predictionResult || isAnalyzing) && (
                <button
                  onClick={handleNewScan}
                  className="text-xs px-3 py-1 rounded-lg border border-cyan-500 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors"
                >
                  New Scan
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-4">              <UploadForm
                onUploadSuccess={handleUploadSuccess}
                onUploadStart={handleUploadStart}
                onUploadError={handleUploadError}
              />
            </div>
          </div>

          {/* Right: Results or History */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col overflow-hidden">
            {showHistory ? (
              <>
                <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700">
                  <h2 className="text-sm font-semibold text-[#1E293B] dark:text-gray-100">Scan History</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <ScanHistory onSelectScan={handleSelectHistoricalScan} />
                </div>
              </>
            ) : isAnalyzing ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-cyan-200 dark:border-cyan-900 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-cyan-500 border-r-cyan-500 rounded-full animate-spin"></div>
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Analyzing MRI Scan...</p>
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            ) : predictionResult && mriImageUrl ? (
              <>
                <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700">
                  <h2 className="text-sm font-semibold text-[#1E293B] dark:text-gray-100">Analysis Results</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <ResultsDisplay result={predictionResult} mriImage={mriImageUrl} />
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 bg-cyan-50 dark:bg-cyan-900/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Results will appear here</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Upload an MRI scan to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
