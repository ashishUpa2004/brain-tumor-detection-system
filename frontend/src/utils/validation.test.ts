import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePasswordStrength,
  validateMRIFile,
  checkFormCompleteness,
  type UploadFormData
} from './validation';

describe('validateEmail', () => {
  it('should return true for valid email addresses', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('test.user@domain.co.uk')).toBe(true);
    expect(validateEmail('name+tag@company.org')).toBe(true);
  });

  it('should return false for invalid email addresses', () => {
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('missing@domain')).toBe(false);
    expect(validateEmail('@nodomain.com')).toBe(false);
    expect(validateEmail('no@.com')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });

  it('should handle edge cases', () => {
    expect(validateEmail('  user@example.com  ')).toBe(true); // trimmed
    expect(validateEmail(null as any)).toBe(false);
    expect(validateEmail(undefined as any)).toBe(false);
  });
});

describe('validatePasswordStrength', () => {
  it('should return valid for strong passwords', () => {
    const result = validatePasswordStrength('StrongP@ss123');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject passwords shorter than 8 characters', () => {
    const result = validatePasswordStrength('Short1!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters long');
  });

  it('should require uppercase letter', () => {
    const result = validatePasswordStrength('lowercase123!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one uppercase letter');
  });

  it('should require lowercase letter', () => {
    const result = validatePasswordStrength('UPPERCASE123!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one lowercase letter');
  });

  it('should require number', () => {
    const result = validatePasswordStrength('NoNumbers!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one number');
  });

  it('should require special character', () => {
    const result = validatePasswordStrength('NoSpecial123');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one special character');
  });

  it('should return multiple errors for weak passwords', () => {
    const result = validatePasswordStrength('weak');
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });

  it('should handle edge cases', () => {
    const emptyResult = validatePasswordStrength('');
    expect(emptyResult.isValid).toBe(false);
    expect(emptyResult.errors).toContain('Password is required');

    const nullResult = validatePasswordStrength(null as any);
    expect(nullResult.isValid).toBe(false);
  });
});

describe('validateMRIFile', () => {
  it('should return valid for JPEG files', () => {
    const file = new File(['content'], 'scan.jpg', { type: 'image/jpeg' });
    const result = validateMRIFile(file);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should return valid for PNG files', () => {
    const file = new File(['content'], 'scan.png', { type: 'image/png' });
    const result = validateMRIFile(file);
    expect(result.isValid).toBe(true);
  });

  it('should reject invalid file types', () => {
    const file = new File(['content'], 'scan.pdf', { type: 'application/pdf' });
    const result = validateMRIFile(file);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Invalid file type');
  });

  it('should reject files larger than 10MB', () => {
    const largeContent = new Array(11 * 1024 * 1024).fill('a').join('');
    const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });
    const result = validateMRIFile(file);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('exceeds 10MB limit');
  });

  it('should handle null or undefined files', () => {
    expect(validateMRIFile(null).isValid).toBe(false);
    expect(validateMRIFile(undefined).isValid).toBe(false);
    expect(validateMRIFile(null).error).toContain('No file selected');
  });
});

describe('checkFormCompleteness', () => {
  it('should return complete for valid form data', () => {
    const formData: UploadFormData = {
      patientName: 'John Doe',
      patientAge: 45,
      mriFile: new File(['content'], 'scan.jpg', { type: 'image/jpeg' })
    };
    const result = checkFormCompleteness(formData);
    expect(result.isComplete).toBe(true);
    expect(result.missingFields).toHaveLength(0);
  });

  it('should detect missing patient name', () => {
    const formData: UploadFormData = {
      patientName: '',
      patientAge: 45,
      mriFile: new File(['content'], 'scan.jpg', { type: 'image/jpeg' })
    };
    const result = checkFormCompleteness(formData);
    expect(result.isComplete).toBe(false);
    expect(result.missingFields).toContain('Patient Name');
  });

  it('should detect missing patient age', () => {
    const formData: UploadFormData = {
      patientName: 'John Doe',
      patientAge: '',
      mriFile: new File(['content'], 'scan.jpg', { type: 'image/jpeg' })
    };
    const result = checkFormCompleteness(formData);
    expect(result.isComplete).toBe(false);
    expect(result.missingFields).toContain('Patient Age');
  });

  it('should detect missing MRI file', () => {
    const formData: UploadFormData = {
      patientName: 'John Doe',
      patientAge: 45,
      mriFile: null
    };
    const result = checkFormCompleteness(formData);
    expect(result.isComplete).toBe(false);
    expect(result.missingFields).toContain('MRI File');
  });

  it('should detect invalid age values', () => {
    const negativeAge: UploadFormData = {
      patientName: 'John Doe',
      patientAge: -5,
      mriFile: new File(['content'], 'scan.jpg', { type: 'image/jpeg' })
    };
    expect(checkFormCompleteness(negativeAge).missingFields).toContain('Valid Patient Age');

    const tooOld: UploadFormData = {
      patientName: 'John Doe',
      patientAge: 200,
      mriFile: new File(['content'], 'scan.jpg', { type: 'image/jpeg' })
    };
    expect(checkFormCompleteness(tooOld).missingFields).toContain('Valid Patient Age');
  });

  it('should handle string age values', () => {
    const formData: UploadFormData = {
      patientName: 'John Doe',
      patientAge: '45',
      mriFile: new File(['content'], 'scan.jpg', { type: 'image/jpeg' })
    };
    const result = checkFormCompleteness(formData);
    expect(result.isComplete).toBe(true);
  });

  it('should detect multiple missing fields', () => {
    const formData: UploadFormData = {
      patientName: '',
      patientAge: '',
      mriFile: null
    };
    const result = checkFormCompleteness(formData);
    expect(result.isComplete).toBe(false);
    expect(result.missingFields.length).toBeGreaterThanOrEqual(3);
  });
});
