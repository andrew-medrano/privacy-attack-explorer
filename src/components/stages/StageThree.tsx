import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, BarChart, Bar } from 'recharts';
import { Sliders, RefreshCcw, Shield } from 'lucide-react';

interface StageThreeProps {
  onComplete: () => void;
}

const generateRegularizationResults = (regularization: number) => {
  // Generate 100 data points with more overlap based on regularization
  // When regularization is high (>0.7), both accuracies decrease
  const isOverRegularized = regularization > 0.7;
  
  const baseAccuracyTraining = isOverRegularized 
    ? Math.max(0.5, 0.9 - (regularization * 0.7)) // Drops more sharply when over-regularized
    : Math.max(0.65, 0.9 - (regularization * 0.4));
    
  const baseAccuracyNonTraining = isOverRegularized
    ? Math.max(0.5, 0.85 - (regularization * 0.5)) // Also decreases when over-regularized
    : Math.min(0.85, 0.6 + (regularization * 0.25));
  
  const data = Array.from({ length: 20 }, (_, i) => {
    const confidence = i * 5;
    const trainingCount = Math.floor(100 * Math.exp(-Math.pow((confidence - baseAccuracyTraining * 100) / (20 + regularization * 10), 2)));
    const nonTrainingCount = Math.floor(100 * Math.exp(-Math.pow((confidence - baseAccuracyNonTraining * 100) / (20 + regularization * 10), 2)));
    
    return {
      confidence: `${confidence}-${confidence + 4}`,
      training: trainingCount,
      nonTraining: nonTrainingCount,
      total: trainingCount + nonTrainingCount // Combined count for initial view
    };
  });

  return data;
};

const StageThree: React.FC<StageThreeProps> = ({ onComplete }) => {
  const [regularization, setRegularization] = useState([0.2]);
  const [threshold, setThreshold] = useState([70]);
  const [results, setResults] = useState<any[]>([]);
  const [showColorCoded, setShowColorCoded] = useState(false);
  const [isModelTrained, setIsModelTrained] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleTrainModel = () => {
    const newResults = generateRegularizationResults(regularization[0]);
    setResults(newResults);
    setIsModelTrained(true);
    setShowColorCoded(false);
  };

  const handleConfirmThreshold = () => {
    setShowColorCoded(true);
    setAttempts(prev => prev + 1);
  };

  const handleReset = () => {
    setIsModelTrained(false);
    setShowColorCoded(false);
    setResults([]);
  };

  const calculateAccuracy = () => {
    if (!results.length) return null;

    const thresholdValue = threshold[0];
    let truePositives = 0;
    let totalPredictions = 0;

    results.forEach(point => {
      const confidenceMin = parseInt(point.confidence.split('-')[0]);
      if (confidenceMin >= thresholdValue) {
        truePositives += point.training;
        totalPredictions += point.training + point.nonTraining;
      }
    });

    return {
      accuracy: ((truePositives / totalPredictions) * 100).toFixed(1),
      truePositives,
      totalPredictions
    };
  };

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-4">Stage 3: Differential Privacy</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Model Settings</h3>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Privacy Budget (ε)</label>
              <Slider 
                defaultValue={[0.2]} 
                max={1} 
                step={0.1}
                value={regularization}
                onValueChange={setRegularization}
                disabled={isModelTrained}
              />
              <span className="text-sm text-muted-foreground mt-1 block">
                ε = {regularization[0]} (smaller values provide stronger privacy)
              </span>
            </div>
            {isModelTrained && !showColorCoded && (
              <div>
                <label className="text-sm font-medium mb-2 block">Confidence Threshold (%)</label>
                <Slider 
                  defaultValue={[70]} 
                  max={100} 
                  step={1}
                  value={threshold}
                  onValueChange={setThreshold}
                />
                <span className="text-sm text-muted-foreground mt-1 block">
                  Classifying as training data when confidence ≥ {threshold[0]}%
                </span>
              </div>
            )}
            <div className="p-4 bg-secondary/10 rounded-lg">
              <div className="flex gap-2 items-start">
                <Shield className="w-4 h-4 mt-1" />
                <p className="text-sm text-muted-foreground">
                  Differential privacy adds controlled noise to protect individual privacy. 
                  A smaller privacy budget (ε) means more noise and stronger privacy, but may reduce model accuracy.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {!isModelTrained && (
                <Button className="flex-1" onClick={handleTrainModel}>
                  Train Model
                </Button>
              )}
              {isModelTrained && !showColorCoded && (
                <Button className="flex-1" onClick={handleConfirmThreshold}>
                  Confirm Threshold
                </Button>
              )}
              {showColorCoded && (
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="destructive"
                    onClick={handleReset}
                    className="bg-[#ea384c] hover:bg-red-600"
                  >
                    <RefreshCcw className="mr-2" />
                    Restart
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={onComplete}
                    className="bg-[#F2FCE2] hover:bg-green-100 text-green-800"
                  >
                    Next Stage
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Confidence Distribution</h3>
          <div className="h-[300px]">
            {results.length > 0 ? (
              <div className="space-y-4">
                {!showColorCoded ? (
                  <BarChart width={400} height={200} data={results}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="confidence" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#94a3b8" name="All Predictions" />
                    <ReferenceLine
                      x={`${Math.floor(threshold[0] / 5) * 5}-${Math.floor(threshold[0] / 5) * 5 + 4}`}
                      stroke="red"
                      strokeDasharray="3 3"
                      label={{ value: `Threshold: ${threshold[0]}%`, position: 'top' }}
                    />
                  </BarChart>
                ) : (
                  <>
                    <AreaChart width={400} height={200} data={results}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="confidence" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="training" 
                        stroke="#ef4444" 
                        fill="#ef4444" 
                        fillOpacity={0.3}
                        name="Training Data"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="nonTraining" 
                        stroke="#9b87f5" 
                        fill="#9b87f5" 
                        fillOpacity={0.3}
                        name="Non-training Data"
                      />
                      <ReferenceLine
                        x={`${Math.floor(threshold[0] / 5) * 5}-${Math.floor(threshold[0] / 5) * 5 + 4}`}
                        stroke="red"
                        strokeDasharray="3 3"
                        label={{ value: `Threshold: ${threshold[0]}%`, position: 'top' }}
                      />
                    </AreaChart>
                    {calculateAccuracy() && (
                      <Card className="p-4">
                        <h4 className="font-semibold mb-2">Attack Results</h4>
                        <p className="text-sm">
                          Accuracy: {calculateAccuracy()?.accuracy}%
                          <br />
                          True Positives: {calculateAccuracy()?.truePositives}
                          <br />
                          Total Predictions: {calculateAccuracy()?.totalPredictions}
                        </p>
                        <p className="text-sm text-muted-foreground mt-4">
                          {regularization[0] > 0.7 
                            ? "The model's privacy protection is too strong, causing the predictions to become less distinguishable and less accurate."
                            : "Differential privacy provides some protection by adding calibrated noise, reducing the model's ability to reveal membership information while maintaining some predictive power."}
                        </p>
                      </Card>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="h-full bg-secondary/10 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Train the model to see distribution</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StageThree;
