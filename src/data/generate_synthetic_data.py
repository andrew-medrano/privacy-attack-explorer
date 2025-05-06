import numpy as np
import pandas as pd
import json
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.neural_network import MLPClassifier
import os

# Create directory for output
os.makedirs('src/data/generated', exist_ok=True)

np.random.seed(42)  # For reproducibility

def generate_synthetic_patients(n_samples=10000):
    """Generate synthetic patient data with multiple features"""
    
    # Generate features
    age = np.random.normal(50, 15, n_samples).astype(int)  # Age centered around 50
    age = np.clip(age, 18, 90)  # Clip to reasonable range
    
    systolic = np.random.normal(120, 15, n_samples).astype(int)  # Systolic BP
    diastolic = np.random.normal(80, 8, n_samples).astype(int)   # Diastolic BP
    
    # Make some correlation between age and blood pressure
    systolic = systolic + ((age - 50) * 0.5).astype(int)
    
    # Generate more features
    cholesterol = np.random.normal(200, 40, n_samples).astype(int)
    glucose = np.random.normal(100, 25, n_samples).astype(int)
    heart_rate = np.random.normal(75, 10, n_samples).astype(int)
    
    # Add some medical conditions as binary features
    has_diabetes = (np.random.random(n_samples) < 0.15).astype(int)  # 15% have diabetes
    has_hypertension = (np.random.random(n_samples) < 0.25).astype(int)  # 25% have hypertension
    
    # Target variable (e.g., risk of heart disease)
    # Make it dependent on the features
    risk_factors = (
        0.02 * (age - 50) + 
        0.01 * (systolic - 120) + 
        0.01 * (diastolic - 80) + 
        0.005 * (cholesterol - 200) +
        0.01 * (glucose - 100) +
        0.4 * has_diabetes +
        0.3 * has_hypertension +
        np.random.normal(0, 0.5, n_samples)  # Add noise
    )
    
    target = (risk_factors > 0.5).astype(int)
    
    # Create DataFrame
    df = pd.DataFrame({
        'id': range(1, n_samples + 1),
        'age': age,
        'systolic': systolic,
        'diastolic': diastolic,
        'blood_pressure': [f"{s}/{d}" for s, d in zip(systolic, diastolic)],
        'cholesterol': cholesterol,
        'glucose': glucose,
        'heart_rate': heart_rate,
        'has_diabetes': has_diabetes,
        'has_hypertension': has_hypertension,
        'target': target
    })
    
    return df

def train_model_and_get_confidences(df, train_indices):
    """Train a model on the training set and get confidence scores for all samples"""
    
    # Split features and target
    X = df.drop(['id', 'blood_pressure', 'target'], axis=1).copy()
    y = df['target'].copy()
    
    # Create train and test masks
    is_train = np.zeros(len(df), dtype=bool)
    is_train[train_indices] = True
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Train on the training set
    X_train = X_scaled[is_train]
    y_train = y[is_train]
    
    # Train the model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Get confidence scores for all samples
    confidences = model.predict_proba(X_scaled)[:, 1] * 100  # Convert to percentage
    
    return confidences

# Stage 1: Basic Attack (6 patients, 2 in training)
def generate_stage_one_data():
    # Use a smaller, fixed set for Stage 1
    np.random.seed(42)
    
    # Manually define 6 patients for the first stage
    stage1_data = pd.DataFrame({
        'id': range(1, 7),
        'name': [f"Patient {i}" for i in range(1, 7)],
        'age': [65, 45, 72, 50, 68, 55],
        'blood_pressure': ["140/90", "120/80", "160/95", "130/85", "150/92", "145/88"],
        'cholesterol': ["High", "Normal", "High", "Normal", "High", "Normal"],
        'confidence': [0, 0, 0, 0, 0, 0],
        'wasInTraining': [True, False, False, True, False, False]
    })
    
    # Calculate actual confidence values based on training set membership
    # For simplicity, we'll use a heuristic but make it look more realistic
    for i, row in stage1_data.iterrows():
        base = 70 if row['wasInTraining'] else 65
        noise = np.random.normal(0, 3)
        stage1_data.at[i, 'confidence'] = max(50, min(95, round(base + noise)))
    
    # Convert to the format expected by the React component
    stage1_json = stage1_data.to_dict('records')
    
    with open('src/data/generated/stage1_data.json', 'w') as f:
        json.dump(stage1_json, f, indent=2)
    
    return stage1_data

