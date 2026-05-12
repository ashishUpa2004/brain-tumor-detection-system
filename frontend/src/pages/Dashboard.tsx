import { useState, useRef, useEffect } from 'react';
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
  const [headerTitle, setHeaderTitle] = useState('RESULT ANALYSIS');
  const gradCamRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || !predictionResult) return;

    const handleScroll = () => {
      if (gradCamRef.current) {
        const rect = gradCamRef.current.getBoundingClientRect();
        // If Grad-CAM strip is scrolled out of view (above viewport)
        if (rect.top < 100) {
          setHeaderTitle('GRAD-CAM VISUALIZATION');
        } else {
          setHeaderTitle('RESULT ANALYSIS');
        }
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [predictionResult]);

  const handleUploadStart = () => {
    setIsAnalyzing(true);
    setPredictionResult(null);
    setHeaderTitle('RESULT ANALYSIS');
  };

  const handleUploadSuccess = (result: PredictionResult, imageUrl: string) => {
    setPredictionResult(result);
    setMriImageUrl(imageUrl);
    setIsAnalyzing(false);
    setHeaderTitle('RESULT ANALYSIS');
  };

  const handleUploadError = () => setIsAnalyzing(false);

  const handleNewScan = () => {
    setPredictionResult(null);
    setMriImageUrl(null);
    setIsAnalyzing(false);
    setHeaderTitle('RESULT ANALYSIS');
  };

  const handleSelectHistoricalScan = (result: PredictionResult, imageUrl: string) => {
    setPredictionResult(result);
    setMriImageUrl(imageUrl);
    setShowHistory(false);
    setHeaderTitle('RESULT ANALYSIS');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-gray-900">
      <Navbar user={user} onLogout={onLogout} />

      {/* Full height content below navbar */}
      <div className="flex-1 flex flex-col" style={{ paddingTop: '68px' }}>
        {/* Header strip */}
        <div className="px-6 py-6 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-900 dark:to-black relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
              AI-Assisted Brain MRI Analysis
            </h1>
            <p className="text-sm md:text-base text-gray-300 dark:text-gray-400 max-w-3xl mx-auto">
              Upload MRI scans for tumor detection analysis. Our AI-powered system provides accurate predictions with confidence metrics and detailed visualizations.
            </p>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="absolute top-6 right-6 text-xs px-3 py-1.5 rounded-lg border border-cyan-500 text-cyan-400 hover:bg-cyan-900/20 transition-colors z-10"
          >
            {showHistory ? 'Hide History' : 'Scan History'}
          </button>
        </div>

        {/* Main 2-column layout */}
        <div className="flex-1 pb-4">
          <div className="p-4">
          <div className="max-w-7xl mx-auto flex gap-4 items-start">
          {/* Left: Upload Form */}
          <div className="w-full md:w-5/12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col h-fit">
            <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-center bg-cyan-500 dark:bg-cyan-600 rounded-t-xl relative">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">UPLOAD MRI SCAN</h2>
              {(predictionResult || isAnalyzing) && (
                <button
                  onClick={handleNewScan}
                  className="absolute right-5 text-xs px-4 py-1.5 rounded-lg bg-white text-cyan-600 hover:bg-cyan-50 transition-colors font-semibold shadow-sm"
                >
                  New Scan
                </button>
              )}
            </div>
            <div className="p-4">
              <UploadForm
                onUploadSuccess={handleUploadSuccess}
                onUploadStart={handleUploadStart}
                onUploadError={handleUploadError}
              />
            </div>
          </div>

          {/* Right: Results or History */}
          <div className="w-full md:w-7/12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col h-fit">
            {showHistory ? (
              <>
                <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 bg-cyan-500 dark:bg-cyan-600 rounded-t-xl">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider text-center">SCAN HISTORY</h2>
                </div>
                <div className="p-4">
                  <ScanHistory onSelectScan={handleSelectHistoricalScan} />
                </div>
              </>
            ) : isAnalyzing ? (
              <div className="flex flex-col items-center justify-center space-y-4 p-12">
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
                <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 bg-cyan-400 dark:bg-cyan-500 rounded-t-xl">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider text-center">{headerTitle}</h2>
                </div>
                <div className="p-4">
                  <ResultsDisplay result={predictionResult} mriImage={mriImageUrl} gradCamRef={gradCamRef} />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-12">
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
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-4 px-6 py-1.5 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400">
        <span>Made with 💖 by ACE</span>
        <a
          href="https://github.com/ashishUpa2004/brain-tumor-detection-system"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
