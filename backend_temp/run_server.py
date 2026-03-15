"""
Run FastAPI server with Django integration
"""
import uvicorn
import os
import django

# Setup Django before importing FastAPI app
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cognitive.settings')
django.setup()

if __name__ == "__main__":
    uvicorn.run(
        "api.fastapi_app:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
