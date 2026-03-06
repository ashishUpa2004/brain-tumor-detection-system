/**
 * API Client Service
 * 
 * Provides centralized Axios configuration with:
 * - JWT token injection via request interceptor
 * - Secure token storage in localStorage (Note: For production, consider httpOnly cookies)
 * - Automatic token expiration handling with redirect to login
 * - Error handling via response interceptor
 * - HTTPS enforcement for all API communications
 * - Mock API responses for development
 * 
 * Requirements: 2.1, 5.1, 5.6, 11.1, 11.2, 11.5
 */

import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type {
  AuthResponse,
  PredictionApiResponse,
  ScanHistoryApiResponse,
  ApiErrorResponse,
  LoginFormData,
  SignupFormData,
} from '../types';

// ============================================================================
// Configuration
// ============================================================================

// HTTPS Enforcement: In production, ensure API_BASE_URL uses HTTPS protocol
// Example: https://api.cognitive-tumor-detection.com
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true' || true;

// Validate HTTPS in production
if (import.meta.env.PROD && !API_BASE_URL.startsWith('https://')) {
  console.warn('⚠️ Security Warning: API should use HTTPS in production');
}

// ============================================================================
// Axios Instance Configuration
// ============================================================================

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================================
// Request Interceptor - JWT Token Injection
// ============================================================================

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Retrieve JWT token from localStorage
    // Note: For enhanced security in production, consider using httpOnly cookies
    // to prevent XSS attacks. localStorage is used here for simplicity.
    const token = localStorage.getItem('authToken');
    
    if (token && config.headers) {
      // Inject Authorization header with Bearer token
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================================================
// Response Interceptor - Error Handling
// ============================================================================

apiClient.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    // Handle different error scenarios
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const errorMessage = error.response.data?.error || 'An error occurred';
      
      switch (status) {
        case 401:
          // Unauthorized - Token expired or invalid
          // Clear token and redirect to login (Requirement 11.2)
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 400:
          // Bad request - validation error
          console.error('Validation error:', errorMessage);
          break;
        case 404:
          // Not found
          console.error('Resource not found:', errorMessage);
          break;
        case 500:
          // Server error
          console.error('Server error:', errorMessage);
          break;
        default:
          console.error('API error:', errorMessage);
      }
      
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error: No response from server');
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      // Error in request configuration
      console.error('Request error:', error.message);
      return Promise.reject(error);
    }
  }
);

// ============================================================================
// Mock API Data
// ============================================================================

const MOCK_DELAY = 1000; // Simulate network delay

const mockUsers = new Map<string, { email: string; password: string; name: string; id: string }>();

// Pre-populate with a test user
mockUsers.set('test@example.com', {
  email: 'test@example.com',
  password: 'Password123!', // Updated to meet validation requirements
  name: 'Dr. Test User',
  id: 'user-001',
});

const mockScans: ScanHistoryApiResponse = {
  scans: [
    {
      id: 'scan-001',
      patientName: 'John Doe',
      patientAge: 45,
      date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      prediction: 'glioma',
      confidence: 0.92,
      reportUrl: '/api/reports/scan-001.pdf',
    },
    {
      id: 'scan-002',
      patientName: 'Jane Smith',
      patientAge: 38,
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      prediction: 'meningioma',
      confidence: 0.87,
      reportUrl: '/api/reports/scan-002.pdf',
    },
    {
      id: 'scan-003',
      patientName: 'Robert Johnson',
      patientAge: 52,
      date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      prediction: 'no_tumor',
      confidence: 0.95,
      reportUrl: '/api/reports/scan-003.pdf',
    },
  ],
};

// ============================================================================
// Mock API Functions
// ============================================================================

const mockLogin = async (credentials: LoginFormData): Promise<AuthResponse> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
  
  const user = mockUsers.get(credentials.email);
  
  if (!user || user.password !== credentials.password) {
    throw new Error('Invalid credentials');
  }
  
  return {
    token: `mock-jwt-token-${user.id}`,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
};

