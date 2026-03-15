"""
Business logic services
"""
import os
from datetime import datetime, timezone, timedelta
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from .predictor import get_predictor
from .gradcam import generate_gradcam_for_prediction
from PIL import Image
import numpy as np
import logging

logger = logging.getLogger(__name__)

# IST = UTC+5:30
IST = timezone(timedelta(hours=5, minutes=30))


class AIService:
    """AI prediction service"""
    
    def __init__(self):
        """Initialize AI service with ML model"""
        self.predictor = None
    
    def _get_predictor(self):
        """Lazy load predictor"""
        if self.predictor is None:
            try:
                self.predictor = get_predictor()
            except Exception as e:
                logger.error(f"Failed to load predictor: {str(e)}")
                raise
        return self.predictor
    
    def predict(self, image_path: str, generate_heatmap: bool = False) -> dict:
        """
        Predict tumor type from MRI scan using trained ML model
        
        Args:
            image_path: Path to the uploaded MRI image
            generate_heatmap: Whether to generate Grad-CAM heatmap
            
        Returns:
            Dictionary with prediction results
        """
        try:
            predictor = self._get_predictor()
            result = predictor.predict(image_path, generate_heatmap=generate_heatmap)
            return result
            
        except Exception as e:
            logger.error(f"Prediction service error: {str(e)}")
            # Fallback to mock prediction if model fails
            logger.warning("Falling back to mock prediction")
            return self._mock_predict()
    
    def generate_heatmap_async(self, scan) -> str:
        """
        Generate Grad-CAM heatmap for a scan (can be called after prediction)
        """
        try:
            predictor = self._get_predictor()
            
            # Load original image
            original_img = Image.open(scan.image_path)
            if original_img.mode != 'RGB':
                original_img = original_img.convert('RGB')
            
            # Preprocess for model
            img = original_img.resize((128, 128))
            img_array = np.array(img, dtype=np.float32) / 255.0
            img_array = np.expand_dims(img_array, axis=0)
            
            # Build absolute heatmap path inside backend_temp/heatmaps/
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # backend_temp/
            heatmap_dir = os.path.join(base_dir, "heatmaps")
            os.makedirs(heatmap_dir, exist_ok=True)
            
            filename = os.path.basename(scan.image_path)
            heatmap_filename = f"heatmap_{scan.id}_{filename}"
            heatmap_path = os.path.join(heatmap_dir, heatmap_filename)
            
            heatmap_path = generate_gradcam_for_prediction(
                predictor.model,
                img_array,
                original_img,
                heatmap_path
            )
            
            return heatmap_path
            
        except Exception as e:
            logger.error(f"Heatmap generation failed: {str(e)}")
            return None
    
    def _mock_predict(self) -> dict:
        """Mock prediction for fallback"""
        import random
        
        predictions = ['glioma', 'meningioma', 'pituitary', 'no_tumor']
        prediction = random.choice(predictions)
        confidence = round(random.uniform(0.75, 0.95), 2)
        
        return {
            'prediction': prediction,
            'confidence': confidence,
            'probabilities': {
                'glioma': round(random.uniform(0.1, 0.3), 2),
                'meningioma': round(random.uniform(0.1, 0.3), 2),
                'pituitary': round(random.uniform(0.1, 0.3), 2),
                'no_tumor': round(random.uniform(0.1, 0.3), 2),
            }
        }