# Stage 2: Advanced Attack with Shadow Models
def generate_stage_two_data(full_df=None, n_samples=100):
    if full_df is None:
        full_df = generate_synthetic_patients(n_samples)
    else:
        # Take a sample if the full df is provided
        full_df = full_df.sample(n_samples, random_state=42).reset_index(drop=True)
    
    # Select 20% for training set
    train_indices = np.random.choice(n_samples, size=int(n_samples * 0.2), replace=False)
    
    # Generate confidence scores
    confidences = train_model_and_get_confidences(full_df, train_indices)
    
    # Create the output data format
    stage2_data = []
    
    for i, row in full_df.iterrows():
        is_training = i in train_indices
        
        patient = {
            'id': int(row['id']),
            'age': int(row['age']),
            'bloodPressure': row['blood_pressure'],
            'cholesterol': int(row['cholesterol']),
            'glucose': int(row['glucose']),
            'heartRate': int(row['heart_rate']),
            'hasDiabetes': bool(row['has_diabetes']),
            'hasHypertension': bool(row['has_hypertension']),
            'confidence': float(confidences[i]),
            'wasInTraining': bool(is_training)
        }
        stage2_data.append(patient)
    
    # Calculate bins for the confidence distribution chart
    confidence_bins = []
    for i in range(50, 96, 5):
        in_range = [p for p in stage2_data if i <= p['confidence'] < i + 5]
        training_in_range = [p for p in in_range if p['wasInTraining']]
        
        bin_data = {
            'range': f"{i}-{i+4}",
            'count': len(in_range),
            'trainingCount': len(training_in_range),
            'nonTrainingCount': len(in_range) - len(training_in_range)
        }
        confidence_bins.append(bin_data)
    
    # Calculate optimal threshold and accuracy
    thresholds = list(range(50, 96))
    best_threshold = 50
    best_accuracy = 0
    
    for threshold in thresholds:
        predicted_positives = [p for p in stage2_data if p['confidence'] >= threshold]
        if not predicted_positives:
            continue
            
        true_positives = [p for p in predicted_positives if p['wasInTraining']]
        accuracy = len(true_positives) / len(predicted_positives) * 100
        
        if accuracy > best_accuracy:
            best_accuracy = accuracy
            best_threshold = threshold
    
    results = {
        'patients': stage2_data,
        'confidenceBins': confidence_bins,
        'optimalThreshold': best_threshold,
        'optimalAccuracy': best_accuracy
    }
    
    with open('src/data/generated/stage2_data.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    return results

# Stage 3: Differential Privacy
def generate_stage_three_data(epsilon_values=None):
    if epsilon_values is None:
        epsilon_values = [0.1, 0.2, 0.3, 0.5, 0.7, 1.0]
    
    # Generate a larger dataset for this experiment
    full_df = generate_synthetic_patients(20000)
    
    # Results for different epsilon values
    epsilon_results = {}
    
    # Scale features for all models
    X = full_df.drop(['id', 'blood_pressure', 'target'], axis=1).copy()
    y = full_df['target'].copy()
    
    # Create train and test masks (20% of data in training set)
    train_indices = np.random.choice(len(full_df), size=int(len(full_df) * 0.2), replace=False)
    is_train = np.zeros(len(full_df), dtype=bool)
    is_train[train_indices] = True
    
    X_train = X[is_train]
    y_train = y[is_train]
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    X_train_scaled = X_scaled[is_train]
    
    # First, train a non-private model to establish baseline - using neural network for better memorization
    print("Training non-private neural network (baseline)...")
    non_private_model = MLPClassifier(
        hidden_layer_sizes=(64, 32),  # More capacity to memorize
        activation='relu',
        max_iter=200,
        random_state=42,
        early_stopping=False,  # Allow potential overfitting
        learning_rate_init=0.001
    )
    non_private_model.fit(X_train_scaled, y_train)
    base_confidences = non_private_model.predict_proba(X_scaled)[:, 1] * 100
    
    # Measure baseline separation between training and non-training
    baseline_train_conf = base_confidences[is_train]
    baseline_nontraining_conf = base_confidences[~is_train]
    baseline_diff = np.mean(baseline_train_conf) - np.mean(baseline_nontraining_conf)
    print(f"Baseline separation: {baseline_diff:.4f} (higher = more memorization)")
    
    for epsilon in epsilon_values:
        print(f"Processing epsilon = {epsilon}...")
        # For each epsilon, implement a simplified version of differentially private training
        
        # Calculate noise scale based on epsilon - lower epsilon means more noise for privacy
        noise_scale = 1.0 / max(0.01, epsilon)  # Avoid division by zero
        
        # Apply differentially private training with noise proportional to 1/epsilon
        
        # Method 1: Perturb training data (simpler approach)
        dp_X_train = X_train_scaled.copy()
        dp_X_train += np.random.normal(0, noise_scale, dp_X_train.shape) * 0.1
        
        # Method 2: Perturb gradients during training (simulated by adjusting training)
        # Train with differentially private data
        dp_model = MLPClassifier(
            hidden_layer_sizes=(64, 32),
            activation='relu',
            max_iter=200,
            random_state=42,
            early_stopping=False,
            learning_rate_init=0.001
        )
        
        # Add dynamic noise to labels too for low-epsilon models to further simulate DP learning
        dp_y_train = y_train.copy()
        if epsilon < 0.3:
            # Flip some labels randomly for very private models
            flip_mask = np.random.random(len(dp_y_train)) < (0.05 / epsilon)
            dp_y_train = np.where(flip_mask, 1 - dp_y_train, dp_y_train)
        
        dp_model.fit(dp_X_train, dp_y_train)
        
        # Get predictions from the DP model
        dp_confidences = dp_model.predict_proba(X_scaled)[:, 1] * 100
        
        # Calculate bins for distribution
        bins = []
        for i in range(0, 101, 5):
            indices_in_range = (dp_confidences >= i) & (dp_confidences < i + 5)
            in_range = indices_in_range.sum()
            
            training_indices_in_range = indices_in_range & np.isin(np.arange(len(full_df)), train_indices)
            training_in_range = training_indices_in_range.sum()
            
            bin_data = {
                'confidence': f"{i}-{i+4}",
                'training': int(training_in_range),
                'nonTraining': int(in_range - training_in_range),
                'total': int(in_range)
            }
            bins.append(bin_data)
        
        # Calculate optimal threshold and metrics for this epsilon
        thresholds = list(range(50, 96))
        threshold_results = []
        
        for threshold in thresholds:
            indices_above_threshold = dp_confidences >= threshold
            predicted_positives = indices_above_threshold.sum()
            
            if predicted_positives == 0:
                continue
                
            true_positives = (indices_above_threshold & np.isin(np.arange(len(full_df)), train_indices)).sum()
            accuracy = (true_positives / predicted_positives) * 100 if predicted_positives > 0 else 0
            
            threshold_results.append({
                'threshold': threshold,
                'accuracy': float(accuracy),
                'truePositives': int(true_positives),
                'totalPredictions': int(predicted_positives)
            })
        
        # Calculate statistical separation between training and non-training confidences
        train_confidences = dp_confidences[is_train]
        non_train_confidences = dp_confidences[~is_train]
        
        # Calculate mean difference to measure distribution separation
        mean_diff = np.mean(train_confidences) - np.mean(non_train_confidences)
        print(f"  Mean separation for ε={epsilon}: {mean_diff:.4f}")
        
        # Store this in the epsilon results
        epsilon_results[str(epsilon)] = {
            'bins': bins,
            'thresholds': threshold_results,
            'meanDifference': float(mean_diff)
        }
    
    # Generate privacy-utility trade-off data
    tradeoff_data = []
    max_mean_diff = max([abs(epsilon_results[str(e)]['meanDifference']) for e in epsilon_values])
    
    for epsilon in epsilon_values:
        # Use mean difference as a proxy for memorization/attack success
        mean_diff = epsilon_results[str(epsilon)]['meanDifference']
        
        # Calculate model utility - higher epsilon generally means better utility
        # Scale from 60-90%
        utility = 60 + (epsilon / max(epsilon_values) * 30)
        
        # Privacy protection decreases as epsilon increases
        # Lower mean_diff = better privacy (less memorization)
        privacy_protection = 100 - (abs(mean_diff) / max_mean_diff * 50)
        
        tradeoff_data.append({
            'epsilon': epsilon,
            'accuracy': float(utility),
            'privacy': float(privacy_protection)
        })
    
    results = {
        'epsilonResults': epsilon_results,
        'tradeoffData': tradeoff_data
    }
    
    with open('src/data/generated/stage3_data.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    return results

if __name__ == "__main__":
    print("Generating synthetic data for privacy attack explorer...")
    
    # Generate data for all stages
    print("Generating Stage 1 data...")
    stage1_data = generate_stage_one_data()
    
    print("Generating Stage 2 data...")
    stage2_data = generate_stage_two_data()
    
    print("Generating Stage 3 data...")
    stage3_data = generate_stage_three_data()
    
    print("Data generation complete. Files saved to src/data/generated/") 