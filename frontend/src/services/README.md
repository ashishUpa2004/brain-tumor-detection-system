# API Client Service

This directory contains the API client service for the COGNITIVE Tumor Detection web application.

## Overview

The API client (`apiClient.ts`) provides a centralized Axios instance with:
- **JWT Token Injection**: Automatically adds Bearer token to all authenticated requests
- **Error Handling**: Centralized error handling with automatic token cleanup on 401 errors
- **Mock API**: Development mode with mock responses for all endpoints

## Configuration

Environment variables (create a `.env` file based on `.env.example`):

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_USE_MOCK_API=true
```

- `VITE_API_BASE_URL`: Backend API base URL (default: `http://localhost:8000`)
- `VITE_USE_MOCK_API`: Enable mock API for development (default: `true`)

## Usage

### Authentication

```typescript
import { login, signup } from './services';

// Login
const loginData = { email: 'test@example.com', password: 'password123' };
const authResponse = await login(loginData);
// Store token
localStorage.setItem('authToken', authResponse.token);

// Signup
const signupData = { email: 'new@example.com', password: 'password123', name: 'Dr. New User' };
const authResponse = await signup(signupData);
```

### MRI Prediction

```typescript
import { predict } from './services';

const formData = new FormData();
formData.append('patientName', 'John Doe');
formData.append('patientAge', '45');
formData.append('mriFile', file);

const result = await predict(formData);
console.log(result.prediction, result.confidence);
```

### Scan History

```typescript
import { getHistory } from './services';

const history = await getHistory();
console.log(history.scans);
```

### Download Report

```typescript
import { downloadReport } from './services';

const blob = await downloadReport(reportUrl);
const url = window.URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'report.pdf';
link.click();
```

## Mock API

The mock API provides realistic responses for development:

### Mock Users
- Email: `test@example.com`
- Password: `password123`
- Name: `Dr. Test User`

### Mock Scan History
- 3 pre-populated historical scans with different tumor types
- Sorted by most recent first

### Mock Predictions
- Random tumor classification (glioma, meningioma, pituitary, no_tumor)
- Random confidence score (75-95%)
- Normalized probability distribution
- Simulated network delay (1-2 seconds)

## Interceptors

### Request Interceptor
- Retrieves JWT token from `localStorage`
- Injects `Authorization: Bearer <token>` header
- Applied to all requests automatically

### Response Interceptor
- Handles HTTP error codes:
  - **401 Unauthorized**: Clears token and redirects to login
  - **400 Bad Request**: Logs validation errors
  - **404 Not Found**: Logs resource not found
  - **500 Server Error**: Logs server errors
- Handles network errors (no response from server)
- Returns user-friendly error messages

## Requirements Mapping

- **Requirement 2.1**: User Authentication Processing - Login/signup API integration
- **Requirement 5.1**: MRI Analysis API Integration - POST to /api/predict/
- **Requirement 5.6**: Error handling for failed API requests

## Future Enhancements

- Add request retry logic for transient failures
- Implement request cancellation for component unmount
- Add request/response logging in development mode
- Implement token refresh mechanism
- Add request queue for offline support