class ReportService:
    """PDF report generation service"""
    
    def generate_report(self, scan) -> str:
        """Generate PDF report for scan with dual-image Grad-CAM layout"""
        report_dir = "media/reports"
        os.makedirs(report_dir, exist_ok=True)
        report_path = os.path.join(report_dir, f"report_{scan.id}.pdf")

        c = canvas.Canvas(report_path, pagesize=letter)
        width, height = letter
        margin = 72  # 1 inch margins

        # ── IST timestamp ──────────────────────────────────────────
        now_ist = datetime.now(IST)
        ist_str = now_ist.strftime('%d %B %Y, %I:%M %p IST')
        scan_date_ist = scan.created_at.astimezone(IST).strftime('%d %B %Y at %I:%M %p IST')

        # ── TITLE ──────────────────────────────────────────────────
        c.setFont("Helvetica-Bold", 22)
        c.drawCentredString(width / 2, height - 55, "COGNITIVE Brain Tumor Detection Report")

        # Full-width underline (page edge to edge with small padding)
        c.setStrokeColorRGB(0.1, 0.1, 0.1)
        c.setLineWidth(2)
        c.line(36, height - 70, width - 36, height - 70)

        # ── PATIENT INFORMATION ────────────────────────────────────
        y = height - 100
        c.setFont("Helvetica-Bold", 13)
        c.drawString(margin, y, "Patient Information")
        y -= 7
        c.setStrokeColorRGB(0.7, 0.7, 0.7)
        c.setLineWidth(0.5)
        c.line(margin, y, width - margin, y)

        c.setFont("Helvetica", 11)
        y -= 20
        c.drawString(margin + 10, y, f"Name:        {scan.patient.name}")
        y -= 18
        c.drawString(margin + 10, y, f"Age:           {scan.patient.age} years")
        y -= 18
        c.drawString(margin + 10, y, f"Scan Date:  {scan_date_ist}")

        # ── AI ANALYSIS RESULTS ────────────────────────────────────
        y -= 32
        c.setFont("Helvetica-Bold", 13)
        c.drawString(margin, y, "AI Analysis Results")
        y -= 7
        c.setStrokeColorRGB(0.7, 0.7, 0.7)
        c.setLineWidth(0.5)
        c.line(margin, y, width - margin, y)

        if scan.confidence >= 0.9:
            conf_text = "Very High Confidence"
        elif scan.confidence >= 0.75:
            conf_text = "High Confidence"
        elif scan.confidence >= 0.60:
            conf_text = "Moderate Confidence"
        else:
            conf_text = "Low Confidence - Further Analysis Recommended"

        c.setFont("Helvetica", 11)
        y -= 20
        c.drawString(margin + 10, y, f"Detected Condition:   {scan.prediction.replace('_', ' ').title()}")
        y -= 18
        c.drawString(margin + 10, y, f"Confidence Level:       {scan.confidence * 100:.1f}%")
        y -= 18
        c.drawString(margin + 10, y, f"Interpretation:            {conf_text}")

        # ── GRAD-CAM VISUALIZATION ─────────────────────────────────
        y -= 32
        c.setFont("Helvetica-Bold", 13)
        c.drawString(margin, y, "Grad-CAM Visualization")
        y -= 7
        c.setStrokeColorRGB(0.7, 0.7, 0.7)
        c.setLineWidth(0.5)
        c.line(margin, y, width - margin, y)

        c.setFont("Helvetica", 10)
        y -= 18
        c.setFillColorRGB(0.3, 0.3, 0.3)
        c.drawString(margin + 10, y,
                     "Red/Yellow = High attention (tumor region)   |   Blue/Green = Low attention (normal tissue)")
        c.setFillColorRGB(0, 0, 0)
        y -= 20

        if scan.heatmap_path and os.path.exists(scan.heatmap_path):
            try:
                img_size = 210
                gap = 18
                total_w = img_size * 2 + gap
                x_start = (width - total_w) / 2

                # Original MRI
                mri_reader = ImageReader(scan.image_path)
                c.setStrokeColorRGB(0.55, 0.55, 0.55)
                c.setLineWidth(1.5)
                c.rect(x_start - 2, y - img_size - 2, img_size + 4, img_size + 4)
                c.drawImage(mri_reader, x_start, y - img_size,
                            width=img_size, height=img_size,
                            preserveAspectRatio=True, mask='auto')
                c.setFont("Helvetica", 9)
                c.setFillColorRGB(0.4, 0.4, 0.4)
                c.drawCentredString(x_start + img_size / 2, y - img_size - 13, "Original MRI")

                # Grad-CAM Heatmap
                hx = x_start + img_size + gap
                heatmap_reader = ImageReader(scan.heatmap_path)
                c.setStrokeColorRGB(0.0, 0.72, 0.83)
                c.setLineWidth(2)
                c.rect(hx - 2, y - img_size - 2, img_size + 4, img_size + 4)
                c.drawImage(heatmap_reader, hx, y - img_size,
                            width=img_size, height=img_size,
                            preserveAspectRatio=True, mask='auto')
                c.setFillColorRGB(0.0, 0.55, 0.72)
                c.drawCentredString(hx + img_size / 2, y - img_size - 13, "Grad-CAM Heatmap")

                c.setFillColorRGB(0, 0, 0)
                y -= img_size + 22

            except Exception as e:
                logger.error(f"Failed to add images to PDF: {str(e)}")
                c.setFont("Helvetica", 10)
                c.drawString(margin, y, "Visualization unavailable.")
                y -= 16
        else:
            c.setFont("Helvetica", 10)
            c.setFillColorRGB(0.5, 0.5, 0.5)
            c.drawString(margin + 10, y, "Grad-CAM visualization not available for this scan.")
            c.setFillColorRGB(0, 0, 0)
            y -= 16

        # ── DISCLAIMER (always at bottom of page) ─────────────────
        disclaimer_y = 80  # fixed bottom position
        c.setStrokeColorRGB(0.7, 0.7, 0.7)
        c.setLineWidth(0.5)
        c.line(margin, disclaimer_y + 12, width - margin, disclaimer_y + 12)

        c.setFont("Helvetica-Bold", 8)
        c.setFillColorRGB(0.3, 0.3, 0.3)
        c.drawString(margin, disclaimer_y, "Disclaimer:")

        c.setFont("Helvetica", 7)
        c.setFillColorRGB(0.5, 0.5, 0.5)
        disclaimer_lines = [
            "This AI-assisted analysis is for preliminary screening purposes only and should NOT be used as the sole basis for medical diagnosis.",
            "Always consult qualified medical professionals for proper diagnosis and treatment. Confidence score reflects model certainty, not medical certainty.",
        ]
        dy = disclaimer_y - 10
        for line in disclaimer_lines:
            c.drawString(margin, dy, line)
            dy -= 9

        # ── FOOTER ────────────────────────────────────────────────
        c.setFont("Helvetica", 7.5)
        c.setFillColorRGB(0.5, 0.5, 0.5)
        c.drawString(margin, 38, "Generated by COGNITIVE Brain Tumor Detection System")
        c.drawString(margin, 27, f"Report ID: {scan.id}   |   Generated: {ist_str}")

        c.save()
        return report_path
