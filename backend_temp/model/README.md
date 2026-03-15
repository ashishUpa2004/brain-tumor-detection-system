# Model Directory

Your trained `MRI_model.h5` file is located in the root Cognitive folder.

The predictor automatically finds it at `../MRI_model.h5` (relative to backend_temp/api/).

## Model Requirements

- **File name**: `MRI_model.h5`
- **Location**: Root Cognitive folder ✅
- **Input size**: 128x128 RGB
- **Classes**: ['glioma', 'meningioma', 'notumor', 'pituitary']
- **Framework**: TensorFlow/Keras
- **Accuracy**: 88%

## Usage

The model will be automatically loaded when the server starts.

If the model file is not found, the system will fall back to mock predictions.

## File Structure

```
Cognitive/
├── MRI_model.h5  ← Your model is here
└── backend_temp/
    └── api/
        └── predictor.py (finds model at ../MRI_model.h5)
```
