/**
 * API Client Usage Examples
 * 
 * This file demonstrates how to use the API client service.
 * These examples can be used in React components.
 */

import { login, signup, predict, getHistory, downloadReport } from './apiClient';

// ============================================================================
// Example 1: User Login
// ============================================================================

export const exampleLogin = async () => {
  try {
    const credentials = {
      email: 'test@example.com',
      password: 'password123',
    };
    
    const response = await login(credentials);
    
    // Store token in localStorage
    localStorage.setItem('authToken', response.token);
    
    console.log('Login successful:', response.user);
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// ============================================================================
// Example 2: User Signup
// ============================================================================

export const exampleSignup = async () => {
  try {
    const signupData = {
      email: 'newuser@example.com',
      password: 'securepassword123',
      name: 'Dr. New User',
    };
    
    const response = await signup(signupData);
    
    // Store token in localStorage
    localStorage.setItem('authToken', response.token);
    
    console.log('Signup successful:', response.user);
    return response;
  } catch (error) {
    console.error('Signup failed:', error);
    throw error;
  }
};

// ============================================================================
// Example 3: MRI Prediction
// ============================================================================

export const examplePredict = async (file: File) => {
  try {
    // Create FormData with patient information and MRI file
    const formData = new FormData();
    formData.append('patientName', 'John Doe');
    formData.append('patientAge', '45');
    formData.append('mriFile', file);
    
    const result = await predict(formData);
    
    console.log('Prediction result:', {
      prediction: result.prediction,
      confidence: `${(result.confidence * 100).toFixed(1)}%`,
      probabilities: result.probabilities,
      reportUrl: result.reportUrl,
      gradCamUrl: result.gradCamUrl,
    });
    
    return result;
  } catch (error) {
    console.error('Prediction failed:', error);
    throw error;
  }
};

// ============================================================================
// Example 4: Get Scan History
// ============================================================================

export const exampleGetHistory = async () => {
  try {
    const history = await getHistory();
    
    console.log(`Found ${history.scans.length} previous scans:`);
    history.scans.forEach((scan) => {
      console.log(`- ${scan.patientName} (${scan.date}): ${scan.prediction} (${(scan.confidence * 100).toFixed(1)}%)`);
    });
    
    return history;
  } catch (error) {
    console.error('Failed to fetch history:', error);
    throw error;
  }
};

// ============================================================================
// Example 5: Download Report
// ============================================================================

export const exampleDownloadReport = async (reportUrl: string) => {
  try {
    const blob = await downloadReport(reportUrl);
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tumor-detection-report.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    console.log('Report downloaded successfully');
  } catch (error) {
    console.error('Failed to download report:', error);
    throw error;
  }
};

// ============================================================================
// Example 6: Complete Authentication Flow in React Component
// ============================================================================

export const exampleReactLoginComponent = `
import React, { useState } from 'react';
import { login } from './services';

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await login({ email, password });
      localStorage.setItem('authToken', response.token);
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
`;

// ============================================================================
// Example 7: Complete Upload Flow in React Component
// ============================================================================

export const exampleReactUploadComponent = `
import React, { useState } from 'react';
import { predict } from './services';
import type { PredictionResult } from './types';

const UploadComponent = () => {
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [mriFile, setMriFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mriFile) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('patientName', patientName);
      formData.append('patientAge', patientAge);
      formData.append('mriFile', mriFile);

      const predictionResult = await predict(formData);
      setResult(predictionResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          placeholder="Patient Name"
        />
        <input
          type="number"
          value={patientAge}
          onChange={(e) => setPatientAge(e.target.value)}
          placeholder="Patient Age"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setMriFile(e.target.files?.[0] || null)}
        />
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading || !mriFile}>
          {loading ? 'Analyzing...' : 'Upload & Analyze'}
        </button>
      </form>

      {result && (
        <div className="results">
          <h3>Prediction: {result.prediction}</h3>
          <p>Confidence: {(result.confidence * 100).toFixed(1)}%</p>
          <button onClick={() => window.open(result.reportUrl)}>
            Download Report
          </button>
        </div>
      )}
    </div>
  );
};
`;
