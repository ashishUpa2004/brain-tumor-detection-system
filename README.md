# COGNITIVE 🧠
**AI-Powered Web Application for Brain Tumor Detection using Deep Learning**

![COGNITIVE](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-19-blue)
![Django](https://img.shields.io/badge/Django-4.2-green)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.15-orange)
![Python](https://img.shields.io/badge/Python-3.9--3.11-blue)
![License](https://img.shields.io/badge/License-Educational-yellow)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Software Requirements](#-software-requirements)
- [Quick Start](#-quick-start)
- [Detailed Setup Guide](#-detailed-setup-guide)
- [Configuration](#-configuration)
- [Database Setup](#-database-setup)
- [How to Use](#-how-to-use)
- [Project Structure](#-project-structure)
- [Model Performance](#-model-performance)
- [Troubleshooting](#-troubleshooting)
- [Verification Steps](#-verification-steps)
- [Support](#-support)

---

## 📋 Overview

COGNITIVE is a full-stack web application that analyzes MRI scans and classifies brain tumors into 4 categories:

- **Glioma**
- **Meningioma**
- **Pituitary Tumor**
- **No Tumor**

The system uses deep learning (VGG16 transfer learning) with Grad-CAM visualization to provide interpretable AI predictions for medical imaging analysis.

---

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based user authentication
- 📤 **MRI Upload & Analysis** - Support for JPG/PNG medical images
- 🤖 **AI-Powered Detection** - VGG16 model trained on 17,000+ images
- 🔥 **Grad-CAM Visualization** - Explainable AI heatmaps
- 📊 **Confidence Scores** - Prediction confidence display
- 📄 **PDF Reports** - Automatic report generation
- 📜 **Scan History** - Paginated history with search
- 🎨 **Modern UI** - Dark theme with cyan accents
- 🌐 **3D Visualization** - Interactive brain model
- ⚡ **Real-time Predictions** - Fast inference

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + TypeScript
- **Tailwind CSS 4.2** - Styling
- **Three.js** - 3D visualization
- **Vite 6.3** - Build tool

### Backend
- **Django 4.2.9** - Main framework
- **FastAPI 0.109.0** - ML inference API
- **SQLite** - Database (file-based, no installation needed)
- **JWT** - Authentication handling
- **Django REST Framework 3.14.0** - API
- **Django CORS Headers 4.3.1** - CORS handling

### Machine Learning
- **TensorFlow 2.15.0** / Keras
- **VGG16** - Transfer learning
- **OpenCV 4.8.1.78** - Image processing
- **Grad-CAM** - Explainability
- **NumPy 1.24.3** - Numerical computing
- **17,000+ training images**


---

## 📦 Software Requirements

### 1. **Python** (Version 3.9 - 3.11 recommended)
   - Download from: https://www.python.org/downloads/
   - ⚠️ **Important**: Check "Add Python to PATH" during installation

### 2. **Node.js** (Version 18 or higher)
   - Download from: https://nodejs.org/
   - Includes npm (Node Package Manager)

### 3. **Git** (for cloning the repository)
   - Download from: https://git-scm.com/downloads

### 4. **Code Editor** (Recommended)
   - Visual Studio Code: https://code.visualstudio.com/

---

## 🚀 Quick Start

### Quick Setup

If you want to run the project immediately:

```bash
# 1. Clone and navigate
git clone https://github.com/ashishUpa2004/brain-tumor-detection-system
cd brain-tumor-detection-system

# 2. Backend Setup
cd backend_temp
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # Mac/Linux
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser

# 3. Start Backend (Open 2 terminals)
# Terminal 1 - Django:
python manage.py runserver

# Terminal 2 - FastAPI:
python app.py

# 4. Frontend Setup (Open new terminal)
cd frontend
npm install
npm run dev

# 5. Open browser: http://localhost:5173
```

---

## 📖 Detailed Setup Guide

### **Step 1: Clone the Repository**

```bash
# Open terminal/command prompt and run:
git clone https://github.com/ashishUpa2004/brain-tumor-detection-system
cd brain-tumor-detection-system
```

---

### **Step 2: Backend Setup**

#### 2.1 Navigate to Backend Directory
```bash
cd backend_temp
```

#### 2.2 Create Python Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

#### 2.3 Install Python Dependencies
```bash
pip install -r requirements.txt
```

**Required Dependencies:**
- Django 4.2.9
- djangorestframework 3.14.0
- django-cors-headers 4.3.1
- djangorestframework-simplejwt 5.3.1
- fastapi 0.109.0
- uvicorn 0.27.0
- tensorflow 2.15.0
- numpy 1.24.3
- opencv-python 4.8.1.78
- pillow 12.1.1
- reportlab 4.0.9
- python-dotenv 1.0.1

#### 2.4 Verify AI Model Location
Ensure the trained model file exists at:
```
backend_temp/model/best_vgg16.keras
```

---

### **Step 3: Frontend Setup**

#### 3.1 Open New Terminal and Navigate to Frontend
```bash
# From project root
cd frontend
```

#### 3.2 Install Node Dependencies
```bash
npm install
```

**Key Dependencies:**
- React 19.2.0
- TypeScript 5.9.3
- Tailwind CSS 4.2.1
- Axios 1.13.6
- React Router DOM 7.13.1
- Framer Motion 12.34.3
- Vite 6.3.5

#### 3.3 Configure API Endpoint (if needed)
Check `frontend/src/services/apiClient.ts` for backend URL:
```typescript
const API_BASE_URL = 'http://localhost:8000';
```

---

### **Step 4: Running the Application**

#### 4.1 Start Backend Servers

**Terminal 1 - Django Server:**
```bash
cd backend_temp
# Activate virtual environment first
python manage.py runserver
```
✅ Backend running at: `http://localhost:8000`

**Terminal 2 - FastAPI Server (for predictions):**
```bash
cd backend_temp
# Activate virtual environment first
python app.py
```
✅ FastAPI running at: `http://localhost:8001`

#### 4.2 Start Frontend Server

**Terminal 3 - React Development Server:**
```bash
cd frontend
npm run dev
```
✅ Frontend running at: `http://localhost:5173`

---

## 📦 Configuration

### Environment Variables

The `.env` file is already configured for easy setup. No changes needed!

**Current Configuration (backend_temp/.env):**
```env
SECRET_KEY=cognitive-brain-tumor-detection-2024-university-project
DEBUG=True
USE_SQLITE=True
```

This configuration uses:
- ✅ **SQLite Database** - No installation required, file-based database
- ✅ **Pre-configured SECRET_KEY** - Ready to use for development
- ✅ **Debug Mode Enabled** - For development/testing

> **📝 Note**: The SECRET_KEY is provided for university submission/development purposes. For production deployment, generate a new secure key using:
> ```bash
> python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
> ```

---

## 📊 Database Setup

### SQLite (Default - No Configuration Needed)

SQLite is file-based and requires no separate installation:

```bash
# The .env file is already configured with:
USE_SQLITE=True

# Simply run migrations:
python manage.py makemigrations
python manage.py migrate

# Create superuser (admin account):
python manage.py createsuperuser
```

Database file created automatically at: `backend_temp/db.sqlite3`

**Advantages:**
- ✅ No installation required
- ✅ Perfect for development/testing/university projects
- ✅ Easy to reset (just delete db.sqlite3 and run migrations again)
- ✅ Portable - entire database in one file

---

## 🎯 How to Use

### 1. **Access the Application**
   - Open browser and go to: `http://localhost:5173`

### 2. **Create Account**
   - Click "Sign Up"
   - Enter username, email, and password
   - Click "Create Account"

### 3. **Login**
   - Enter your credentials
   - Click "Login"

### 4. **Upload MRI Scan**
   - Click "New Scan" button
   - Select MRI image file (JPG, PNG)
   - Add optional patient notes
   - Click "Analyze Scan"

### 5. **View Results**
   - See tumor classification
   - View confidence score
   - Examine Grad-CAM heatmap
   - Download PDF report

### 6. **Check History**
   - Navigate to "History" page
   - View all previous scans
   - Click on any scan to see details

---

## 📁 Project Structure

```
brain-tumor-detection-system/
├── backend_temp/              # Django + FastAPI backend
│   ├── api/                   # API endpoints
│   │   ├── models.py         # Database models
│   │   ├── services.py       # Business logic
│   │   ├── predictor.py      # ML prediction
│   │   ├── gradcam.py        # Grad-CAM implementation
│   │   ├── urls.py           # API routes
│   │   └── utils.py          # Utility functions
│   ├── cognitive/            # Django settings
│   │   ├── settings.py       # Configuration
│   │   ├── urls.py           # URL routing
│   │   └── wsgi.py           # WSGI config
│   ├── model/                # AI model files
│   │   └── best_vgg16.keras  # Trained model
│   ├── media/                # Uploaded files
│   │   └── reports/          # Generated PDF reports
│   ├── heatmaps/             # Generated heatmaps
│   ├── manage.py             # Django CLI
│   ├── app.py                # FastAPI server
│   ├── requirements.txt      # Python dependencies
│   ├── .env                  # Environment config
│   └── .env.example          # Environment template
│
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Brain3D.tsx
│   │   │   └── GradCAMVisualization.tsx
│   │   ├── pages/            # Page components
│   │   │   ├── LoginPage.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── HistoryPage.tsx
│   │   ├── services/         # API client
│   │   │   └── apiClient.ts
│   │   └── App.tsx           # Main app
│   ├── package.json          # Node dependencies
│   ├── vite.config.ts        # Vite config
│   └── tailwind.config.js    # Tailwind config
│
├── README.md                 # This file
├── SETUP_CHECKLIST.md        # Setup verification checklist
└── .gitignore                # Git ignore rules
```

---

## 📊 Model Performance

| Tumor Type | Accuracy |
|------------|----------|
| **Pituitary** | 95-98% |
| **No Tumor** | 95-99% |
| **Meningioma** | 85-90% |
| **Glioma** | 60-70% |

- **Overall Training Accuracy**: 92%
- **Overall Validation Accuracy**: 88%
- **Confidence Threshold**: 70% minimum

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError`
```bash
# Solution: Ensure virtual environment is activated
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
```

**Problem**: Database connection error
```bash
# Solution: Check .env configuration
# Verify USE_SQLITE=True is set
# Delete db.sqlite3 and run migrations again if corrupted
```

**Problem**: Port already in use
```bash
# Solution: Use different port
python manage.py runserver 8080
```

### Frontend Issues

**Problem**: `npm install` fails
```bash
# Solution: Clear cache and retry
npm cache clean --force
npm install
```

**Problem**: API connection error
```bash
# Solution: Verify backend is running
# Check API_BASE_URL in apiClient.ts
```

### Common Setup Issues

**Problem**: Virtual environment not activating
```bash
# Windows - Use Command Prompt (not PowerShell)
cd backend_temp
venv\Scripts\activate

# If still not working, recreate venv:
rmdir /s venv
python -m venv venv
venv\Scripts\activate
```

**Problem**: TensorFlow installation fails
```bash
# Solution: Install specific version
pip install tensorflow==2.15.0 --no-cache-dir

# For Windows with GPU:
pip install tensorflow[and-cuda]==2.15.0
```

**Problem**: Model file not found
```bash
# Ensure model exists at:
backend_temp/model/best_vgg16.keras

# If missing, download from repository or train new model
```

**Problem**: Port 8000 or 8001 already in use
```bash
# Find and kill process (Windows)
netstat -ano | findstr :8000
taskkill /PID <process_id> /F

# Or use different port
python manage.py runserver 8080
```

---

## ✅ Verification Steps

After setup, verify everything is working:

### 1. **Backend Verification**
```bash
# Check Django server
curl http://localhost:8000/api/health/

# Check FastAPI server
curl http://localhost:8001/docs
```

### 2. **Frontend Verification**
- Open browser: `http://localhost:5173`
- Should see login page
- No console errors

### 3. **Database Verification**
```bash
cd backend_temp
python manage.py shell

# In Python shell:
from api.models import User
print(User.objects.count())  # Should show user count
exit()
```

### 4. **Full Flow Test**
1. Create new account
2. Login successfully
3. Upload sample MRI image
4. Get prediction results
5. View Grad-CAM heatmap
6. Download PDF report
7. Check history page

---

## 📞 Support

**GitHub Repository**: [https://github.com/ashishUpa2004/brain-tumor-detection-system](https://github.com/ashishUpa2004/brain-tumor-detection-system)

- 📖 View documentation

---

## 🙏 Acknowledgments

- VGG16 architecture by Visual Geometry Group, Oxford
- Brain tumor dataset from Kaggle
- Grad-CAM implementation based on original paper
- Open source community

---

## ⚠️ Medical Disclaimer

This is an AI-assisted tool for **preliminary analysis only**. It is **NOT** a substitute for professional medical diagnosis. Always consult qualified medical professionals for diagnosis and treatment decisions.

---
