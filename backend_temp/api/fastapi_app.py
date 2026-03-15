"""
FastAPI application integrated with Django
"""
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, EmailStr
from typing import Optional
from asgiref.sync import sync_to_async
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cognitive.settings')
django.setup()

from django.contrib.auth import authenticate
from api.models import User, Patient, Scan
from api.services import AIService, ReportService
from api.utils import create_jwt_token, verify_jwt_token, hash_password

# Create FastAPI app
app = FastAPI(
    title="COGNITIVE Tumor Detection API",
    description="Django + FastAPI Backend for Brain Tumor Detection",
    version="2.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

# Root endpoint
@app.get("/")
def read_root():
    return {
        "status": "success",
        "message": "COGNITIVE Tumor Detection API (Django + FastAPI)",
        "version": "2.0.0",
        "docs": "/docs"
    }

# Health check
@app.get("/health")
def health_check():
    return {"status": "success", "message": "API is running"}

# Auth endpoints
@app.post("/api/auth/signup")
async def signup(user_data: UserCreate):
    """Register new user"""
    try:
        # Check if user exists
        user_exists = await sync_to_async(User.objects.filter(email=user_data.email).exists)()
        if user_exists:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create user
        user = await sync_to_async(User.objects.create_user)(
            email=user_data.email,
            password=user_data.password[:72],
            name=user_data.name
        )
        
        # Generate JWT token
        token = create_jwt_token({"sub": user.email, "user_id": user.id})
        
        return {
            "status": "success",
            "data": {
                "access_token": token,
                "token_type": "bearer",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "name": user.name
                }
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/auth/login")
async def login(credentials: UserLogin):
    """Login user"""
    try:
        password = credentials.password[:72]
        
        # Find user
        try:
            user = await sync_to_async(User.objects.get)(email=credentials.email)
        except User.DoesNotExist:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Verify password
        password_valid = await sync_to_async(user.check_password)(password)
        if not password_valid:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Generate JWT token
        token = create_jwt_token({"sub": user.email, "user_id": user.id})
        
        return {
            "status": "success",
            "data": {
                "access_token": token,
                "token_type": "bearer",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "name": user.name
                }
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/predict/")
async def predict(
    file: UploadFile = File(...),
    patient_name: str = Form(...),
    patient_age: int = Form(...),
    patient_gender: str = Form("Unknown"),
    token: str = Depends(verify_jwt_token)
):
    """Predict tumor type from MRI scan"""
    try:
        # Get user from token
        user = await sync_to_async(User.objects.get)(email=token["sub"])
        
        # Create or get patient
        patient, _ = await sync_to_async(Patient.objects.get_or_create)(
            name=patient_name,
            defaults={'age': patient_age, 'gender': patient_gender}
        )
        
        # Save uploaded file
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, file.filename)
        
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # AI prediction
        ai_service = AIService()
        prediction_result = ai_service.predict(file_path)
        
        # Create scan record (no heatmap yet)
        scan = await sync_to_async(Scan.objects.create)(
            user=user,
            patient=patient,
            image_path=file_path,
            prediction=prediction_result['prediction'],
            confidence=prediction_result['confidence'],
            heatmap_path=None
        )
        
        # Generate heatmap synchronously so PDF can include it
        heatmap_path = ai_service.generate_heatmap_async(scan)
        if heatmap_path:
            scan.heatmap_path = heatmap_path
            await sync_to_async(scan.save)()
        
        # Generate report (heatmap is ready now)
        report_service = ReportService()
        report_path = report_service.generate_report(scan)
        scan.report_path = report_path
        await sync_to_async(scan.save)()
        
        return {
            "status": "success",
            "data": {
                "scan_id": scan.id,
                "prediction": scan.prediction,
                "confidence": scan.confidence,
                "probabilities": prediction_result.get('probabilities', {}),
                "report_url": f"/api/report/{scan.id}",
                "heatmap_url": f"/api/heatmap/{scan.id}",
                "scanId": str(scan.id)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/history")
async def get_history(token: dict = Depends(verify_jwt_token)):
    """Get scan history for user"""
    try:
        user = await sync_to_async(User.objects.get)(email=token["sub"])
        scans = await sync_to_async(list)(
            Scan.objects.filter(user=user).select_related('patient')
        )
        
        return {
            "status": "success",
            "scans": [
                {
                    "id": scan.id,
                    "patientName": scan.patient.name,
                    "patientAge": scan.patient.age,
                    "date": scan.created_at.isoformat(),
                    "prediction": scan.prediction,
                    "confidence": scan.confidence,
                    "reportUrl": f"/api/report/{scan.id}",
                    "imageUrl": f"/api/image/{scan.id}",
                    "heatmapUrl": f"/api/heatmap/{scan.id}" if scan.heatmap_path else None,
                }
                for scan in scans
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/report/{scan_id}")
async def get_report(scan_id: int, token: dict = Depends(verify_jwt_token)):
    """Download scan report"""
    try:
        user = await sync_to_async(User.objects.get)(email=token["sub"])
        scan = await sync_to_async(Scan.objects.get)(id=scan_id, user=user)
        
        if not scan.report_path or not os.path.exists(scan.report_path):
            raise HTTPException(status_code=404, detail="Report not found")
        
        return FileResponse(scan.report_path, media_type='application/pdf')
    except Scan.DoesNotExist:
        raise HTTPException(status_code=404, detail="Scan not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/heatmap/{scan_id}")
async def get_heatmap(scan_id: int, token: dict = Depends(verify_jwt_token)):
    """Download Grad-CAM heatmap image"""
    try:
        user = await sync_to_async(User.objects.get)(email=token["sub"])
        scan = await sync_to_async(Scan.objects.get)(id=scan_id, user=user)
        
        if not scan.heatmap_path:
            raise HTTPException(status_code=404, detail="Heatmap not found")
        
        # Resolve to absolute path
        heatmap_abs = os.path.abspath(scan.heatmap_path)
        if not os.path.exists(heatmap_abs):
            raise HTTPException(status_code=404, detail=f"Heatmap file not found: {heatmap_abs}")
        
        return FileResponse(
            path=heatmap_abs,
            media_type='image/png',
            filename=os.path.basename(heatmap_abs)
        )
    except Scan.DoesNotExist:
        raise HTTPException(status_code=404, detail="Scan not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/image/{scan_id}")
async def get_image(scan_id: int, token: dict = Depends(verify_jwt_token)):
    """Get original MRI image for a scan"""
    try:
        user = await sync_to_async(User.objects.get)(email=token["sub"])
        scan = await sync_to_async(Scan.objects.get)(id=scan_id, user=user)
        
        if not scan.image_path:
            raise HTTPException(status_code=404, detail="Image not found")
        
        # Resolve to absolute path (image_path may be relative like uploads\file.png)
        image_abs = os.path.abspath(scan.image_path)
        if not os.path.exists(image_abs):
            raise HTTPException(status_code=404, detail=f"Image file not found")
        
        ext = os.path.splitext(image_abs)[1].lower()
        media_type = 'image/jpeg' if ext in ('.jpg', '.jpeg') else 'image/png'
        return FileResponse(
            path=image_abs,
            media_type=media_type,
            filename=os.path.basename(image_abs)
        )
    except Scan.DoesNotExist:
        raise HTTPException(status_code=404, detail="Scan not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
