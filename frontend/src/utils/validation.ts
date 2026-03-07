/**
 * Form validation utilities for COGNITIVE Tumor Detection application
 * Validates: Requirements 2.1, 4.8, 5.2
 */

/**
 * Validates email format using standard email regex pattern
 * @param email - Email address to validate
 * @returns true if email format is valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Password strength validation result
 */
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates password strength with the following requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 * 
 * @param password - Password to validate
 * @returns Validation result with isValid flag and array of error messages
 */
export function validatePasswordStrength(password: string): PasswordValidationResult {
  const errors: string[] = [];
  
  if (!password || typeof password !== 'string') {
    return { isValid: false, errors: ['Password is required'] };
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * File validation result
 */
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates MRI file upload
 * Checks file type (JPEG, PNG) and file size (max 10MB)
 * 
 * @param file - File object to validate
 * @returns Validation result with isValid flag and optional error message
 */
export function validateMRIFile(file: File | null | undefined): FileValidationResult {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }
  
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: 'Invalid file type. Only JPEG and PNG images are allowed' 
    };
  }
  
  // Validate file size (max 10MB)
  const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSizeInBytes) {
    return { 
      isValid: false, 
      error: 'File size exceeds 10MB limit' 
    };
  }
  
  return { isValid: true };
}

/**
 * Upload form data interface
 */
export interface UploadFormData {
  patientName: string;
  patientAge: number | string;
  mriFile: File | null;
}

/**
 * Form completeness validation result
 */
export interface FormCompletenessResult {
  isComplete: boolean;
  missingFields: string[];
}

/**
 * Checks if upload form is complete with all required fields
 * Validates that patient name, age, and MRI file are provided
 * 
 * @param formData - Upload form data to validate
 * @returns Validation result with isComplete flag and array of missing field names
 */
export function checkFormCompleteness(formData: UploadFormData): FormCompletenessResult {
  const missingFields: string[] = [];
  
  if (!formData.patientName || formData.patientName.trim() === '') {
    missingFields.push('Patient Name');
  }
  
  if (!formData.patientAge || formData.patientAge === '' || formData.patientAge === 0) {
    missingFields.push('Patient Age');
  }
  
  // Validate age is a positive number
  const age = typeof formData.patientAge === 'string' 
    ? parseInt(formData.patientAge, 10) 
    : formData.patientAge;
  
  if (age && (isNaN(age) || age < 0 || age > 150)) {
    missingFields.push('Valid Patient Age');
  }
  
  if (!formData.mriFile) {
    missingFields.push('MRI File');
  }
  
  return {
    isComplete: missingFields.length === 0,
    missingFields
  };
}
