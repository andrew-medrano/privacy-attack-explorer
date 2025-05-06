# Synthetic Data Generation for Privacy Attack Explorer

This directory contains the scripts and data for the privacy attack explorer application.

## Overview

The `generate_synthetic_data.py` script creates synthetic patient data and simulates privacy attacks for the three stages of the application:

1. **Stage 1**: Basic membership inference attack with 6 patients
2. **Stage 2**: Advanced membership inference attack with 100 patients and multiple features
3. **Stage 3**: Differential privacy experiments with varying epsilon values

## Requirements

To run the data generation script, you need:

- Python 3.7+
- NumPy
- Pandas
- scikit-learn

You can install the required packages with:

```bash
pip install numpy pandas scikit-learn
```

## Running the Script

You can generate the synthetic data in two ways:

1. Using the npm script (recommended):
   ```bash
   npm run generate-data
   ```

2. Running the Python script directly:
   ```bash
   python src/data/generate_synthetic_data.py
   ```

The script will create JSON files in the `src/data/generated` directory:

- `stage1_data.json`: Data for the basic membership inference attack
- `stage2_data.json`: Data for the advanced attack with shadow models
- `stage3_data.json`: Data for the differential privacy experiments

## Data Structure

Each JSON file contains pre-calculated data in a format that matches the React components' expected structure. The files include:

- Patient information with various health metrics
- Confidence scores that simulate model predictions
- Threshold values for membership inference attacks
- Accuracy metrics for various privacy settings
- Privacy-utility tradeoff data

## Customization

You can modify the `generate_synthetic_data.py` script to adjust:

- The number of patients/samples
- The distribution of features
- The epsilon values for differential privacy
- The separation between training and non-training data

After making changes, regenerate the data using the commands above. 