
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { Sliders, RefreshCcw } from 'lucide-react';

interface StageThreeProps {
  onComplete: () => void;
}

const generateRegularizationResults = (regularization: number) => {
  // Generate 100 data points with more overlap based on regularization
  const baseAccuracyTraining = Math.max(0.65, 0.9 - (regularization * 0.4));
  const baseAccuracyNonTraining = Math.min(0.85, 0.6 + (regularization * 0.25));
  
  const data = Array.from({ length: 20 }, (_, i) => {
    const confidence = i * 5;
    const trainingCount = Math.floor(100 * Math.exp(-Math.pow((confidence - baseAccuracyTraining * 100) / (20 + regularization * 10), 2)));
    const nonTrainingCount = Math.floor(100 * Math.exp(-Math.pow((confidence - baseAccuracyNonTraining * 100) / (20 + regularization * 10), 2)));
    
    return {
      confidence: `${confidence}-${confidence + 4}`,
      training: trainingCount,
      nonTraining: nonTrainingCount,
    };
  });

  return data;
};

const StageThree: React.FC<StageThreeProps> = ({ onComplete }) => {
  const [regularization, setRegularization] = useState([0.2]);
  const [threshold, setThreshold] = useState([70]);
  const [results, setResults] = useState<any[]>([]);
  const [attacked, setAttacked] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleApplyDefense = () => {
    const newResults = generateRegularizationResults(regularization[0]);
    setResults(newResults);
    setAttacked(true);
    setAttempts(prev => prev + 1);
  };

  const handleReset = () => {
    setAttacked(false);
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
      <h2 className="text-2xl font-bold mb-4">Stage 3: Regularization Defense</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Model Settings</h3>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Regularization Strength</label>
              <Slider 
                defaultValue={[0.2]} 
                max={1} 
                step={0.1}
                value={regularization}
                onValueChange={setRegularization}
              />
              <span className="text-sm text-muted-foreground mt-1 block">
                Strength = {regularization[0]} (higher values reduce overfitting)
              </span>
            </div>
            {attacked && (
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
                <Sliders className="w-4 h-4 mt-1" />
                <p className="text-sm text-muted-foreground">
                  Regularization helps prevent overfitting by penalizing complex models, 
                  making it harder to memorize individual training examples.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleApplyDefense}>
                {attacked ? "Try Again" : "Apply Regularization"}
              </Button>
              {attacked && (
                <>
                  <Button variant="outline" onClick={handleReset}>
                    <RefreshCcw className="mr-2" />
                    Reset
                  </Button>
                  <Button variant="secondary" onClick={onComplete}>
                    Next Stage
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Confidence Distribution</h3>
          <div className="h-[300px]">
            {results.length > 0 ? (
              <div className="space-y-4">
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
                  {attacked && (
                    <ReferenceLine
                      x={`${Math.floor(threshold[0] / 5) * 5}-${Math.floor(threshold[0] / 5) * 5 + 4}`}
                      stroke="red"
                      strokeDasharray="3 3"
                      label={{ value: `Threshold: ${threshold[0]}%`, position: 'top' }}
                    />
                  )}
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
                      Regularization provides some protection by reducing overfitting,
                      but the model's predictions still reveal membership information,
                      though with less certainty than before.
                    </p>
                  </Card>
                )}
              </div>
            ) : (
              <div className="h-full bg-secondary/10 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Apply regularization to see distribution</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StageThree;
