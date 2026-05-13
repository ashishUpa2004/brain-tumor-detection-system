# 🎯 COGNITIVE - Setup Checklist

Use this checklist to ensure proper project setup before university submission or presentation.

---

## ✅ Pre-Setup Requirements

- [ ] Python 3.9 - 3.11 installed
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Internet connection for dependencies

---

## ✅ Backend Setup Checklist

### Environment Setup
- [ ] Navigated to `backend_temp` directory
- [ ] Created virtual environment: `python -m venv venv`
- [ ] Activated virtual environment: `venv\Scripts\activate`
- [ ] Installed dependencies: `pip install -r requirements.txt`

### Configuration
- [ ] Verified `.env` file exists in `backend_temp/`
- [ ] Confirmed `USE_SQLITE=True` in `.env`
- [ ] Confirmed `SECRET_KEY` is set

### Database
- [ ] Ran migrations: `python manage.py makemigrations`
- [ ] Applied migrations: `python manage.py migrate`
- [ ] Created superuser: `python manage.py createsuperuser`
- [ ] Verified `db.sqlite3` file created

### Model File
- [ ] Verified model exists at: `backend_temp/model/best_vgg16.keras`
- [ ] Model file size is appropriate (>100MB)

### Server Testing
- [ ] Django server starts: `python manage.py runserver`
- [ ] Django runs on: `http://localhost:8000`
- [ ] FastAPI server starts: `python app.py`
- [ ] FastAPI runs on: `http://localhost:8001`
- [ ] No error messages in terminal

---

## ✅ Frontend Setup Checklist

### Environment Setup
- [ ] Navigated to `frontend` directory
- [ ] Installed dependencies: `npm install`
- [ ] No errors during installation

### Configuration
- [ ] Verified `package.json` exists
- [ ] Checked API endpoint in `src/services/apiClient.ts`
- [ ] Confirmed backend URL: `http://localhost:8000`

### Server Testing
- [ ] Frontend server starts: `npm run dev`
- [ ] Frontend runs on: `http://localhost:5173`
- [ ] No compilation errors
- [ ] Browser opens automatically or manually

---

## ✅ Application Testing Checklist

### Basic Functionality
- [ ] Application loads in browser
- [ ] Login page displays correctly
- [ ] No console errors in browser DevTools
- [ ] UI elements render properly

### User Authentication
- [ ] Can create new account (Sign Up)
- [ ] Receives success message after signup
- [ ] Can login with credentials
- [ ] JWT token stored properly
- [ ] Dashboard loads after login

### MRI Upload & Analysis
- [ ] "New Scan" button visible
- [ ] Can select image file (JPG/PNG)
- [ ] Upload progress shows
- [ ] Prediction results display
- [ ] Confidence score shows
- [ ] Tumor type classification correct

### Grad-CAM Visualization
- [ ] Heatmap generates successfully
- [ ] Heatmap overlays on original image
- [ ] Colors indicate focus areas
- [ ] Image displays without overflow

### PDF Report
- [ ] "Download Report" button works
- [ ] PDF generates successfully
- [ ] PDF contains all information:
  - [ ] Patient details
  - [ ] Scan date/time
  - [ ] Prediction result
  - [ ] Confidence score
  - [ ] Heatmap image

### History Page
- [ ] History page accessible
- [ ] Previous scans display
- [ ] Pagination works (if multiple scans)
- [ ] Can click on scan to view details
- [ ] Details page shows complete information

---

## ✅ Performance Verification

### Backend Performance
- [ ] API responses < 2 seconds
- [ ] Prediction completes < 5 seconds
- [ ] No memory leaks
- [ ] Database queries efficient

### Frontend Performance
- [ ] Page loads < 3 seconds
- [ ] Smooth animations
- [ ] No lag during interactions
- [ ] Images load properly

---

## ✅ Code Quality Checklist

### Backend Code
- [ ] No syntax errors
- [ ] Proper error handling
- [ ] Environment variables used correctly
- [ ] Database models properly defined
- [ ] API endpoints documented

### Frontend Code
- [ ] No TypeScript errors
- [ ] Components properly structured
- [ ] API calls handled correctly
- [ ] Error states managed
- [ ] Loading states implemented

---

## ✅ Documentation Checklist

- [ ] README.md complete and accurate
- [ ] PRESENTATION_README.md detailed
- [ ] Setup instructions clear
- [ ] Troubleshooting section helpful
- [ ] GitHub repository link correct
- [ ] All dependencies listed

---

## ✅ University Submission Checklist

### Files to Include
- [ ] Complete source code
- [ ] README.md
- [ ] PRESENTATION_README.md
- [ ] requirements.txt
- [ ] package.json
- [ ] .env file (with development keys)
- [ ] Model file (best_vgg16.keras)
- [ ] Sample MRI images for testing

### Files to Exclude
- [ ] node_modules/ (too large)
- [ ] venv/ (too large)
- [ ] __pycache__/ (generated)
- [ ] .git/ (optional)
- [ ] db.sqlite3 (optional - can be regenerated)

### Documentation
- [ ] Project report/documentation
- [ ] Architecture diagrams
- [ ] Screenshots of working application
- [ ] Demo video (if required)

---

## ✅ Presentation Checklist

### Preparation
- [ ] All servers running smoothly
- [ ] Sample MRI images ready
- [ ] Test account created
- [ ] Demo flow practiced
- [ ] Backup plan ready

### Demo Flow
1. [ ] Show login page
2. [ ] Create account / Login
3. [ ] Upload MRI scan
4. [ ] Show prediction results
5. [ ] Explain Grad-CAM heatmap
6. [ ] Download PDF report
7. [ ] Show history page
8. [ ] Explain tech stack
9. [ ] Show code structure
10. [ ] Answer questions

---

## ✅ Final Verification

- [ ] All checklist items completed
- [ ] Project runs without errors
- [ ] Documentation is complete
- [ ] Code is clean and commented
- [ ] Ready for submission/presentation

---

## 🚨 Common Issues & Quick Fixes

### Issue: Virtual environment not activating
**Fix**: Use Command Prompt (not PowerShell) on Windows

### Issue: TensorFlow installation fails
**Fix**: `pip install tensorflow==2.15.0 --no-cache-dir`

### Issue: Port already in use
**Fix**: Kill process or use different port

### Issue: Model file missing
**Fix**: Ensure `best_vgg16.keras` is in `backend_temp/model/`

### Issue: npm install fails
**Fix**: `npm cache clean --force` then retry

---

## 📞 Need Help?

**GitHub Repository**: [https://github.com/ashishUpa2004/brain-tumor-detection-system](https://github.com/ashishUpa2004/brain-tumor-detection-system)

**Documentation**: See PRESENTATION_README.md for detailed setup guide

---

**Good luck with your presentation! 🎓**
