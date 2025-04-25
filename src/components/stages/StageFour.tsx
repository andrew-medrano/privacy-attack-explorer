
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Shield } from 'lucide-react';

interface StageFourProps {
  onComplete: () => void;
}

const generateDistribution = (epsilon: number) => {
  // Generate synthetic prediction distribution with differential privacy noise
  const baseProb = 0.7; // Base probability for positive class
  const noise = (1 / epsilon) * (Math.random() - 0.5) * 2; // Laplace noise scaled by epsilon
  return Math.max(0.1, Math.min(0.9, baseProb + noise));
};

const calculatePrivacyMetrics = (epsilon: number) => {
  const privacyLevel = Math.max(0, 1 - (epsilon * 0.1)); // Higher epsilon = lower privacy
  const utilityLoss = Math.min(1, (1 / epsilon) * 0.5); // Higher epsilon = lower utility loss
  const predictionAccuracy = Math.max(0.5, 1 - utilityLoss * 0.5); // Accuracy decreases with utility loss
  
  return {
    privacyLevel,
    utilityLoss,
    predictionAccuracy
  };
};

const StageFour: React.FC<StageFourProps> = ({ onComplete }) => {
  const [epsilon, setEpsilon] = useState([1]);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [guess, setGuess] = useState<'member' | 'non-member' | null>(null);
  const [metrics, setMetrics] = useState<ReturnType<typeof calculatePrivacyMetrics> | null>(null);

  const handleApplyDP = () => {
    const prob = generateDistribution(epsilon[0]);
    setPrediction(prob);
    setMetrics(calculatePrivacyMetrics(epsilon[0]));
    setGuess(null);
  };

  const handleGuess = (isMemeber: boolean) => {
    setGuess(isMemeber ? 'member' : 'non-member');
    // In reality, this would be much harder to guess with proper DP
    const guessCorrect = Math.random() > metrics?.privacyLevel;
    
    if (guessCorrect) {
      onComplete();
    }
  };

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-4">Stage 4: Differential Privacy</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Epsilon (ε)</label>
              <Slider 
                defaultValue={[1]} 
                max={10} 
                step={0.1}
                value={epsilon}
                onValueChange={setEpsilon}
              />
              <span className="text-sm text-muted-foreground mt-1 block">
                ε = {epsilon[0]} (smaller values = stronger privacy)
              </span>
            </div>
            
            <div className="p-4 bg-secondary/10 rounded-lg">
              <div className="flex gap-2 items-start">
                <Shield className="w-4 h-4 mt-1" />
                <p className="text-sm text-muted-foreground">
                  Differential privacy adds controlled noise to protect individual privacy while maintaining overall utility. 
                  Adjust epsilon to see how different noise levels affect the privacy-utility trade-off.
                </p>
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={handleApplyDP}
            >
              Apply Privacy Defense
            </Button>

            {prediction !== null && (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium">Model Prediction (with DP noise):</p>
                  <p className="text-2xl font-bold">{(prediction * 100).toFixed(1)}%</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleGuess(true)}
                    disabled={guess !== null}
                  >
                    Training Data Member
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleGuess(false)}
                    disabled={guess !== null}
                  >
                    Not in Training Data
                  </Button>
                </div>

                {guess && (
                  <p className="text-sm text-muted-foreground text-center">
                    You guessed: {guess === 'member' ? 'Training Data Member' : 'Not in Training Data'}
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Privacy-Utility Trade-off</h3>
          {metrics ? (
            <div className="space-y-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { name: 'Current', 
                        privacyLevel: metrics.privacyLevel * 100,
                        utilityLoss: metrics.utilityLoss * 100,
                        accuracy: metrics.predictionAccuracy * 100
                      }
                    ]}
                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Percentage', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="privacyLevel" 
                      name="Privacy Level" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="utilityLoss" 
                      name="Utility Loss" 
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="accuracy" 
                      name="Model Accuracy" 
                      stroke="#ffc658" 
                      fill="#ffc658" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-secondary/10 rounded-lg">
                  <p className="text-sm font-medium">Privacy Level</p>
                  <p className="text-xl font-bold">{(metrics.privacyLevel * 100).toFixed(1)}%</p>
                </div>
                <div className="text-center p-4 bg-secondary/10 rounded-lg">
                  <p className="text-sm font-medium">Utility Loss</p>
                  <p className="text-xl font-bold">{(metrics.utilityLoss * 100).toFixed(1)}%</p>
                </div>
                <div className="text-center p-4 bg-secondary/10 rounded-lg">
                  <p className="text-sm font-medium">Accuracy</p>
                  <p className="text-xl font-bold">{(metrics.predictionAccuracy * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Apply privacy defense to see metrics
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StageFour;
