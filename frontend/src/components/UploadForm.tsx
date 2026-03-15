import { useState, useRef, type DragEvent, type ChangeEvent, type FormEvent } from 'react';
import { predict } from '../services/apiClient';
import { validateMRIFile, checkFormCompleteness } from '../utils/validation';
import type { PredictionResult } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

/**
 * UploadForm Component
 * 
 * Handles MRI scan upload with patient information.
 * Features drag-and-drop file upload, form validation, and API integration.
 * Mobile-optimized with touch-friendly interactions and responsive design.
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.6, 4.7, 4.8, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 10.1, 10.2, 10.3, 12.5
 */

interface UploadFormProps {
  onUploadSuccess: (result: PredictionResult, mriImageUrl: string) => void;
  onUploadStart?: () => void;
  onUploadError?: () => void;
}

export default function UploadForm({ onUploadSuccess, onUploadStart, onUploadError }: UploadFormProps) {
  // Form state
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [mriFile, setMriFile] = useState<File | null>(null);
  
  // UI state
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ============================================================================
  // Drag and Drop Handlers
  // ============================================================================

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  // ============================================================================
  // File Selection Handler
  // ============================================================================

  const handleFileSelection = (file: File) => {
    // Clear previous error
    setError(null);
    
    // Validate file
    const validation = validateMRIFile(file);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file');
      return;
    }
    
    setMriFile(file);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  // ============================================================================
  // Form Validation
  // ============================================================================

  const isFormValid = (): boolean => {
    const formData = {
      patientName,
      patientAge,
      mriFile,
    };
    
    const validation = checkFormCompleteness(formData);
    return validation.isComplete && mriFile !== null;
  };

  // ============================================================================
  // Form Submission
  // ============================================================================

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Clear previous error
    setError(null);
    
    // Validate form
    if (!isFormValid() || !mriFile) {
      setError('Please complete all required fields');
      return;
    }
    
    // Prevent duplicate submissions
    if (uploading) {
      return;
    }
    
    try {
      setUploading(true);
      
      // Notify parent that upload has started
      onUploadStart?.();
      
      // Format request as multipart/form-data
      const formData = new FormData();
      formData.append('patient_name', patientName);
      formData.append('patient_age', patientAge);
      formData.append('file', mriFile);
      
      // Send POST request to /api/predict/
      const result = await predict(formData);
      
      // Create local URL for the uploaded MRI image
      const mriImageUrl = URL.createObjectURL(mriFile);
      
      // Navigate to results view on success
      onUploadSuccess(result, mriImageUrl);
      
      // Reset form
      setPatientName('');
      setPatientAge('');
      setMriFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      // Handle API errors
      const errorMessage = err instanceof Error ? err.message : 'Failed to process MRI scan';
      setError(errorMessage);
      
      // Notify parent that upload failed
      onUploadError?.();
    } finally {
      setUploading(false);
    }
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <ErrorMessage 
          message={error} 
          onDismiss={() => setError(null)} 
        />
      )}

      {/* Patient Name Input - Larger */}
      <div>
        <label 
          htmlFor="patientName" 
          className="block text-xl sm:text-2xl font-medium text-[#1E293B] dark:text-gray-200 mb-3"
        >
          Patient Name <span className="text-red-500 dark:text-red-400">*</span>
        </label>
        <input
          type="text"
          id="patientName"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          className="w-full px-5 py-4 min-h-[52px] text-lg border border-gray-400 dark:border-cyan-500/30 rounded-xl focus:ring-0 focus:border-cyan-500 dark:focus:ring-2 dark:focus:ring-cyan-400 dark:focus:border-transparent outline-none transition-all bg-white dark:bg-[#0a1628] text-[#1E293B] dark:text-gray-200 placeholder-gray-500 dark:placeholder-[#94a3b8]"
          placeholder="Enter patient name"
          disabled={uploading}
        />
      </div>

      {/* Patient Age Input - Larger */}
      <div>
        <label 
          htmlFor="patientAge" 
          className="block text-xl sm:text-2xl font-medium text-[#1E293B] dark:text-gray-200 mb-3"
        >
          Patient Age <span className="text-red-500 dark:text-red-400">*</span>
        </label>
        <input
          type="number"
          id="patientAge"
          value={patientAge}
          onChange={(e) => setPatientAge(e.target.value)}
          className="w-full px-5 py-4 min-h-[52px] text-lg border border-gray-400 dark:border-cyan-500/30 rounded-xl focus:ring-0 focus:border-cyan-500 dark:focus:ring-2 dark:focus:ring-cyan-400 dark:focus:border-transparent outline-none transition-all bg-white dark:bg-[#0a1628] text-[#1E293B] dark:text-gray-200 placeholder-gray-500 dark:placeholder-[#94a3b8]"
          placeholder="Enter patient age"
          min="0"
          max="150"
          disabled={uploading}
        />
      </div>

      {/* MRI File Upload Area - Much Larger */}
      <div>
        <label className="block text-xl sm:text-2xl font-medium text-[#1E293B] dark:text-gray-200 mb-3">
          MRI Scan <span className="text-red-500 dark:text-red-400">*</span>
        </label>
        
        {/* Drag and Drop Area - Significantly larger */}
        <div
          onClick={handleUploadAreaClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all min-h-[240px] touch-manipulation
            ${isDragging 
              ? 'border-cyan-400 bg-cyan-500/10' 
              : 'border-gray-400 dark:border-cyan-500/30 hover:border-cyan-400 active:border-cyan-400 hover:bg-cyan-50/30 dark:hover:bg-cyan-900/10'
            }
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={uploading}
          />
          
          {/* Upload Icon - Larger */}
          <div className="mb-6">
            <svg 
              className="mx-auto h-16 w-16 text-cyan-400" 
              stroke="currentColor" 
              fill="none" 
              viewBox="0 0 48 48" 
              aria-hidden="true"
            >
              <path 
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                strokeWidth={2} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </div>
          
          {/* Upload Text - Larger */}
          {mriFile ? (
            <div className="space-y-2">
              <p className="text-lg font-medium text-cyan-400 break-words px-2">
                {mriFile.name}
              </p>
              <p className="text-base text-gray-500 dark:text-gray-400">
                {(mriFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Tap or drag to replace
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                <span className="font-medium text-cyan-500 dark:text-cyan-400">Tap to upload</span> or drag and drop
              </p>
              <p className="text-base text-gray-500 dark:text-gray-400">
                JPEG or PNG (max 10MB)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Secure Processing Badge - Larger */}
      <div className="flex items-center justify-center space-x-2 text-base text-gray-600 dark:text-gray-400 py-3">
        <svg 
          className="h-6 w-6 text-green-500 dark:text-green-400 flex-shrink-0" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
          />
        </svg>
        <span className="text-center">
          {uploading ? 'Encrypting & Processing...' : 'Secure Processing • End-to-End Encrypted'}
        </span>
      </div>

      {/* Submit Button - Much Larger */}
      <button
        type="submit"
        disabled={!isFormValid() || uploading}
        className={`
          w-full py-5 px-6 min-h-[56px] rounded-xl font-semibold text-lg text-white transition-all touch-manipulation shadow-lg
          ${isFormValid() && !uploading
            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 cursor-pointer shadow-cyan-500/30'
            : 'bg-gray-600 cursor-not-allowed'
          }
        `}
      >
        {uploading ? (
          <div className="flex items-center justify-center space-x-2">
            <LoadingSpinner size="small" />
            <span>Processing...</span>
          </div>
        ) : (
          'Upload & Analyze'
        )}
      </button>
    </form>
  );
}
