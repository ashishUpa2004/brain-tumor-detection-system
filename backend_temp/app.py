"""
Hugging Face Spaces entry point
Runs Django migrations and starts FastAPI server
"""
import os
import sys

# Set environment for HF Spaces
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cognitive.settings')
os.environ['USE_SQLITE'] = 'True'
os.environ['CORS_ALLOW_ALL'] = 'True'
os.environ['DEBUG'] = 'False'

# Add /app to path (HF Spaces working dir)
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Download model from HF Model Hub if not present
model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model', 'best_vgg16.keras')
os.environ['MODEL_PATH'] = model_path

if not os.path.exists(model_path):
    print("📥 Downloading model from GitHub LFS...")
    try:
        import urllib.request
        os.makedirs(os.path.dirname(model_path), exist_ok=True)
        # GitHub LFS download URL
        url = "https://media.githubusercontent.com/media/ashishUpa2004/brain-tumor-detection-system/main/best_vgg16.keras"
        urllib.request.urlretrieve(url, model_path)
        print("✅ Model downloaded successfully")
    except Exception as e:
        print(f"❌ Model download failed: {e}")
else:
    print("✅ Model already present")

import django
django.setup()

# Run migrations on startup
from django.core.management import call_command
try:
    call_command('migrate', '--run-syncdb', verbosity=0)
    print("✅ Database migrations done")
except Exception as e:
    print(f"⚠️ Migration warning: {e}")

# Import FastAPI app
from api.fastapi_app import app

# HF Spaces uses port 7860
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
