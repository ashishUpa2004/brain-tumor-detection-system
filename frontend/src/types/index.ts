// ============================================================================
// User and Authentication Types
// ============================================================================

/**
 * User entity representing an authenticated user
 * Requirements: 2.1, 6.1
 */
export interface User {
  id: string;
  email: string;
  name: string;
}

/**
 * Login form data structure
 * Requirements: 2.1
 */
export interface LoginFormData {
  email: string;
  password: string;
}

/**
 * Signup form data structure
 * Requirements: 2.1
 */
export interface SignupFormData {
  email: string;
  password: string;
  name: string;
}

/**
 * Authentication response from API
 * Requirements: 2.1
 */
export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Authentication error response
 * Requirements: 2.1
 */
export interface AuthErrorResponse {
  error: string;
}

// ============================================================================
// Prediction and Analysis Types
// ============================================================================

/**
 * Tumor classification types
 * Requirements: 6.1, 6.2
 */
export type TumorType = 'glioma' | 'meningioma' | 'pituitary' | 'no_tumor';

/**
 * Tumor probabilities for all classifications
 * Requirements: 6.3
 */
export interface TumorProbabilities {
  glioma: number;
  meningioma: number;
  pituitary: number;
  noTumor: number;
}

/**
 * Prediction result from AI analysis
 * Requirements: 5.5, 6.1, 6.2, 6.3
 */
export interface PredictionResult {
  prediction: TumorType;
  confidence: number;
  probabilities: TumorProbabilities;
  reportUrl: string;
  gradCamUrl?: string;
  scanId: string;
}

/**
 * Upload form data for MRI analysis
 * Requirements: 5.5
 */
export interface UploadFormData {
  patientName: string;
  patientAge: number;
  mriFile: File;
}

/**
 * Historical scan record
 * Requirements: 8.2
 */
export interface HistoricalScan {
  id: string;
  patientName: string;
  patientAge: number;
  date: string;
  prediction: TumorType;
  confidence: number;
  reportUrl: string;
  imageUrl?: string;
  heatmapUrl?: string;
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Generic API error response
 * Requirements: 2.1, 5.5
 */
export interface ApiErrorResponse {
  error: string;
}

/**
 * Prediction API response
 * Requirements: 5.5, 6.1, 6.2, 6.3
 */
export interface PredictionApiResponse {
  prediction: TumorType;
  confidence: number;
  probabilities: TumorProbabilities;
  reportUrl: string;
  gradCamUrl?: string;
  scanId: string;
}

/**
 * Scan history API response
 * Requirements: 8.2
 */
export interface ScanHistoryApiResponse {
  scans: HistoricalScan[];
}

// ============================================================================
// Component Props Types
// ============================================================================

/**
 * Login page component props
 * Requirements: 2.1
 */
export interface LoginPageProps {
  onLoginSuccess: (token: string) => void;
}

/**
 * Dashboard component props
 * Requirements: 6.1
 */
export interface DashboardProps {
  user: User;
  onLogout: () => void;
}

/**
 * Upload form component props
 * Requirements: 5.5
 */
export interface UploadFormProps {
  onUploadSuccess: (result: PredictionResult) => void;
}

/**
 * Scan history component props
 * Requirements: 8.2
 */
export interface ScanHistoryProps {
  scans: HistoricalScan[];
  onSelectScan: (scanId: string) => void;
}

/**
 * Results display component props
 * Requirements: 6.1, 6.2, 6.3
 */
export interface ResultsDisplayProps {
  result: PredictionResult;
  mriImage: string;
}

/**
 * Grad-CAM visualization component props
 * Requirements: 6.1
 */
export interface GradCAMVisualizationProps {
  mriImage: string;
  gradCamOverlay: string | null;
  enabled: boolean;
}

/**
 * Brain 3D component props
 * Requirements: 2.1
 */
export interface Brain3DProps {
  animate: boolean;
}

/**
 * Loading spinner component props
 */
export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

/**
 * Error message component props
 */
export interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

// ============================================================================
// State Management Types
// ============================================================================

/**
 * Authentication state
 * Requirements: 2.1
 */
export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

/**
 * Upload state
 * Requirements: 5.5
 */
export interface UploadState {
  formData: UploadFormData | null;
  uploading: boolean;
  progress: number;
  error: string | null;
}

/**
 * Results state
 * Requirements: 6.1, 6.2, 6.3
 */
export interface ResultsState {
  currentResult: PredictionResult | null;
  gradCamEnabled: boolean;
  downloadingReport: boolean;
}

/**
 * History state
 * Requirements: 8.2
 */
export interface HistoryState {
  scans: HistoricalScan[];
  loading: boolean;
  selectedScanId: string | null;
}

/**
 * Theme mode type
 */
export type ThemeMode = 'light' | 'dark';

/**
 * Theme state
 */
export interface ThemeState {
  mode: ThemeMode;
}

/**
 * Theme context value
 */
export interface ThemeContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
}
