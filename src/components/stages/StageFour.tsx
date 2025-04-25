
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, AreaChart, Area } from 'recharts';
import { Shield, ChartBar } from 'lucide-react';
import { ChartContainer } from "@/components/ui/chart";

interface StageFourProps {
  onComplete: () => void;
}

const generateBaseDistribution = () => {
  // Generate synthetic prediction distribution for training vs non-training data
  return Array.from({ length: 20 }, (_, i) => {
    const confidence = i * 5;
    const trainingCount = Math.floor(100 * Math.exp(-Math.pow((confidence - 75) / 15, 2)));
    const nonTrainingCount = Math.floor(100 * Math.exp(-Math.pow((confidence - 60) / 20, 2)));
    
    return {
      confidence: `${confidence}-${confidence + 4}`,
      training: trainingCount,
      nonTraining: nonTrainingCount,
      total: trainingCount + nonTrainingCount
    };
  });
};

const applyDifferentialPrivacy = (data: any[], epsilon: number) => {
  return data.map(point => {
    // Add Laplace noise scaled by epsilon
    const noise = (1 / epsilon) * (Math.random() - 0.5) * 20;
    const noisyTraining = Math.max(0, Math.floor(point.training + noise));
    const noisyNonTraining = Math.max(0, Math.floor(point.nonTraining + noise));
    
    return {
      confidence: point.confidence,
      training: noisyTraining,
      nonTraining: noisyNonTraining,
      total: noisyTraining + noisyNonTraining
    };
  });
};

const calculateAccuracyVsEpsilon = () => {
  // Generate accuracy data points for different epsilon values
  return Array.from({ length: 10 }, (_, i) => {
    const epsilon = (i + 1) * 0.5;
    const privacyStrength = 1 / epsilon;
    const accuracy = Math.max(50, 90 - (privacyStrength * 15)); // Base accuracy reduced by privacy strength
    
    return {
      epsilon: epsilon.toFixed(1),
      accuracy
    };
  });
};

const StageFour: React.FC<StageFourProps> = ({ onComplete }) => {
  const [baseDistribution, setBaseDistribution] = useState<any[]>([]);
  const [dpDistribution, setDpDistribution] = useState<any[]>([]);
  const [epsilon, setEpsilon] = useState([1]);
  const [threshold, setThreshold] = useState([70]);
  const [showColorCoded, setShowColorCoded] = useState(false);
  const [modelTrained, setModelTrained] = useState(false);
  const [dpApplied, setDpApplied] = useState(false);

  const handleTrainModel = () => {
    const distribution = generateBaseDistribution();
    setBaseDistribution(distribution);
    setModelTrained(true);
    setShowColorCoded(false);
    setDpApplied(false);
  };

  const handleApplyDP = () => {
    const noisyDistribution = applyDifferentialPrivacy(baseDistribution, epsilon[0]);
    setDpDistribution(noisyDistribution);
    setDpApplied(true);
    setShowColorCoded(false);
  };

  const handleConfirmThreshold = () => {
    setShowColorCoded(true);
  };

  const calculateCurrentAccuracy = () => {
    if (!showColorCoded || !dpDistribution.length) return null;

    const thresholdValue = threshold[0];
    let truePositives = 0;
    let totalPredictions = 0;

    dpDistribution.forEach(point => {
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
      <h2 className="text-2xl font-bold mb-4">Stage 4: Differential Privacy</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
          <div className="space-y-6">
            {!modelTrained && (
              <Button className="w-full" onClick={handleTrainModel}>
                Train Model
              </Button>
            )}

            {modelTrained && !dpApplied && (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Privacy Budget (ε)
                  </label>
                  <Slider
                    defaultValue={[1]}
                    min={0.1}
                    max={5}
                    step={0.1}
                    value={epsilon}
                    onValueChange={setEpsilon}
                  />
                  <span className="text-sm text-muted-foreground mt-1 block">
                    ε = {epsilon[0]} (smaller values = stronger privacy)
                  </span>
                </div>
                <Button className="w-full" onClick={handleApplyDP}>
                  Apply Privacy Defense
                </Button>
              </>
            )}

            {dpApplied && !showColorCoded && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Confidence Threshold (%)
                </label>
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
                <Button className="w-full mt-4" onClick={handleConfirmThreshold}>
                  Confirm Threshold
                </Button>
              </div>
            )}

            {showColorCoded && (
              <Button variant="secondary" onClick={onComplete}>
                Next Stage
              </Button>
            )}
            
            <div className="p-4 bg-secondary/10 rounded-lg">
              <div className="flex gap-2 items-start">
                <Shield className="w-4 h-4 mt-1" />
                <p className="text-sm text-muted-foreground">
                  Differential privacy adds controlled random noise to protect individual privacy 
                  while maintaining overall utility. Lower epsilon values provide stronger privacy 
                  but may reduce model accuracy.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Confidence Distribution</h3>
          <div className="h-[300px]">
            {!modelTrained && (
              <div className="h-full bg-secondary/10 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Train the model to see distribution</p>
              </div>
            )}

            {modelTrained && !dpApplied && baseDistribution.length > 0 && (
              <ChartContainer config={{}}>
                <BarChart width={400} height={200} data={baseDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="confidence" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#94a3b8" name="All Predictions" />
                </BarChart>
              </ChartContainer>
            )}

            {dpApplied && !showColorCoded && (
              <ChartContainer config={{}}>
                <BarChart width={400} height={200} data={dpDistribution}>
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
              </ChartContainer>
            )}

            {showColorCoded && (
              <div className="space-y-4">
                <ChartContainer config={{}}>
                  <BarChart width={400} height={200} data={dpDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="confidence" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="training" fill="#ef4444" name="Training Data" />
                    <Bar dataKey="nonTraining" fill="#9b87f5" name="Non-training Data" />
                    <ReferenceLine
                      x={`${Math.floor(threshold[0] / 5) * 5}-${Math.floor(threshold[0] / 5) * 5 + 4}`}
                      stroke="red"
                      strokeDasharray="3 3"
                      label={{ value: `Threshold: ${threshold[0]}%`, position: 'top' }}
                    />
                  </BarChart>
                </ChartContainer>

                <div className="space-y-4">
                  {calculateCurrentAccuracy() && (
                    <Card className="p-4">
                      <h4 className="font-semibold mb-2">Attack Results</h4>
                      <p className="text-sm">
                        Accuracy: {calculateCurrentAccuracy()?.accuracy}%
                        <br />
                        True Positives: {calculateCurrentAccuracy()?.truePositives}
                        <br />
                        Total Predictions: {calculateCurrentAccuracy()?.totalPredictions}
                      </p>
                    </Card>
                  )}

                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Privacy-Utility Trade-off</h4>
                    <ChartContainer config={{}}>
                      <AreaChart width={400} height={150} data={calculateAccuracyVsEpsilon()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="epsilon" label={{ value: 'Epsilon (ε)', position: 'bottom' }} />
                        <YAxis label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="accuracy"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.3}
                          name="Model Accuracy"
                        />
                        <ReferenceLine
                          x={epsilon[0].toString()}
                          stroke="red"
                          strokeDasharray="3 3"
                          label={{ value: 'Current ε', position: 'top' }}
                        />
                      </AreaChart>
                    </ChartContainer>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StageFour;

