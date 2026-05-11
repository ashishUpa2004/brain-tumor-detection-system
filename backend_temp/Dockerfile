FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install
COPY requirements_hf.txt .
RUN pip install --no-cache-dir -r requirements_hf.txt

# Copy all backend files
COPY . .

# Create necessary directories
RUN mkdir -p uploads heatmaps media/reports

# Set environment variables
ENV DJANGO_SETTINGS_MODULE=cognitive.settings
ENV USE_SQLITE=True
ENV CORS_ALLOW_ALL=True
ENV DEBUG=False
ENV PYTHONPATH=/app
ENV MODEL_PATH=/app/model/best_vgg16.keras

# HF Spaces runs on port 7860
EXPOSE 7860

CMD ["python", "app.py"]
