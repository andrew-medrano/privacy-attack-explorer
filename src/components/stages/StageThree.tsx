
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";

interface StageThreeProps {
  onComplete: () => void;
}

const calculateAccuracy = () => {
  // Sample data for the attack accuracy calculation
  const truePositives = 50;
  const totalPredictions = 250;
  const accuracy = (truePositives / totalPredictions) * 100;
  const baselineAccuracy = 20; // 20% of data was in training set
  
  const accuracyDescription = 
    accuracy > baselineAccuracy * 1.5 ? "The attack was significantly more successful than random guessing" :
    accuracy > baselineAccuracy * 1.2 ? "The attack was moderately more successful than random guessing" :
    accuracy > baselineAccuracy ? "The attack was slightly more successful than random guessing" :
    "The attack performed no better than random guessing";
  
  return { 
    accuracy,
    baselineAccuracy,
    truePositives,
    totalPredictions,
    accuracyDescription
  };
};

const StageThree: React.FC<StageThreeProps> = ({ onComplete }) => {
  const [epsilon, setEpsilon] = useState([0.5]); // Differential privacy parameter
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Stage 3: Differential Privacy Protection</h2>
      
      {calculateAccuracy() && (
        <Card className="p-4 mt-4">
          <h4 className="font-semibold mb-2">Attack Results</h4>
          <p className="text-sm">
            Attack Accuracy: {calculateAccuracy()?.accuracy.toFixed(1)}%
            <br />
            Baseline Accuracy: {calculateAccuracy()?.baselineAccuracy}% 
            (random guessing based on training set proportion)
            <br />
            True Positives: {calculateAccuracy()?.truePositives}
            <br />
            Total Predictions: {calculateAccuracy()?.totalPredictions}
            <br />
            Result: {calculateAccuracy()?.accuracyDescription}
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            {epsilon[0] > 0.7 
              ? "The model's privacy protection is weak with high epsilon, making the predictions more distinguishable and potentially leaking more information about membership."
              : "Differential privacy provides protection by adding calibrated noise, reducing the model's ability to reveal membership information while maintaining some predictive power."}
          </p>
        </Card>
      )}
      
      <button 
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-6"
        onClick={onComplete}
      >
        Complete Stage
      </button>
    </div>
  );
};

export default StageThree;
