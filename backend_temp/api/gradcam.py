"""
Grad-CAM (Gradient-weighted Class Activation Mapping) Implementation
Visualizes which parts of the image the model focuses on for prediction
"""
import numpy as np
import tensorflow as tf
import keras
from PIL import Image
import cv2
import os
import logging

logger = logging.getLogger(__name__)


class GradCAM:
    """Generate Grad-CAM heatmaps for CNN models"""
    
    def __init__(self, model, layer_name=None):
        self.model = model
        self._nested_model = None
        self.layer_name = layer_name or self._find_target_layer()
        
        if not self.layer_name:
            raise ValueError("Could not find convolutional layer in model")
        
        logger.info(f"Using layer '{self.layer_name}' for Grad-CAM "
                    f"(nested={self._nested_model is not None})")
    
    def _find_target_layer(self):
        """Find the last conv layer - checks top-level then nested sub-models"""
        for layer in reversed(self.model.layers):
            if 'conv' in layer.name.lower():
                return layer.name
        for layer in self.model.layers:
            if hasattr(layer, 'layers'):
                for sublayer in reversed(layer.layers):
                    if 'conv' in sublayer.name.lower():
                        self._nested_model = layer
                        return sublayer.name
        return None
    
    def generate_heatmap(self, img_array, pred_index=None):
        """
        Generate Grad-CAM heatmap.
        
        Strategy for nested models (e.g. VGG16 inside wrapper):
        - conv_model: nested_model.input → conv_layer.output  (uses nested model's own graph)
        - classifier_model: conv_layer.output → final prediction (layers after conv in nested + outer layers)
        - Use tf.Variable to allow GradientTape to track conv outputs
        """
        try:
            img_tensor = tf.cast(img_array, tf.float32)
            
            if self._nested_model is not None:
                nested = self._nested_model
                
                # Build conv_model WITHIN the nested model's own graph
                conv_model = keras.models.Model(
                    inputs=nested.input,
                    outputs=nested.get_layer(self.layer_name).output,
                    name="conv_extractor"
                )
                
                # Build classifier: layers after conv in nested model + outer layers after nested
                conv_out_shape = tuple(s for s in nested.get_layer(self.layer_name).output.shape[1:])
                
                nested_post_conv = []
                found = False
                for layer in nested.layers:
                    if found:
                        nested_post_conv.append(layer)
                    if layer.name == self.layer_name:
                        found = True
                
                outer_post_nested = []
                found = False
                for layer in self.model.layers:
                    if found:
                        outer_post_nested.append(layer)
                    if layer.name == nested.name:
                        found = True
                
                inp = keras.Input(shape=conv_out_shape)
                x = inp
                for layer in nested_post_conv:
                    x = layer(x)
                for layer in outer_post_nested:
                    x = layer(x)
                classifier_model = keras.models.Model(inputs=inp, outputs=x, name="classifier")
                
                # Get conv activations (nested model takes same input as outer model)
                conv_outputs = conv_model(img_tensor)
                
            else:
                # Flat model
                conv_model = keras.models.Model(
                    inputs=self.model.inputs,
                    outputs=self.model.get_layer(self.layer_name).output,
                    name="conv_extractor"
                )
                
                conv_out_shape = tuple(s for s in self.model.get_layer(self.layer_name).output.shape[1:])
                
                post_conv = []
                found = False
                for layer in self.model.layers:
                    if found:
                        post_conv.append(layer)
                    if layer.name == self.layer_name:
                        found = True
                
                inp = keras.Input(shape=conv_out_shape)
                x = inp
                for layer in post_conv:
                    x = layer(x)
                classifier_model = keras.models.Model(inputs=inp, outputs=x, name="classifier")
                
                conv_outputs = conv_model(img_tensor)
            
            # Get predicted class
            preds = classifier_model(conv_outputs)
            if pred_index is None:
                pred_index = int(tf.argmax(preds[0]).numpy())
            
            # Compute gradients w.r.t. conv outputs using tf.Variable
            conv_var = tf.Variable(conv_outputs)
            with tf.GradientTape() as tape:
                preds2 = classifier_model(conv_var)
                class_score = preds2[:, pred_index]
            
            grads = tape.gradient(class_score, conv_var)
            
            if grads is None:
                raise ValueError("Gradients are None - cannot compute Grad-CAM")
            
            pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2)).numpy()
            conv_np = conv_outputs[0].numpy()
            
            for i in range(pooled_grads.shape[0]):
                conv_np[:, :, i] *= pooled_grads[i]
            
            heatmap = np.mean(conv_np, axis=-1)
            heatmap = np.maximum(heatmap, 0)
            if heatmap.max() > 0:
                heatmap /= heatmap.max()
            
            return heatmap
            
        except Exception as e:
            logger.error(f"Grad-CAM generation failed: {str(e)}")
            raise
    
    def overlay_heatmap(self, heatmap, original_img, alpha=0.4, colormap=cv2.COLORMAP_JET):
        """Overlay heatmap on original image"""
        try:
            if isinstance(original_img, Image.Image):
                original_img = np.array(original_img)
            img_h, img_w = original_img.shape[:2]
            heatmap_resized = cv2.resize(heatmap, (img_w, img_h))
            heatmap_colored = cv2.applyColorMap(np.uint8(255 * heatmap_resized), colormap)
            heatmap_colored = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)
            overlayed = cv2.addWeighted(original_img, 1 - alpha, heatmap_colored, alpha, 0)
            return Image.fromarray(overlayed.astype(np.uint8))
        except Exception as e:
            logger.error(f"Heatmap overlay failed: {str(e)}")
            raise
    
    def save_heatmap(self, heatmap, original_img, save_path, alpha=0.4):
        """Generate and save heatmap overlay"""
        try:
            os.makedirs(os.path.dirname(os.path.abspath(save_path)), exist_ok=True)
            overlayed_img = self.overlay_heatmap(heatmap, original_img, alpha)
            overlayed_img.save(save_path)
            logger.info(f"Heatmap saved to: {save_path}")
            return save_path
        except Exception as e:
            logger.error(f"Failed to save heatmap: {str(e)}")
            raise


def generate_gradcam_for_prediction(model, img_array, original_img, save_path):
    """Convenience function to generate and save a Grad-CAM heatmap."""
    try:
        gradcam = GradCAM(model)
        heatmap = gradcam.generate_heatmap(img_array)
        return gradcam.save_heatmap(heatmap, original_img, save_path)
    except Exception as e:
        logger.error(f"Grad-CAM generation failed: {str(e)}")
        return None
