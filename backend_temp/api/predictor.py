"""
ML Model Predictor for Brain Tumor Detection
"""
import os
import numpy as np
from PIL import Image
import tensorflow as tf
import keras
import logging
from .gradcam import generate_gradcam_for_prediction

logger = logging.getLogger(__name__)


class BrainTumorPredictor:
    """Brain Tumor Detection Model Predictor"""
    
    # Class labels (alphabetical order matching training)
    CLASSES = ['glioma', 'meningioma', 'notumor', 'pituitary']
    
    # Model configuration
    IMG_SIZE = (128, 128)
    
    def __init__(self, model_path: str = '../../best_vgg16.keras'):
        """
        Initialize predictor and load model
        
        Args:
            model_path: Path to the .keras model file (relative to backend_temp/api/)
        """
        self.model = None
        # Get absolute path relative to this file's directory
        current_dir = os.path.dirname(os.path.abspath(__file__))
        self.model_path = os.path.join(current_dir, model_path)
        self._load_model()
    
    def _load_model(self):
        """Load the trained model from disk"""
        try:
            if not os.path.exists(self.model_path):
                raise FileNotFoundError(f"Model file not found at {self.model_path}")
            
            logger.info(f"Loading Keras model from {self.model_path}")
            
            # Load the .keras model file directly
            self.model = keras.models.load_model(self.model_path)
            logger.info("✅ Model loaded successfully!")
            logger.info(f"Model input shape: {self.model.input_shape}")
            logger.info(f"Model output shape: {self.model.output_shape}")
            logger.info(f"Number of classes: {len(self.CLASSES)}")
            
        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            raise RuntimeError(f"Model loading failed: {str(e)}")
    
    def preprocess_image(self, image_path: str) -> np.ndarray:
        """
        Preprocess image for model prediction
        
        Args:
            image_path: Path to the image file
            
        Returns:
            Preprocessed image array ready for prediction
        """
        try:
            # Load image
            img = Image.open(image_path)
            
            # Convert to RGB if needed
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Resize to model input size
            img = img.resize(self.IMG_SIZE)
            
            # Convert to numpy array
            img_array = np.array(img)
            
            # Normalize pixel values to [0, 1]
            img_array = img_array.astype('float32') / 255.0
            
            # Add batch dimension
            img_array = np.expand_dims(img_array, axis=0)
            
            return img_array
            
        except Exception as e:
            logger.error(f"Image preprocessing failed: {str(e)}")
            raise ValueError(f"Invalid image file: {str(e)}")
    
    def predict(self, image_path: str, generate_heatmap: bool = False) -> dict:
        """
        Predict tumor type from MRI scan
        
        Args:
            image_path: Path to the MRI image
            generate_heatmap: Whether to generate Grad-CAM heatmap
            
        Returns:
            Dictionary containing prediction results
        """
        try:
            if self.model is None:
                raise RuntimeError("Model not loaded")
            
            logger.info(f"=" * 60)
            logger.info(f"PREDICTION START - Image: {image_path}")
            
            # Load original image for heatmap
            original_img = Image.open(image_path)
            if original_img.mode != 'RGB':
                original_img = original_img.convert('RGB')
            
            # Preprocess image
            img_array = self.preprocess_image(image_path)
            logger.info(f"Preprocessed shape: {img_array.shape}")
            
            # Run prediction
            predictions = self.model.predict(img_array, verbose=0)
            logger.info(f"Raw predictions shape: {predictions.shape}")
            logger.info(f"Raw predictions: {predictions[0]}")
            
            # Get class probabilities (already softmax from model)
            probabilities = predictions[0]
            
            # Get predicted class index
            predicted_idx = np.argmax(probabilities)
            logger.info(f"Predicted index: {predicted_idx}")
            logger.info(f"Class at index {predicted_idx}: {self.CLASSES[predicted_idx]}")
            
            # Get predicted class label
            predicted_label = self.CLASSES[predicted_idx]
            
            # Get confidence score
            confidence = float(probabilities[predicted_idx])
            
            # Check confidence threshold
            CONFIDENCE_THRESHOLD = 0.70  # 70% minimum confidence
            
            if confidence < CONFIDENCE_THRESHOLD:
                logger.warning(f"Low confidence: {confidence:.2%} < {CONFIDENCE_THRESHOLD:.0%}")
                predicted_label = 'uncertain'
                display_label = 'Uncertain - Please Consult Doctor'
            elif predicted_label == 'notumor':
                predicted_label = 'no_tumor'
                display_label = 'No Tumor Detected'
            else:
                display_label = predicted_label.capitalize()
            
            # Create probabilities dictionary
            prob_dict = {
                'glioma': float(probabilities[0]),
                'meningioma': float(probabilities[1]),
                'no_tumor': float(probabilities[2]),
                'pituitary': float(probabilities[3])
            }
            
            logger.info(f"Probability mapping:")
            logger.info(f"  Index 0 (glioma): {probabilities[0]:.4f}")
            logger.info(f"  Index 1 (meningioma): {probabilities[1]:.4f}")
            logger.info(f"  Index 2 (notumor/no_tumor): {probabilities[2]:.4f}")
            logger.info(f"  Index 3 (pituitary): {probabilities[3]:.4f}")
            
            # Generate Grad-CAM heatmap
            heatmap_path = None
            if generate_heatmap and predicted_label != 'uncertain':
                try:
                    # Create heatmap filename
                    filename = os.path.basename(image_path)
                    heatmap_filename = f"heatmap_{filename}"
                    heatmap_path = os.path.join("heatmaps", heatmap_filename)
                    
                    # Generate heatmap
                    logger.info("Generating Grad-CAM heatmap...")
                    heatmap_path = generate_gradcam_for_prediction(
                        self.model,
                        img_array,
                        original_img,
                        heatmap_path
                    )
                    logger.info(f"Heatmap generated: {heatmap_path}")
                except Exception as e:
                    logger.warning(f"Heatmap generation failed: {str(e)}")
                    heatmap_path = None
            
            result = {
                'prediction': predicted_label,
                'display_label': display_label,
                'confidence': round(confidence, 4),
                'probabilities': prob_dict,
                'heatmap_path': heatmap_path
            }
            
            logger.info(f"Final prediction: {predicted_label} (confidence: {confidence:.2%})")
            logger.info(f"=" * 60)
            return result
            
        except Exception as e:
            logger.error(f"Prediction failed: {str(e)}")
            raise RuntimeError(f"Prediction error: {str(e)}")


# Global predictor instance (loaded once at startup)
_predictor_instance = None


def get_predictor() -> BrainTumorPredictor:
    """
    Get or create the global predictor instance
    
    Returns:
        BrainTumorPredictor instance
    """
    global _predictor_instance
    
    if _predictor_instance is None:
        _predictor_instance = BrainTumorPredictor()
    
    return _predictor_instance