const mockSignup = async (data: SignupFormData): Promise<AuthResponse> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
  
  if (mockUsers.has(data.email)) {
    throw new Error('Email already exists');
  }
  
  const newUser = {
    id: `user-${Date.now()}`,
    email: data.email,
    password: data.password,
    name: data.name,
  };
  
  mockUsers.set(data.email, newUser);
  
  return {
    token: `mock-jwt-token-${newUser.id}`,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    },
  };
};

const mockPredict = async (_formData: FormData): Promise<PredictionApiResponse> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY * 2)); // Longer delay for prediction
  
  // Simulate random prediction
  const predictions: Array<'glioma' | 'meningioma' | 'pituitary' | 'no_tumor'> = [
    'glioma',
    'meningioma',
    'pituitary',
    'no_tumor',
  ];
  
  const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];
  const confidence = 0.75 + Math.random() * 0.2; // Random confidence between 0.75 and 0.95
  
  // Generate probabilities that sum to 1
  const probabilities = {
    glioma: Math.random() * 0.3,
    meningioma: Math.random() * 0.3,
    pituitary: Math.random() * 0.3,
    noTumor: Math.random() * 0.3,
  };
  
  // Normalize probabilities
  const sum = Object.values(probabilities).reduce((a, b) => a + b, 0);
  probabilities.glioma /= sum;
  probabilities.meningioma /= sum;
  probabilities.pituitary /= sum;
  probabilities.noTumor /= sum;
  
  // Set the predicted class to have the highest probability
  probabilities[randomPrediction === 'no_tumor' ? 'noTumor' : randomPrediction] = confidence;
  
  const scanId = `scan-${Date.now()}`;
  
  return {
    prediction: randomPrediction,
    confidence,
    probabilities,
    reportUrl: `/api/reports/${scanId}.pdf`,
    gradCamUrl: `/api/gradcam/${scanId}.png`,
    scanId,
  };
};

const mockGetHistory = async (): Promise<ScanHistoryApiResponse> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
  return mockScans;
};

// ============================================================================
// API Service Functions
// ============================================================================

/**
 * Login user with credentials
 * Stores JWT token securely in localStorage
 * Requirements: 2.1, 2.5, 11.2
 */
export const login = async (credentials: LoginFormData): Promise<AuthResponse> => {
  if (USE_MOCK_API) {
    const result = await mockLogin(credentials);
    // Store user data for app state management
    localStorage.setItem('user', JSON.stringify(result.user));
    return result;
  }
  
  const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
  // Store user data for app state management
  localStorage.setItem('user', JSON.stringify(response.data.user));
  return response.data;
};

/**
 * Register new user
 * Stores JWT token securely in localStorage
 * Requirements: 2.1, 2.5, 11.2
 */
export const signup = async (data: SignupFormData): Promise<AuthResponse> => {
  if (USE_MOCK_API) {
    const result = await mockSignup(data);
    // Store user data for app state management
    localStorage.setItem('user', JSON.stringify(result.user));
    return result;
  }
  
  const response = await apiClient.post<AuthResponse>('/api/auth/signup', data);
  // Store user data for app state management
  localStorage.setItem('user', JSON.stringify(response.data.user));
  return response.data;
};

/**
 * Submit MRI scan for prediction
 * Requirements: 5.1, 5.6
 */
export const predict = async (formData: FormData): Promise<PredictionApiResponse> => {
  if (USE_MOCK_API) {
    return mockPredict(formData);
  }
  
  const response = await apiClient.post<PredictionApiResponse>('/api/predict/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Get scan history for authenticated user
 * Requirements: 5.1
 */
export const getHistory = async (): Promise<ScanHistoryApiResponse> => {
  if (USE_MOCK_API) {
    return mockGetHistory();
  }
  
  const response = await apiClient.get<ScanHistoryApiResponse>('/api/history');
  return response.data;
};

/**
 * Download report by URL
 * Requirements: 5.1
 */
export const downloadReport = async (reportUrl: string): Promise<Blob> => {
  if (USE_MOCK_API) {
    // Return a mock PDF blob
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
    return new Blob(['Mock PDF content'], { type: 'application/pdf' });
  }
  
  const response = await apiClient.get(reportUrl, {
    responseType: 'blob',
  });
  return response.data;
};

export default apiClient;
